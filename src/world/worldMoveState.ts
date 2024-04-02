import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CONFIG } from "../config";
import { PlayerAvatar } from "../modules/avatar/avatarSwap";
import IGridEntity from "../modules/spacePartition/IGridEntity";
import { SceneConfig } from "../sceneConfigType";
import { getGridDims, getTileSetIdx } from "../terrain/terrainGrid";
import { IntervalUtil } from "../utils/interval-util";
import { WorldMoveVehicle } from "./worldMoveVehicle";

const VECTOR_FORWARD = Vector3.Forward()
const VECTOR_UP = Vector3.Up()
const VECTOR_ZERO = Vector3.Zero()

const CLASSNAME = "worldMoveState.ts"
const logInterval = new IntervalUtil(1000)
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
  }
}
