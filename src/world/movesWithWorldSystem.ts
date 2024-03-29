import { Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CONFIG } from "../config";
import { REGISTRY } from "../registry";
import { IntervalUtil } from "../utils/interval-util";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../utils/systemsHelpers";
import { MovesWithWorld } from "./worldMoveComponent";

//
// System that moves the world around the player.  The player is held in place via the Avatar Trap
// 

const CLASSNAME = "movesWithWorldSystem.ts"
const logInterval = new IntervalUtil(1000)


const movesWithWorldState = new SystemState();

let movesWithWorldSystem:SystemWrapperBasic

export function destroyMovesWithWorldSystem(){
  if(movesWithWorldSystem) movesWithWorldSystem.removeFromEngine()
}
export function initMovesWithWorldSystem(){
  //MOVE WITH WORLD SYSTEM
  const movesWithWorldSystemFn = (dt:number) => {
      if(movesWithWorldState.enabled === false) return;

      const worldState = REGISTRY.worldState
      const backward = worldState.worldMoveDirBackwards
          
      Vector3.copyFrom(worldState.worldMoveVehicle.physicsBody.position, backward)
      //Vector3.copyFrom(Vector3.negate(backward), backward)
      //negate backward
      backward.x = -backward.x
      backward.y = -backward.y 
      backward.z = -backward.z
      Vector3.addToRef(CONFIG.infinEngineCenter,backward,backward)


      // console.log(CLASSNAME,"MOVING WORLD")
      const worldMoveGroup = engine.getEntitiesWith(MovesWithWorld, Transform)
    
      let posYUp = 20
      if(CONFIG.MOVE_WORLD_AROUND_PLAYER){
        for( const [obj,moveWithWrld] of worldMoveGroup){

            let transform = Transform.getMutable(obj) 

            
            Vector3.copyFrom(backward, transform.position)
    
            //move it off 0,0
            if(moveWithWrld.position){
              Vector3.addToRef(transform.position, moveWithWrld.position, transform.position)
              
              //transform.position.x += moveWithWrld.position.x
              //transform.position.y += moveWithWrld.position.y
              //transform.position.z += moveWithWrld.position.z

              
              //posYUp += 2
              //transform.position.x += 100
              //transform.position.z += 100
            }
            /*if(moveWithWrld.id 
                && 
                ( moveWithWrld.id.indexOf("-grid")>-1 )){
              transform.position.y += posYUp
              //posYUp += 2
              //transform.position.x += 100
              //transform.position.z += 100
            }*/

            /*if(logUpdate){
              log(CLASSNAME,"worldMoveGroup",moveWithWrld.id,"position",transform.position)
            }*/
            //transform.position.y = position.y
            //Transform.getMutable(vehicleRoot).rotation = Quaternion.slerp(Transform.getMutable(vehicleRoot).rotation, Quaternion.fromToRotation(this.vehicleMoveDir, camHorizontal), 0.1 )
        }
      }

          //const vehicleRotateGroup = engine.getEntitiesWith(VehicleRotation, Transform)

          // for( const [obj] of vehicleRotateGroup){
          //     const transform = Transform.getMutable(obj)

          //     transform.rotation = Quaternion.slerp(transform.rotation, Quaternion.lookRotation(forward, normal), 0.2 ) 
          // }    
          
          
      //}
  }
  //END SYSTEM  
  
  if(movesWithWorldSystem){
    movesWithWorldSystem.removeFromEngine()
  }
  

  movesWithWorldSystem = new SystemWrapperBasic(
    {name:"movesWithWorldSystemFn",priority:SYSTEM_PRIORITES.REGULAR,fn:movesWithWorldSystemFn}
    ,movesWithWorldState);

  movesWithWorldSystem.addToEngine()
}

