import { Vector3 } from "@dcl/sdk/math";
import colliderJSON from '../../../../assets/demo/stom-skatepark-8x8x30/colliders.json';
import tilesetJSON_8x8_30 from '../../../../assets/demo/stom-skatepark-8x8x30/tileset.json';
import { CONFIG } from "../../../config";
import { SceneConfig } from "../../../sceneConfigType";
import { ColliderLayer } from "@dcl/sdk/ecs";
import { SceneVector3Type, SpawnPoint } from "../../../modules/SceneMgmt/types";

export let SKATE_PARK_STOM_CONF_8_8_30:SceneConfig

export function initSkateParkStomConfs(){
    //the tiles are offset from what the whole model we made was so using this to shift
    
    const tilesetOffset = Vector3.create(0,0,0)
    const colliderOffset = Vector3.create(0,0 + tilesetOffset.y,0)

    SKATE_PARK_STOM_CONF_8_8_30 = { 
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
            src: "assets/demo/skater.glb" ,
            //src: "assets/demo/car.glb" ,
            invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
            visibleMeshesCollisionMask: ColliderLayer.CL_NONE
          }
        }
      },
      //will default to center of grid if not set
      // spawnPoints:{
      //   default: new SpawnPoint({
      //       position: new SceneVector3Type(148,6,85),
      //   })
      // },
      worldVehicle: {
        ...CONFIG.WORLD_VEHICLE_DEFAULTS, //take defaults then override as needed
        //override as needed
      },
      skybox:{
        ...CONFIG.SKYBOX_DEFAULTS, //take defaults then override as needed
        //override as needed
        enabled: true,
        materialFolder: "assets/images/skybox/base"
      },
      grid:{
        tileSetConf: {
          //FIXME this is a hack to get the tileset to work had to cast as any
          data: tilesetJSON_8x8_30 as any,
          modelFolder: "assets/demo/stom-skatepark-8x8x30/",
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