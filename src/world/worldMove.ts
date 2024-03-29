import { Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import CANNON from "cannon";
import { log } from "../back-ports/backPorts";
import { debugSpherePool } from "../debugSpherePool";
import { BaseAvatar } from "../modules/avatar/avatarSwap";
import { REGISTRY } from "../registry";
import { SceneConfig } from "../sceneConfigType";
import { getGridDims, getTileSetIdx } from "../terrain/terrainGrid";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../utils/systemsHelpers";
import { destroyMovesWithWorldSystem, initMovesWithWorldSystem } from "./movesWithWorldSystem";
import { WorldState } from "./worldMoveState";
import { destroyWorldSpacePartitionSystem, initWorldSpacePartitionSystem } from "./worldSpacePartitionSystem";

const CLASSNAME = "worldMove"

export function initWorld(sceneConf:SceneConfig){
  // Setup our world
  const world = new CANNON.World()
  REGISTRY.physics.world = world
  //TODO FIXME is broadphase needed?? vehicle ray cast is using it
  //default is NaiveBroadphase
  //https://sbcode.net/threejs/physics-cannonjs/
  //world.broadphase = new CANNON.SAPBroadphase(world)

  world.quatNormalizeSkip = 0
  world.quatNormalizeFast = false
  //why is gravity more than 2x real? get if of landing bound?
  //world.gravity.set(0, -18.8, 0) // m/s² 
  const g = sceneConf.physics.defaults.gravity
  world.gravity.set(g.x,g.y,g.z) // m/s²

  //is this needed?
  world.defaultContactMaterial.friction = sceneConf.physics.defaults.friction

  // Setup ground material
  REGISTRY.physics.groundMaterial = new CANNON.Material('groundMaterial')
  //MAKE CONFIG SO THIS LOADS CLEANER

}
export function initWorldMove(sceneConf:SceneConfig){
  const METHOD_NAME = "initWorldMove"
  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(REGISTRY.systems.worldStepSystem){
    log(CLASSNAME,METHOD_NAME,"already initialized!");
    return;
  }
  if(REGISTRY.physics.world === undefined){
    throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics world!!")
    return;
  }

  const world = REGISTRY.physics.world

  //debug markers
  let debugMarkers = new debugSpherePool()

  /*let terrainColliderShape = new CANNON.Trimesh(MeshVertices, MeshIndices)
  const terrainBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static //why is the trick 0 mass???
    position: new CANNON.Vec3(0, 0, 0)
  })
  terrainBody.material = groundMaterial
  terrainBody.addShape(terrainColliderShape)
  world.addBody(terrainBody)*/

/*
  let trackBColliderShape = new CANNON.Trimesh(Track1B_MeshVertices, Track1B_MeshIndices)
  const trackBBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static //why is the trick 0 mass???
    position: new CANNON.Vec3(0, 0, 0)
  })
  trackBBody.material = groundMaterial
  trackBBody.addShape(trackBColliderShape)
  world.addBody(trackBBody)*/
  
  
  const physicsConf =  sceneConf.physics

  const systemState = new SystemState();

  //keep ball, aka CANNON player
  function physicsSystem(dt: number) {
    if(systemState.enabled === false) return;

    // Instruct the world to perform a single step of simulation.
    // It is generally best to keep the time step and iterations fixed.
    world.step(physicsConf.fixedTimeSteps, dt, physicsConf.maxTimeSteps)    
    
    const vehicle = REGISTRY.worldState?.worldMoveVehicle
    if(vehicle){
        //update cannnon player with sdk player
        Vector3.copyFrom(vehicle.physicsBody.position, Transform.getMutable(vehicle.entity).position)
        Transform.getMutable(vehicle.entity).rotation = vehicle.physicsBody.quaternion
      // Transform.getMutable(avatarTrap).rotation = Quaternion.multiply(Transform.get(avatarTrap).rotation, Quaternion.fromEulerDegrees(0,10*dt,0) )
    }
  //
  //
    
  }

  const worldStepSystem = new SystemWrapperBasic(
    {name:"worldStepSystem",priority:SYSTEM_PRIORITES.REGULAR,fn:physicsSystem}
    ,systemState);

  //clear out old one
  if(REGISTRY.systems.worldStepSystem){
    (REGISTRY.systems.worldStepSystem as SystemWrapperBasic).removeFromEngine()
    REGISTRY.systems.worldStepSystem = undefined
  }

  //assign new one
  REGISTRY.systems.worldStepSystem = worldStepSystem
  REGISTRY.registerSystem(  worldStepSystem )
  worldStepSystem.addToEngine()

  initMovesWithWorldSystem()
  initWorldSpacePartitionSystem()
}
export function initWorldState(sceneConf:SceneConfig,car:BaseAvatar){
  const METHOD_NAME = "initWorldState"
  //TODO REFACTOR TO REGISTRY ADDING STATE + SYSTEMS
  if(!REGISTRY.physics.player){
    throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics player yet!!")
    return;
  }
  
  const worldState = REGISTRY.worldState = new WorldState(
    {
      worldMoveVehicle:REGISTRY.physics.player,
      car:car,
      gridLoadRadius: sceneConf.grid.loadRadius})

      worldState.updateWithSceneConf( sceneConf )
    //sceneConf.grid.tileSetConf.data.tile_dimensions[2]
}
export function destroyWorldState(){
  if(REGISTRY.worldState){
    REGISTRY.worldState.destroy()
    REGISTRY.worldState = undefined as any
  }
}
export function destroyWorldMove(){

  if(REGISTRY.systems.worldStepSystem){
    REGISTRY.unregisterSystem(  REGISTRY.systems.worldStepSystem )
    REGISTRY.systems.worldStepSystem.removeFromEngine()
    REGISTRY.systems.worldStepSystem = undefined
  }

  if(REGISTRY.physics.world){
    if(REGISTRY.physics.player){
      REGISTRY.physics.world.remove(REGISTRY.physics.player.physicsBody)
    }
    //remove all bodies
    for(const p of REGISTRY.physics.world.bodies){
      REGISTRY.physics.world.remove(p)
    }
  }

  if(REGISTRY.physics.player){
    engine.removeEntityWithChildren(REGISTRY.physics.player.entity)
    REGISTRY.physics.player = undefined
  }
  
  destroyMovesWithWorldSystem()
  destroyWorldSpacePartitionSystem()

  REGISTRY.physics = {}
}