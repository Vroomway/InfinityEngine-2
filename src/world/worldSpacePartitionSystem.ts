import {  Entity, GltfContainer, InputAction, MeshRenderer, Move, NftFrameType, PointerEventType, RaycastQueryType, Transform, engine, inputSystem, raycastSystem } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import CANNON, { Vec3 } from "cannon";
import { MovesWithWorld } from "./worldMoveComponent";
import { WorldMoveVehicle } from "./worldMoveVehicle";
import { REGISTRY } from "../registry";
import { CONFIG } from "../config";
import { PlayerAvatar } from "../modules/avatar/avatarSwap";
import { log } from "../back-ports/backPorts";
import { IntervalUtil } from "../utils/interval-util";
import { getPlayerPositionRelative } from "./worldMoveHelpers";
import IGridEntity from "../modules/spacePartition/IGridEntity";
import { SYSTEM_PRIORITES, SystemState, SystemWrapperBasic } from "../utils/systemsHelpers";

//
//System determines nearby entities to be loaded and remove far away entities
//

const CLASSNAME = "worldSpacePartitionSystem.ts"
const logInterval = new IntervalUtil(1000)
const checkGridFrequency = new IntervalUtil(750)

let worldSpacePartitionSystem:SystemWrapperBasic

export function destroyWorldSpacePartitionSystem(){
  if(worldSpacePartitionSystem) worldSpacePartitionSystem.removeFromEngine()
}

export function initWorldSpacePartitionSystem(){
  const worldSpacePartitionState = new SystemState();

  //MOVE WITH WORLD SYSTEM
  const worldSpacePartitionSystemFn = (dt:number) => {
      if(worldSpacePartitionState.enabled === false) return;

      const worldState = REGISTRY.worldState

      const checkFreq = checkGridFrequency.update(dt)

      if(checkFreq){
        const logUpdate = logInterval.update(dt)
      
        const terrainPosRel = getPlayerPositionRelative()

        let inCube = 0
        //let neibors:any[] = []
        const cubeSize = worldState.gridLoadRadius

        //last active ones
        //TODO is this efficient? to make a new map each time?
        const lastActiveCells = new Map(worldState.currentActiveCells)

        REGISTRY.spacePartioner.getEntitiesInCube(terrainPosRel.x,terrainPosRel.y,terrainPosRel.z, cubeSize,
          (e: IGridEntity)=>{
          inCube++

          if(!worldState.currentActiveCells.has(e.id)){
            worldState.currentActiveCells.set(e.id,e)
            e.mgr.attach()
            e.mgr.show()
          }
          lastActiveCells.delete(e.id)
        })

        //anything left needs to be removed
        for(const [id,ent] of lastActiveCells){
          worldState.currentActiveCells.delete(id)
          ent.mgr.detach()
          ent.mgr.hide()
        }
        
        //console.log("playergridPos","cameraPos",cameraPos,"gridPos",gridPos,"gridEnts",gridEnts.length,"inCube",inCube,"mapSize",this.controller.grid?.map.size)

        if(logUpdate) log(CLASSNAME,"nearbyEntities",terrainPosRel,"inCube",inCube)//,"neibors",neibors)
      }

      //}
  }
  //END SYSTEM  

  if(worldSpacePartitionSystem){
    worldSpacePartitionSystem.removeFromEngine()
  }

  worldSpacePartitionSystem = new SystemWrapperBasic(
    {name:"worldSpacePartitionSystemFn",priority:SYSTEM_PRIORITES.REGULAR,fn:worldSpacePartitionSystemFn}
    ,worldSpacePartitionState);

  worldSpacePartitionSystem.addToEngine()
}