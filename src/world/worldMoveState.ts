import {  CameraMode, Entity, GltfContainer, InputAction, MeshRenderer, Move, NftFrameType, PointerEventType, RaycastQueryType, Transform, engine, inputSystem, raycastSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import CANNON, { Vec3 } from "cannon";
import { MovesWithWorld } from "./worldMoveComponent";
import { WorldMoveVehicle } from "./worldMoveVehicle";
import { REGISTRY } from "../registry";
import { CONFIG } from "../config";
import { log } from "../back-ports/backPorts";
import { IntervalUtil } from "../utils/interval-util";
import { getPlayerPositionRelative } from "./worldMoveHelpers";
import IGridEntity from "../modules/spacePartition/IGridEntity";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../utils/systemsHelpers";
import { PlayerAvatar } from "../modules/avatar/avatarSwap";
import { SceneConfig } from "../sceneConfigType";
import { getGridDims, getTileSetIdx } from "../terrain/terrainGrid";

const VECTOR_FORWARD = Vector3.Forward()
const VECTOR_UP = Vector3.Up()
const VECTOR_ZERO = Vector3.Zero()

const CLASSNAME = "worldMoveState.ts"
const logInterval = new IntervalUtil(1000)
const checkGridFrequency = new IntervalUtil(750)
const VELOCITY_TOLERANCE = Vector3.create(0.01,0.01,0.01)
//export type PlayerControl

export class WorldState {
  worldMoveDir:Vector3
  //vehicleSpeedDir:Vector3 = Vector3.Zero()
  
  //moveVector:Vector3 = Vector3.Zero()
  //gravity:Vector3 = Vector3.create(0,-0.03,0)
  isGrounded:boolean = false
  //if below this will respawn player at respsawnPosY
  //defaults here, will be reassigned during initWorldState calls this.updateWithSceneConf
  respawnIfBelowPosY:number = -10
  respsawnPosY:number = 50
  //groundNormal:Vector3 = Vector3.Up()
  //groundBias:number = 0.1
  //debugVector:Vector3 = Vector3.Forward()
  debugEntity:Entity
  debugPoint:Entity
  car:PlayerAvatar
  //player state
  worldMoveVehicle:WorldMoveVehicle
  gridLoadRadius: number
  worldMoveDirBackwards:Vector3.Mutable = Vector3.Zero()

  currentActiveCells:Map<string,IGridEntity> = new Map()
  
  playerControlSystem:SystemWrapperBasic

  constructor(args:{
    car:PlayerAvatar,
    worldMoveVehicle:WorldMoveVehicle
    gridLoadRadius: number
  }){
      const car = this.car = args.car
      const worldMoveVehicle = this.worldMoveVehicle = args.worldMoveVehicle;

      this.gridLoadRadius = args.gridLoadRadius
      this.worldMoveDir = Vector3.Zero()
      //_worldVehicleState.gasActive = false  
      //_worldVehicleState.brakesActive = false  

      this.debugEntity = engine.addEntity()
      Transform.create(this.debugEntity, {
        position: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y, CONFIG.infinEngineCenter.z),
        scale: Vector3.create(1,1, 3)})
        if(CONFIG.SHOW_GAME_DEBUG_INFO){
          GltfContainer.create(this.debugEntity, {
            src: "assets/axis_forward.glb"
          })
        }

      this.debugPoint = engine.addEntity()
      Transform.create(this.debugPoint, {
        position: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y, CONFIG.infinEngineCenter.z),
        scale: Vector3.create(0.2,0.2, 0.2),
       // parent: vehicleRoot
      })
      if(CONFIG.SHOW_GAME_DEBUG_INFO){
        MeshRenderer.setSphere(this.debugPoint)
      }

     const playerControlState = new SystemState();

      //PLAYER CONTROLS SYSTEM
      const playerControlSystemFn = (dt:number) => {
          if(playerControlState.enabled === false) return;

          const worldVehicleState = this.worldMoveVehicle.state

          //TODO make a controls system
          //isPressed seems to be doing a better job espcially for lower FPS
          //isTriggered seems to get dropped
          worldVehicleState.gasActive = inputSystem.isPressed(InputAction.IA_FORWARD);
          worldVehicleState.brakesActive = inputSystem.isPressed(InputAction.IA_BACKWARD);
          worldVehicleState.spin = inputSystem.isPressed(InputAction.IA_SECONDARY);

          /*if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)){
              this.gasActive = true   
          }
          if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)){
            this.brakesActive = true   
          }*/

          //catch if UP happened but above reported pressed
          if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)){
            worldVehicleState.gasActive = false                
          }
          if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_UP)){
            worldVehicleState.brakesActive = false                
          }

          if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)){
            worldVehicleState.jump = true  
          }

          /*if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)){
            this.spin = true   
          }
          if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_UP)){
            this.spin = false  
          }*/

          if(worldVehicleState.gasActive){
            //TODO FIXME NEED TO SET SPEED
              worldVehicleState.speed=worldVehicleState.maxSpeed
              if(worldVehicleState.speed > worldVehicleState.maxSpeed){
                worldVehicleState.speed = worldVehicleState.maxSpeed
              }
          }else if(worldVehicleState.brakesActive){
            //from state!
            worldVehicleState.speed -= dt * worldVehicleState.speedBackwardsFactor
            if(worldVehicleState.speed < worldVehicleState.maxBackSpeed){
              worldVehicleState.speed = worldVehicleState.maxBackSpeed
            }
          }else{
              //FIXME solve speed decay vs gas on off
              if(worldVehicleState.speedDecayEnabled){
                worldVehicleState.speed -= dt * worldVehicleState.speedDecayFactor
              }else{
                worldVehicleState.speed = 0
              }
              //from state!
              if(worldVehicleState.speed < 0.1){
                worldVehicleState.speed = 0 
              }
          }

         
          const camTransform = Transform.getOrNull(engine.CameraEntity)
          let camHorizontal = VECTOR_ZERO
          if(camTransform){
            camHorizontal =  Vector3.rotate(VECTOR_FORWARD, camTransform.rotation)
            camHorizontal =  Vector3.multiplyByFloats( camHorizontal, 1,0,1)
            camHorizontal = Vector3.scale(camHorizontal, worldVehicleState.speed)
          

            //TODO FIXME APPLY A DRIFT FORCE HERE
            worldMoveVehicle.physicsBody.applyForce(new CANNON.Vec3(camHorizontal.x ,0,camHorizontal.z), worldMoveVehicle.physicsBody.position)
          } 
          //applyImpulse is exponential, would be good for boosting
          //ball.body.applyImpulse(new CANNON.Vec3(0 ,20,0), ball.body.position)
  
          if(worldVehicleState.jump){
            //from state!
            const impuse = new CANNON.Vec3(
                worldVehicleState.jumpImpulseForce.x,
                worldVehicleState.jumpImpulseForce.y,
                worldVehicleState.jumpImpulseForce.z);
            
            worldMoveVehicle.physicsBody.applyImpulse(impuse, worldMoveVehicle.physicsBody.position)
            worldVehicleState.jump = false
          } 

          const avatarTrap = REGISTRY.entities.avatarTrap

          const carTransform = Transform.getMutableOrNull(car.avatar)
          if(worldVehicleState.spin){
            //TODO FIXME, why are we rotating the trap????  is that needed????
            if(avatarTrap) Transform.getMutable(avatarTrap.entity).rotation = Quaternion.multiply(Transform.get(avatarTrap.entity).rotation, Quaternion.fromEulerDegrees(0,400*dt,0) )
            //from state!
            if(carTransform) carTransform.rotation = Quaternion.multiply(carTransform.rotation, Quaternion.fromEulerDegrees(0,400*dt,0) )
          } else{
            //from state! 

             if(
                carTransform && 
                //to stop car from face planting when tiny velocity near zero makes it think its moving down
                //Y by it self is bad as on flat wont move
                //this is a workaround, not perfect
                //can we use epsilon?? Vector3.equalsWithEpsilon to detect close to zero?
                (Math.abs(worldMoveVehicle.physicsBody.velocity.x) > .01 ||
                Math.abs(worldMoveVehicle.physicsBody.velocity.y) > .01 ||
                Math.abs(worldMoveVehicle.physicsBody.velocity.z) > .01)
             ){ 
              carTransform.rotation = Quaternion.slerp( carTransform.rotation, Quaternion.lookRotation(worldMoveVehicle.physicsBody.velocity, VECTOR_UP ) , 0.6 ) 
             }
            //Transform.getMutable(avatarTrap).rotation = Quaternion.lookRotation(ball.body.velocity, Vector3.Up() ) 
          }
          if(logInterval.update(dt)){
            log(CLASSNAME,"playerControlSystemFn","speed",worldVehicleState.speed,"gasActive",worldVehicleState.gasActive,"brakesActive",worldVehicleState.brakesActive,"spin",worldVehicleState.spin,"jump",worldVehicleState.jump
              ,"physics.velocity",worldMoveVehicle.physicsBody.velocity)//,Vector3.equalsWithEpsilon())
          }
          //DeBUG VECTOR VIZ
          if(CONFIG.SHOW_GAME_DEBUG_INFO && camHorizontal){
            let debugT = Transform.getMutable(this.debugEntity)
            debugT.rotation = Quaternion.fromToRotation(VECTOR_FORWARD, camHorizontal)
            debugT.scale.z = Vector3.length(camHorizontal)*0.05
          }

          //TODO MAKE THIS A SYSTEM, KEEP VEHICLE IN BOUNDS
          //transform.position.y = CONFIG.center.y
          //FIXME? SHOULD THIS BE IN THE WORLDMOVE GROUP?
          //keep it from falling thru bottom?
          if(worldMoveVehicle.physicsBody.position.y < this.respawnIfBelowPosY){   
            log(CLASSNAME,"playerControlSystemFn","respawned player","respawnIfBelowPosY",REGISTRY.worldState.respawnIfBelowPosY,"respsawnPosY",REGISTRY.worldState.respsawnPosY) 
            worldMoveVehicle.physicsBody.position.y =  this.respsawnPosY                  
          }
               
      }
      //END PLAYER CONTROL SYSTEM  
      
      this.playerControlSystem = new SystemWrapperBasic(
        {name:"playerControlSystemFn",priority:SYSTEM_PRIORITES.REGULAR,fn:playerControlSystemFn}
        ,playerControlState);

      this.playerControlSystem.addToEngine()

  }

  updateWithSceneConf(sceneConf: SceneConfig) {
    const gridData = getGridDims(sceneConf.grid.tileSetConf)
    const tiledata = sceneConf.grid.tileSetConf.data

    const tileSetIdx = getTileSetIdx(sceneConf.grid.tileSetConf)

    //take the origin of the tileset and move it down 1 cell meters as default  what if large tiles?
    this.respawnIfBelowPosY = tiledata.tileset_origin[tileSetIdx.y] - 10

    //start at base and up number of cells
    this.respsawnPosY = tiledata.tileset_origin[tileSetIdx.y] + gridData.gridSizeMeters.y +  10

    if(sceneConf.physics.colliderData.offset){
      this.respawnIfBelowPosY += sceneConf.physics.colliderData.offset.y
      this.respsawnPosY += sceneConf.physics.colliderData.offset.y
    }
  }
  destroy(){
    if(this.debugEntity) engine.removeEntity(this.debugEntity)
    if(this.debugPoint) engine.removeEntity(this.debugPoint)
    this.playerControlSystem.removeFromEngine()
  }
}
