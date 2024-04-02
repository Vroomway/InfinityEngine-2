import { Vector3 } from "@dcl/sdk/math"
import { log } from "../../back-ports/backPorts"
import { PlayerAvatar, initAvatarSwap } from "../../modules/avatar/avatarSwap"
import { BaseSubScene, IBaseEntityWrapper } from "../../modules/SceneMgmt/subScene"
import { destroyAvatarTrap, initAvatarTrap } from "../../modules/avatarTrap/avatarTrap"
import { Skybox } from "../../modules/skybox/skybox"
import { REGISTRY } from "../../registry"
import { SceneConfig } from "../../sceneConfigType"
import { createTerrainColliders } from "../../terrain/terrainColliders"
import { createTerrainGrid, destroyTerrainGrid, getGridDims } from "../../terrain/terrainGrid"
import { destroySpacePartition } from "../../utils/spacePartionUtil"
import { destroyWorldMove, destroyWorldState, initWorld, initWorldMove, initWorldState } from "../../world/worldMove"
import { createWorldMoveVehicleContacts, initWorldMoveVehicle } from "../../world/worldMoveVehicle"
import { movePlayerTo } from "~system/RestrictedActions"
import { CONFIG } from "../../config"
import { destroyPlayerControlSystem, initPlayerControlSystemSystem } from "../../world/worldPlayerControlSystem"

const CLASSNAME = "BaseScene"

export class BaseScene extends BaseSubScene{ 
  skybox!:Skybox
  avatar!:PlayerAvatar
  sceneConfig!:SceneConfig

  constructor( id: number,
    name: string){
    super(id,name)
  }

  init(): boolean | undefined {
    const METHOD_NAME = "init"
    log(CLASSNAME,this.name,METHOD_NAME,"ENTRY")

    //init will call listeners onInit that calls initWithConfig which does the heavy lifting
    //see initWithConfig for heavy lifting
    return super.init()
  }
  onInit(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onInit"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onInit(baseEntWrapper)

    //one timers?
    this.initWithConfig(this.sceneConfig)
  }
  initWithConfig(sceneConfig:SceneConfig){

    this.sceneConfig = sceneConfig
    
    if(sceneConfig.skybox.enabled){
      this.skybox = new Skybox({radius:sceneConfig.skybox.radius,materialFolder:sceneConfig.skybox.materialFolder})
    }

    createTerrainGrid(
      {
        id:"mvw-grid",
        position: Vector3.create(0,0,0),
        //dimX: GRID_WIDTH_X,
        //dimZ: GRID_WIDTH_Z,
        //dimY: GRID_WIDTH_Y,
        //cellSize: GRID_CELL_SIZE,
        //cellOffset: Vector3.create(CENTER_OFFSET,CENTER_OFFSET,CENTER_OFFSET),
        debug: sceneConfig.grid.debug,
        moveWithWorld:true,
        tileset: sceneConfig.grid.tileSetConf
      }
    )

    //one timers? and then hold ref to disable?
    this.initAvatar() //usable? or is this per world too?
    
    initAvatarTrap(sceneConfig.avatarTrap); //trap for avatar
    initWorld(sceneConfig) //create cannon world
    initWorldMoveVehicle(sceneConfig) //create world move vehicle
    initWorldState(sceneConfig,this.avatar) //create world state
    initWorldMove(sceneConfig); //activate world move
    initPlayerControlSystemSystem(REGISTRY.worldState) //create player control system
    const terrainColliders = createTerrainColliders({colliderData:sceneConfig.physics.colliderData})
    createWorldMoveVehicleContacts(terrainColliders) //create world move vehicle contacts

  }
  moveVehicleToDefaultSpawn(){
    const METHOD_NAME = "moveVehicleToDefaultSpawn"
    log(CLASSNAME,this.name,METHOD_NAME,"ENTRY")
    
    
    const gridDims = getGridDims(this.sceneConfig.grid.tileSetConf)
    
    //default to center of scene
    let spawnPoint = Vector3.clone(gridDims.gridSizeCenterMeters)
    
    if(this.sceneConfig.spawnPoints && this.sceneConfig.spawnPoints.default && this.sceneConfig.spawnPoints.default.position){
      spawnPoint = this.sceneConfig.spawnPoints.default.position?.toCenterVector3();
      log(CLASSNAME,METHOD_NAME,"custom spawnPoint",spawnPoint,"gridDims",gridDims)
    } else{
      log(CLASSNAME,METHOD_NAME,"default to center","spawnPoint",spawnPoint,"gridDims",gridDims)
    }

    if(this.sceneConfig.physics.colliderData.offset){
      spawnPoint.y += this.sceneConfig.physics.colliderData.offset.y
    }

    movePlayerTo({
      newRelativePosition: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y + 0.5, CONFIG.infinEngineCenter.z),
      cameraTarget: Vector3.create(CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y + 0.5, CONFIG.infinEngineCenter.z+2),
    })

    if(REGISTRY.physics.player){
      REGISTRY.physics.player.physicsBody.position.set(spawnPoint.x,spawnPoint.y,spawnPoint.z)
    }
  }
  initAvatar(){
    this.avatar = initAvatarSwap(this.sceneConfig.avatar)

    //TODO store avatar in registry instead of scene entities so can be more easily accessed
    if(this.avatar.rootEntity) this.entities.push(this.avatar.rootEntity);
  }
  destroy(){
    const METHOD_NAME = "destroy"
    log(CLASSNAME,this.name,METHOD_NAME,"ENTRY")
     
    destroyWorldMove()

    destroyAvatarTrap()

    destroyTerrainGrid()

    destroySpacePartition()

    destroyPlayerControlSystem()

    destroyWorldState()


    //TODO destroy avatar better, hide modifier not removed

    if(this.skybox){
      this.skybox.destroy();
      this.skybox = (undefined as any)
    } 

    super.destroy()
    //this.reset()

    //destroyAvatar()

    
  }
  onHide(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onHide"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onHide(baseEntWrapper)
  }
  onShow(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onShow"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onShow(baseEntWrapper)
  };
}