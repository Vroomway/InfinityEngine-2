import { Vector3 } from '@dcl/sdk/math'
import { SpawnPoint } from './modules/SceneMgmt/types'
import { AvatarData } from './modules/avatar/avatarSwap'
import { InitAvatarTrap } from './modules/avatarTrap/avatarTrap'
import { TileSetData } from './modules/scene-slicer/interface.TileSet'
import { GridDebugType, TilesetGridDims } from './terrain/terrainGrid'
import { Collider } from './modules/cannon-colliders/interface.Collider'
import { WorldMoveVehicle, WorldMoveVehicleState } from './world/worldMoveVehicle'

/** how skybox is configured in scene */
export type SceneSkyboxConf={
    enabled:boolean
    /**  radius the skybox, how big the skybox is, defaults to scene radius*/
    radius: number
    /** folder to the slices of 360 images that form the skybox */
    materialFolder:string
}
/** how physics (cannonjs) in scene is configured */
export type ScenePhysicsConf={
    /** default physics values*/
    defaults:{
        /** gravity, see CONFIG.PHYSICS_DEFAULTS for scene default */
        gravity:Vector3
        /** friction, see CONFIG.PHYSICS_DEFAULTS for scene default*/
        friction:number
    }
    fixedTimeSteps:number
    maxTimeSteps:number
    /** config related to blender-dcltk-cannon-colliders  */
    colliderData:ColliderData
}

/** wrapper for the configuration needed to describe data exported by blender-dcltk-cannon-colliders */
export type ColliderData = {
    /** collider JSON that was exported out by blender-dcltk-cannon-colliders */
    collider: Collider[]
    /** optional if need to offset the model from what was exported. 
       * useful if need to align it with collider or make small tweaks to positioning */
    offset?: Vector3 
  }
  

/** wrapper for the configuration needed to describe data exported by blender-dcltk-scene-slice */
export type TileSetConf={
    /** tilset JSON that was exported out by blender-dcltk-scene-slice */
    data:TileSetData
    /** NEVER call directly, access thru getGridDims helper function
     * tileset measurements, the helper function 'measurements' will help generate this measurements 
     * store as a cache of sorts as should not change a lot
    */
    //FIXME this is hacky storagle location, find better way to encasulate this behind getGridDims
    //and ensure gets garbage collected to avoid a memory leak
    _measurements?:TilesetGridDims
    /** folder where the GLBs that were sliced life */
    modelFolder:string
    /** Deprecated - if if the coordinate system is not xyz */
    flipYandZ:boolean
    /** if need to offset the model from what was exported. 
     * useful if need to align it with collider or make small tweaks to positioning */
    tilesetOffset?:Vector3
}

/** how the spatial grid is configured */
export type SceneGridConf={
    /** config related to blender-dcltk-scene-slice */
    tileSetConf:TileSetConf
    /** config for debugging spacial grid */
    debug:GridDebugType
    /** radius in meters for which to check for neighors, load near, unload far */
    loadRadius: number
}
/** spawn points within a scene */
export type SpawnPointConf={
    default?:SpawnPoint 
}   
export type SceneConfig={
    /** how avatar trap is configured  */
    avatarTrap:InitAvatarTrap
    /** how avatar swap is rendered */
    avatar:AvatarData    
    /**how skybox is generated */
    skybox:SceneSkyboxConf
    /**how the spatial grid is configured */
    grid:SceneGridConf
    /**how physics will be configured for scene */
    physics:ScenePhysicsConf
    /**how physics will be configured for world vehicle */
    worldVehicle:WorldMoveVehicleState
    /** define spawn points within the scene */
    spawnPoints?:SpawnPointConf
}