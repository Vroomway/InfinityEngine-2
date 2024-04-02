import { InputAction, PointerEventType, Transform, engine, inputSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import CANNON from "cannon";
import { log } from "../back-ports/backPorts";
import { CONFIG } from "../config";
import { REGISTRY } from "../registry";
import { IntervalUtil } from "../utils/interval-util";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../utils/systemsHelpers";
import { WorldState } from "./worldMoveState";

const VECTOR_FORWARD = Vector3.Forward()
const VECTOR_UP = Vector3.Up()
const VECTOR_ZERO = Vector3.Zero()

const CLASSNAME = "worldPlayerControlSystemnSystem.ts"
const logInterval = new IntervalUtil(1000)
const checkGridFrequency = new IntervalUtil(750)
const VELOCITY_TOLERANCE = Vector3.create(0.01,0.01,0.01)
//export type PlayerControl


let playerControlSystem:SystemWrapperBasic


export function destroyPlayerControlSystem(){
  if(playerControlSystem) playerControlSystem.removeFromEngine()
}

export function initPlayerControlSystemSystem(worldState:WorldState){
    
     const playerControlState = new SystemState();

      //PLAYER CONTROLS SYSTEM
      const playerControlSystemFn = (dt:number) => {
          if(playerControlState.enabled === false) return;

          const worldMoveVehicle = worldState.worldMoveVehicle
          const worldVehicleState = worldMoveVehicle.state

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

          const carTransform = Transform.getMutableOrNull(worldState.car.avatar)
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
            let debugT = Transform.getMutable(worldState.debugEntity)
            debugT.rotation = Quaternion.fromToRotation(VECTOR_FORWARD, camHorizontal)
            debugT.scale.z = Vector3.length(camHorizontal)*0.05
          }

          //TODO MAKE THIS A SYSTEM, KEEP VEHICLE IN BOUNDS
          //transform.position.y = CONFIG.center.y
          //FIXME? SHOULD THIS BE IN THE WORLDMOVE GROUP?
          //keep it from falling thru bottom?
          if(worldMoveVehicle.physicsBody.position.y < worldState.respawnIfBelowPosY){   
            log(CLASSNAME,"playerControlSystemFn","respawned player","respawnIfBelowPosY",REGISTRY.worldState.respawnIfBelowPosY,"respsawnPosY",REGISTRY.worldState.respsawnPosY) 
            worldMoveVehicle.physicsBody.position.y =  worldState.respsawnPosY                  
          }
               
      }
      //END PLAYER CONTROL SYSTEM  
      
      playerControlSystem = new SystemWrapperBasic(
        {name:"playerControlSystemFn",priority:SYSTEM_PRIORITES.REGULAR,fn:playerControlSystemFn}
        ,playerControlState);

      playerControlSystem.addToEngine()
}