import { Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CONFIG } from "../config";
import { REGISTRY } from "../registry";

const CLASSNAME = "worldMoveHelpers.ts"

/**
 * 
 * @returns Vector3 player position relative to the world grid
 */
export function getPlayerPositionRelative():Vector3{
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return Vector3.Zero()//' playerPosition no data yet'
  const { x, y, z } = playerPosition.position
  if(!CONFIG.MOVE_WORLD_AROUND_PLAYER){
    return Vector3.create(x,y,z)
  }
  if (!REGISTRY.entities.moveWithWorldGrid) return Vector3.Zero()//' playerPosition no data yet'
  const terrainPos = Transform.getOrNull(REGISTRY.entities.moveWithWorldGrid.entity)
  
  if (!terrainPos) return Vector3.Zero()//'terrainPos no data yet'
  
  let tx = terrainPos.position.x
  let ty = terrainPos.position.y
  let tz = terrainPos.position.z

  let gx=CONFIG.infinEngineCenter.x - tx
  let gy=CONFIG.infinEngineCenter.y - ty
  let gz=CONFIG.infinEngineCenter.z - tz

  return Vector3.create(gx,gy,gz)
}