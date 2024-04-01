import { Color4, Vector3 } from "@dcl/sdk/math";
import { getRealm } from "~system/Runtime";
import { ScenePhysicsConf, SceneSkyboxConf } from "./sceneConfigType";
import { GridDebugType } from "./terrain/terrainGrid";
import { InitAvatarTrap } from "./modules/avatarTrap/avatarTrap";
import { ColliderLayer } from "@dcl/sdk/ecs";
import { AvatarData } from "./modules/avatar/avatarSwap";
import { WorldMoveVehicleState } from "./world/worldMoveVehicle";
 
export const DEFAULT_ENV = "prd"          
  
//size of a parcel in meters
export const PARCEL_UNIT_METERS:number=16


//number of parcels X - use what your scene.json scene.parcels is set for
const ParcelCountX:number = 5//28//38
//number of parcels Z - use what your scene.json scene.parcels is set for
const ParcelCountZ:number = 5//28//38

export class Config {
  IN_PREVIEW = false; // can be used for more debugging of things, not meant to be enabled in prod
  
  //wallet addresses for who is a scene admin / can see debug UI
  ADMINS = [
    "any", //if set to any will allow anyone to see
  ];
  //if true will show debug UI IF admin passes
  TEST_CONTROLS_ENABLE = true;

  SHOW_CONNECTION_DEBUG_INFO = false;
  SHOW_PLAYER_DEBUG_INFO = false;
  SHOW_GAME_DEBUG_INFO = true; 
  DEBUG_ENABLE_TRIGGER_VISIBLE = true
   
  sizeX!:number
  sizeY!:number
  sizeZ!:number

  //if moving world around player
  MOVE_WORLD_AROUND_PLAYER = true
  //SPACIAL_GRID_CELL_SIZE = 16 
  SPACIAL_GRID_LOAD_RADIUS = 16*(ParcelCountX/2)//*3
  ENABLE_GRID_SYSTEM = true

  /** true center of scene */
  center!:Vector3 
  /** center of where infinity engine center is. allows tweaks to 
   * true center of scene to place the engine scene center somewhere else **/
  infinEngineCenter!:Vector3
  centerGround!:Vector3
  size!:Vector3
  parcelSize!:Vector3


  //DEFAULTS SHOULD INFINITY SCENE NOT SET THEIR OWN

  //why is gravity more than 2x real? get if of landing bound?
  //world.gravity.set(0, -18.8, 0) // m/s²
  PHYSICS_DEFAULTS:ScenePhysicsConf = {
    colliderData: undefined as any,

    fixedTimeSteps: 1.0 / 60, //seconds
    maxTimeSteps: 10,

    defaults:{
      gravity: Vector3.create(0,-9.8,0),
      friction: 0
    }
  }
  
  /** defaults for how avatar trap is */
  AVATAR_TRAP_DEFAULTS:InitAvatarTrap = {
    model:{
      src: "assets/avatar_trap.glb",
      invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    },
    offset: Vector3.create(0,-0.5,0)
  }

  /** defaults for how avatar is rendered */
  AVATAR_DEFAULTS:AvatarData = {
    id: "player",
    name:"this-player-name",
    body:{
      transform:{
        position: Vector3.create(0,-0.15,0),
        scale: Vector3.create(0.5,0.5,0.5)
      },
      mesh:{ 
        src: "assets/demo/skater.glb" ,
        invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
        visibleMeshesCollisionMask: ColliderLayer.CL_NONE
      }
    }
  }
  
  AVATAR2_DEFAULTS:AvatarData = {
    id: "player",
    name:"this-player-name",
    body:{
      transform:{
        position: Vector3.create(0,-0.15,0),
        scale: Vector3.create(0.5,0.5,0.5)
      },
      mesh:{ 
        src: "assets/demo/car.glb" ,
        invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
        visibleMeshesCollisionMask: ColliderLayer.CL_NONE
      }
    }
  }

  /** defaults for how skybox is generated */
  SKYBOX_DEFAULTS: SceneSkyboxConf = {
    enabled:true,
    radius: 16*(ParcelCountX/2),
    materialFolder: "images/skybox/8"
  }


  //TODO seperate conf from state!
  WORLD_VEHICLE_DEFAULTS:WorldMoveVehicleState={
    //conf stuf
    speed: 0,
    speedDecayEnabled: true,
    speedDecayFactor: 30*10,
    maxSpeed: 200,
    maxBackSpeed: -200 ,
    speedBackwardsFactor: 30*20,
    jumpImpulseForce: Vector3.create(0 ,25,0),

    mass: 5,
    shapeRadius: .5, //how big the sphere is
    linearDamping: 0.4,
    angularDamping: 0.4,
    //stat stuff
    gasActive: false,
    brakesActive: false,
    moveActive: false,
    jump: false,
    spin: false
  }


  /** the defaults when grid debug is enabled */
  GRID_DEBUG_DEFAULTS: GridDebugType = {
    enabled:false, 
    textOffset: Vector3.create(0,0,0),
    cellMaterial:{
      //texture: Material.Texture.,
      //albedoColor: Color4.fromHexString("#00000088"),
      albedoColor: Color4.fromHexString("#00000055"),
      specularIntensity: 0,
      metallic: 0,
      roughness: 1
  } 
  };

  initForEnv(){
    const env = DEFAULT_ENV
    
    //38x38
    //export const sceneCenter = Vector3.create(304,40,304)
    
    //const ParcelCountX:number = 45
    //const ParcelCountZ:number = 4

    
    this.sizeX = ParcelCountX*PARCEL_UNIT_METERS
    this.sizeZ = ParcelCountZ*PARCEL_UNIT_METERS 
    this.sizeY = (Math.log((ParcelCountX*ParcelCountZ) + 1) * Math.LOG2E) * 20// log2(n+1) x 20 //Math.log2( ParcelScale + 1 ) * 20
    this.size = Vector3.create(this.sizeX,this.sizeY,this.sizeZ)
    this.infinEngineCenter = Vector3.create(this.sizeX/2,this.sizeY/2 - 10,this.sizeZ/2)
    this.center = Vector3.create(this.sizeX/2,this.sizeY/2,this.sizeZ/2)
    this.centerGround = Vector3.create(this.sizeX/2,40,this.sizeZ/2)


    this.SKYBOX_DEFAULTS.radius = this.sizeX/2
    
    this.parcelSize = Vector3.create(this.sizeX/PARCEL_UNIT_METERS,this.sizeY/PARCEL_UNIT_METERS,this.sizeZ/PARCEL_UNIT_METERS)
  }

}
     
export let CONFIG: Config; // = new Config()//FIXME HACK DOUBLE INITTING

export async function initConfig() {
  if (CONFIG === undefined) {
    CONFIG = new Config();
    CONFIG.initForEnv()
    
    //set in preview mode from env, local == preview
    //isPreviewMode is deprecated
    //or is this the more correct way?
    await getRealm({}).then((val: any) => {
      setInPreview(val.realmInfo?.isPreview)
    })
  }
}

export function setInPreview(val: boolean) {
  console.log("setInPreview " + val);
  CONFIG.IN_PREVIEW = val;

  //var console: any

}
