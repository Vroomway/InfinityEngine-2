import { Vector3 } from "@dcl/sdk/math";
import colliderJSON from '../../../models/vw-racetrack-8x8x32/colliders.json';
import tilesetJSON_8x8_30 from '../../../models/vw-racetrack-8x8x32/tileset.json';
import { CONFIG } from "../../config";
import { SceneConfig } from "../../sceneConfigType";
import { ColliderLayer } from "@dcl/sdk/ecs";
import { SceneVector3Type, SpawnPoint } from "../../modules/SceneMgmt/types";

export let RACE_TRACK_CONF_8_8_32:SceneConfig

export function initRaceTrackSceneConf(){
    //the tiles are offset from what the whole model we made was so using this to shift
    
    const tilesetOffset = Vector3.create(0,0,0)
    const colliderOffset = Vector3.create(0,0 + tilesetOffset.y,0)

    RACE_TRACK_CONF_8_8_32 = { 
      avatarTrap: {
        ...CONFIG.AVATAR_TRAP_DEFAULTS, //take defaults then override as needed
      },
      avatar: {
        ...CONFIG.AVATAR_DEFAULTS, //take defaults then override as needed
        body:{
          ...CONFIG.AVATAR_DEFAULTS.body, //take defaults then override as needed
          //override as needed
          transform:{
            position: Vector3.create(0,-0.15,0),
            scale: Vector3.create(0.5,0.5,0.5)
          },
          mesh:{ 
            src: "models/skater.glb" ,
            //src: "models/car.glb" ,
            invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
            visibleMeshesCollisionMask: ColliderLayer.CL_NONE
          }
        }
      },
      spawnPoints:{
        default: new SpawnPoint({
            position: new SceneVector3Type(148,6,85),
        })
      },
      worldVehicle: {
        ...CONFIG.WORLD_VEHICLE_DEFAULTS, //take defaults then override as needed
        //override as needed
      },
      skybox:{
        ...CONFIG.SKYBOX_DEFAULTS, //take defaults then override as needed
        //override as needed
        enabled: true,
        materialFolder: "images/skybox/7"
      },
      grid:{
        tileSetConf: {
          //FIXME this is a hack to get the tileset to work had to cast as any
          data: tilesetJSON_8x8_30 as any,
          modelFolder: "models/vw-racetrack-8x8x32/",
          flipYandZ: false,
          tilesetOffset: tilesetOffset
        },
        loadRadius: CONFIG.SPACIAL_GRID_LOAD_RADIUS,
        debug:{
          ...CONFIG.GRID_DEBUG_DEFAULTS, //take defaults then override as needed
          //override as needed
          enabled: CONFIG.GRID_DEBUG_DEFAULTS.enabled,
          textOffset: CONFIG.GRID_DEBUG_DEFAULTS.textOffset,
          cellMaterial: CONFIG.GRID_DEBUG_DEFAULTS.cellMaterial,
        }
      },
      physics: { 
        ...CONFIG.PHYSICS_DEFAULTS,//take defaults then override
        defaults: {
          ...CONFIG.PHYSICS_DEFAULTS.defaults,//take defaults then override as needed
          //override as needed
          //gravity: CONFIG.PHYSICS_DEFAULTS.defaults.gravity,
          //friction: CONFIG.PHYSICS_DEFAULTS.defaults.friction
        },
        colliderData: {collider: colliderJSON, offset: colliderOffset}
      } 
    }
}