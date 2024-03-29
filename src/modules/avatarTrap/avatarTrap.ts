import { ColliderLayer, Entity, GltfContainer, PBGltfContainer, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { movePlayerTo } from "~system/RestrictedActions";
import { EntityWrapper, REGISTRY } from "../../registry";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../../utils/systemsHelpers";
import { CONFIG } from "../../config";
import { log } from "../../back-ports/backPorts";

const CLASSNAME = "avatarTrap"


export type AvatarTrapEntity=EntityWrapper&{
  entity:Entity
}

export type InitAvatarTrap={
  model: PBGltfContainer
  offset: Vector3
}
let lastArgs:InitAvatarTrap

const DEFAULT_ARGS: InitAvatarTrap = {
  model:{
      src: "models/avatar_trap.glb",
      invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
  },
  offset: Vector3.create(0,-0.5,0)
}

export function initAvatarTrap(args?:InitAvatarTrap){
  const METHOD_NAME = "initAvatarTrap"
  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(REGISTRY.entities.avatarTrap){
    log(CLASSNAME,METHOD_NAME,"already initialized!");
    return;
  }

  const initArgs = args || lastArgs || DEFAULT_ARGS
  lastArgs = initArgs

  const avatarTrap = engine.addEntity()

  REGISTRY.entities.avatarTrap = {entity:avatarTrap}

  Transform.create(avatarTrap, {
      position: Vector3.create(CONFIG.infinEngineCenter.x+initArgs.offset.x, CONFIG.infinEngineCenter.y+initArgs.offset.y, CONFIG.infinEngineCenter.z+initArgs.offset.z)
  })
  GltfContainer.create(avatarTrap, 
    initArgs.model
    )
  VisibilityComponent.create(avatarTrap, {visible:false})

  const OFFCENTER_TOLERANCE = 2
  const systemState = new SystemState();
  function keepPlayerCentered(dt:number) {
    //keeps the player in center
    const playerTransform = Transform.getOrNull(engine.PlayerEntity)
    if(!playerTransform){
      log(CLASSNAME,"keepPlayerCentered","no player transform skipping...");
      return; 
    }
    if(
      Math.abs(playerTransform.position.x - CONFIG.infinEngineCenter.x) > OFFCENTER_TOLERANCE 
      || Math.abs(playerTransform.position.z - CONFIG.infinEngineCenter.z) > OFFCENTER_TOLERANCE ){
      movePlayerTo({
        newRelativePosition: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y + 0.5, CONFIG.infinEngineCenter.z),
        cameraTarget: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y + 0.5, CONFIG.infinEngineCenter.z+2),
      })
    }     

    // Transform.getMutable(this.skyboxRoot).position.y = playerTransform.position.y-30

  }
  
  const keepPlayerCenteredSystem = new SystemWrapperBasic(
    {name:"keepPlayerCenteredSystem",priority:SYSTEM_PRIORITES.REGULAR,fn:keepPlayerCentered}
    ,systemState);
  
  REGISTRY.systems.keepPlayerCenteredSystem = keepPlayerCenteredSystem
  REGISTRY.registerSystem(  keepPlayerCenteredSystem )
  keepPlayerCenteredSystem.addToEngine()

  //move avatar trap, why is this needed?
  Transform.getMutable(avatarTrap).position.y = CONFIG.infinEngineCenter.y - 0.9 

}

export function destroyAvatarTrap(){
  if(REGISTRY.systems.keepPlayerCenteredSystem){ 
    REGISTRY.unregisterSystem(  REGISTRY.systems.keepPlayerCenteredSystem )
    REGISTRY.systems.keepPlayerCenteredSystem.removeFromEngine()
    REGISTRY.systems.keepPlayerCenteredSystem = undefined
  }
  if(REGISTRY.entities.avatarTrap){
    const trap = REGISTRY.entities.avatarTrap
    REGISTRY.entities.avatarTrap = undefined as any
    engine.removeEntityWithChildren(trap.entity)
  }
}