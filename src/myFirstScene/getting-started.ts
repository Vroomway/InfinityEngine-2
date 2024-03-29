
import { ColliderLayer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { CONFIG } from '../config'
import { REGISTRY } from '../registry'
import { SceneConfig } from '../sceneConfigType'
import { BaseScene } from '../scenes/common/baseScene'
import { SKATE_PARK_STOM_CONF_8_8_30 } from '../scenes/skateParkStom/skateParkSceneStomConfs'
import { MovesWithWorld } from '../world/worldMoveComponent'
import { SceneVector3Type, SpawnPoint } from '../modules/SceneMgmt/types'

// ███╗   ███╗██╗   ██╗    ███████╗ ██████╗███████╗███╗   ██╗███████╗
// ████╗ ████║╚██╗ ██╔╝    ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
// ██╔████╔██║ ╚████╔╝     ███████╗██║     █████╗  ██╔██╗ ██║█████╗  
// ██║╚██╔╝██║  ╚██╔╝      ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
// ██║ ╚═╝ ██║   ██║       ███████║╚██████╗███████╗██║ ╚████║███████╗
// ╚═╝     ╚═╝   ╚═╝       ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝                                                               
// 
//MAKE YOUR FIRST SCENE
//

// ██╗███╗   ███╗██████╗  ██████╗ ██████╗ ████████╗     ██████╗ ██████╗ ██╗     ██╗     ██╗██████╗ ███████╗██████╗ 
// ██║████╗ ████║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██╔═══██╗██║     ██║     ██║██╔══██╗██╔════╝██╔══██╗
// ██║██╔████╔██║██████╔╝██║   ██║██████╔╝   ██║       ██║     ██║   ██║██║     ██║     ██║██║  ██║█████╗  ██████╔╝
// ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗   ██║       ██║     ██║   ██║██║     ██║     ██║██║  ██║██╔══╝  ██╔══██╗
// ██║██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║   ██║       ╚██████╗╚██████╔╝███████╗███████╗██║██████╔╝███████╗██║  ██║
// ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝                                                                                                    
//
// IMPORT COLLIDER JSON EXPORTED FROM DCL Cannon Collider
// https://github.com/stom66/blender-dcltk-cannon-colliders
//
// CORRECT THE PATH TO MATCH WHERE YOU EXPORTED THE COLLIDER JSON
import colliderJSON from '../../models/stom-skatepark-8x8x30/colliders.json'

// ██╗███╗   ███╗██████╗  ██████╗ ██████╗ ████████╗    ███████╗██╗     ██╗ ██████╗███████╗██████╗ 
// ██║████╗ ████║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██║     ██║██╔════╝██╔════╝██╔══██╗
// ██║██╔████╔██║██████╔╝██║   ██║██████╔╝   ██║       ███████╗██║     ██║██║     █████╗  ██████╔╝
// ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗   ██║       ╚════██║██║     ██║██║     ██╔══╝  ██╔══██╗
// ██║██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║   ██║       ███████║███████╗██║╚██████╗███████╗██║  ██║
// ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝╚══════╝╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝
//
// IMPORT SLICER JSON EXPORTED FROM DCL Scene Slicer
// https://github.com/stom66/blender-dcltk-scene-slicer
//
// CORRECT THE PATH TO MATCH WHERE YOU EXPORTED THE TILESET
import tilesetJSON from '../../models/stom-skatepark-8x8x30/tileset.json'




// ███████╗ ██████╗███████╗███╗   ██╗███████╗     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗      ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝      ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
// ███████║╚██████╗███████╗██║ ╚████║███████╗    ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

function createSceneConfig():SceneConfig{
    let conf:SceneConfig ={ 
        //  █████╗ ██╗   ██╗ █████╗ ████████╗ █████╗ ██████╗     ████████╗██████╗  █████╗ ██████╗ 
        // ██╔══██╗██║   ██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗
        // ███████║██║   ██║███████║   ██║   ███████║██████╔╝       ██║   ██████╔╝███████║██████╔╝
        // ██╔══██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══██║██╔══██╗       ██║   ██╔══██╗██╔══██║██╔═══╝ 
        // ██║  ██║ ╚████╔╝ ██║  ██║   ██║   ██║  ██║██║  ██║       ██║   ██║  ██║██║  ██║██║     
        // ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝                                                                     
        avatarTrap: {
          ...CONFIG.AVATAR_TRAP_DEFAULTS, // '...' copies the value from defaults then override as needed
        },

        //  █████╗ ██╗   ██╗ █████╗ ████████╗ █████╗ ██████╗ 
        // ██╔══██╗██║   ██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗
        // ███████║██║   ██║███████║   ██║   ███████║██████╔╝
        // ██╔══██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══██║██╔══██╗
        // ██║  ██║ ╚████╔╝ ██║  ██║   ██║   ██║  ██║██║  ██║
        // ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝           
        avatar: {
          ...CONFIG.AVATAR_DEFAULTS, // '...' copies the value from defaults then override as needed
          body: {
            ...CONFIG.AVATAR_DEFAULTS.body, // '...' copies the value from defaults then override as needed
            // override as needed
            transform: {
              position: Vector3.create(0,-0.15,0),
              scale: Vector3.create(0.5,0.5,0.5)
            },
            mesh: { 
              src: "models/skater.glb" , // <<=== define what your avatar swap looks like              
              invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
              visibleMeshesCollisionMask: ColliderLayer.CL_NONE
            }
          }
        },

        // ███████╗██████╗  █████╗ ██╗    ██╗███╗   ██╗    ██████╗  ██████╗ ██╗███╗   ██╗████████╗███████╗
        // ██╔════╝██╔══██╗██╔══██╗██║    ██║████╗  ██║    ██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝██╔════╝
        // ███████╗██████╔╝███████║██║ █╗ ██║██╔██╗ ██║    ██████╔╝██║   ██║██║██╔██╗ ██║   ██║   ███████╗
        // ╚════██║██╔═══╝ ██╔══██║██║███╗██║██║╚██╗██║    ██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║   ╚════██║
        // ███████║██║     ██║  ██║╚███╔███╔╝██║ ╚████║    ██║     ╚██████╔╝██║██║ ╚████║   ██║   ███████║
        // ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═══╝    ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝                                                                                    
        // spawnPoints:{
        //     //if not set, will default center of tileset scene
        //     default: new SpawnPoint({
        //         position: new SceneVector3Type(25,7,55), 
        //     }) 
        // }, 

        // ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗     ██╗   ██╗███████╗██╗  ██╗██╗ ██████╗██╗     ███████╗
        // ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗    ██║   ██║██╔════╝██║  ██║██║██╔════╝██║     ██╔════╝
        // ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║    ██║   ██║█████╗  ███████║██║██║     ██║     █████╗  
        // ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║    ╚██╗ ██╔╝██╔══╝  ██╔══██║██║██║     ██║     ██╔══╝  
        // ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝     ╚████╔╝ ███████╗██║  ██║██║╚██████╗███████╗███████╗
        //  ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝       ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚══════╝                                                                                        
        worldVehicle: {
            ...CONFIG.WORLD_VEHICLE_DEFAULTS, //'...' copies the value from defaults then override as needed
            //override as needed
          },

        // ███████╗██╗  ██╗██╗   ██╗██████╗  ██████╗ ██╗  ██╗
        // ██╔════╝██║ ██╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚██╗██╔╝
        // ███████╗█████╔╝  ╚████╔╝ ██████╔╝██║   ██║ ╚███╔╝ 
        // ╚════██║██╔═██╗   ╚██╔╝  ██╔══██╗██║   ██║ ██╔██╗ 
        // ███████║██║  ██╗   ██║   ██████╔╝╚██████╔╝██╔╝ ██╗
        // ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═╝                                               
        skybox: {
          ...CONFIG.SKYBOX_DEFAULTS, // '...' copies the value from defaults then override as needed
          // override as needed
          enabled: true,
          materialFolder: "images/skybox/base"
        },

        //  ██████╗ ██████╗ ██╗██████╗ 
        // ██╔════╝ ██╔══██╗██║██╔══██╗
        // ██║  ███╗██████╔╝██║██║  ██║
        // ██║   ██║██╔══██╗██║██║  ██║
        // ╚██████╔╝██║  ██║██║██████╔╝
        //  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝                           
        grid: {
          tileSetConf: {
            data: tilesetJSON as any, // tilesetJSON for generated files from scene-slicer
            modelFolder: "models/stom-skatepark-8x8x30/", // MUST MATCH FOLDER for generated files from scene-slicer
            flipYandZ: false,
            tilesetOffset: Vector3.Zero()
          },
          loadRadius: CONFIG.SPACIAL_GRID_LOAD_RADIUS,
          debug: {
            ...CONFIG.GRID_DEBUG_DEFAULTS, // '...' copies the value from defaults then override as needed
            // override as needed
            enabled: CONFIG.GRID_DEBUG_DEFAULTS.enabled,
            textOffset: CONFIG.GRID_DEBUG_DEFAULTS.textOffset,
            cellMaterial: CONFIG.GRID_DEBUG_DEFAULTS.cellMaterial,
          }
        },

        // ██████╗ ██╗  ██╗██╗   ██╗███████╗██╗ ██████╗███████╗
        // ██╔══██╗██║  ██║╚██╗ ██╔╝██╔════╝██║██╔════╝██╔════╝
        // ██████╔╝███████║ ╚████╔╝ ███████╗██║██║     ███████╗
        // ██╔═══╝ ██╔══██║  ╚██╔╝  ╚════██║██║██║     ╚════██║
        // ██║     ██║  ██║   ██║   ███████║██║╚██████╗███████║
        // ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝ ╚═════╝╚══════╝                                      
        physics: { 
          ...CONFIG.PHYSICS_DEFAULTS, // '...' copies the value from defaults then override
          defaults: {
            ...CONFIG.PHYSICS_DEFAULTS.defaults, // '...' copies the value from defaults then override as needed
            // gravity: CONFIG.PHYSICS_DEFAULTS.defaults.gravity,
            // friction: CONFIG.PHYSICS_DEFAULTS.defaults.friction
          },
          colliderData: {
            collider: colliderJSON, // << === colliderJSON came from blender-dcltk-cannon-colliders
            offset: Vector3.Zero()}
          } 
        }

    return conf
}

export function initMyFirstScene():boolean{
    //DISABLED FOR NOW
    //REMOVE THIS ONE TO ACTIVATE THE BELOW CODE
    //if returns false, the below code is not ran and will load default scene
    return false; //<==== REMOVE THIS LINE TO ACTIVATE THE BELOW CODE
 
    //IF FOLLOWING README PUT YOUR SCENE CONFIG HERE    

    const MY_SCENE_CONF:SceneConfig = createSceneConfig()

    // ██████╗  █████╗ ███████╗██╗ ██████╗    ███████╗ ██████╗███████╗███╗   ██╗███████╗
    // ██╔══██╗██╔══██╗██╔════╝██║██╔════╝    ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
    // ██████╔╝███████║███████╗██║██║         ███████╗██║     █████╗  ██╔██╗ ██║█████╗  
    // ██╔══██╗██╔══██║╚════██║██║██║         ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
    // ██████╔╝██║  ██║███████║██║╚██████╗    ███████║╚██████╗███████╗██║ ╚████║███████╗
    // ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝    ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝
                                                                                     
    //turn off any current active scene
    if(REGISTRY.SCENE_MGR._activeScene){
        REGISTRY.SCENE_MGR._activeScene.destroy()
    } 

    //create a new scene
    const myScene = new BaseScene(REGISTRY.SCENE_MGR.generateSceneId(),"myScene")
    myScene.sceneConfig = MY_SCENE_CONF

    //init the scene, see BaseScene#initWithConfig does most of the heavy lifting
    myScene.init()

    //register this scene as the active scene
    REGISTRY.SCENE_MGR._activeScene = myScene

    //move player to center of your scene
    myScene.moveVehicleToDefaultSpawn()

    addAdditionalNonPhysicsEntities()
   
    //return true - tells the scene that myScene was loaded and not to load the default
    return true
}

function addAdditionalNonPhysicsEntities() {
  //  █████╗ ██████╗ ██████╗     ███████╗███╗   ██╗████████╗██╗████████╗██╗███████╗███████╗
    // ██╔══██╗██╔══██╗██╔══██╗    ██╔════╝████╗  ██║╚══██╔══╝██║╚══██╔══╝██║██╔════╝██╔════╝
    // ███████║██║  ██║██║  ██║    █████╗  ██╔██╗ ██║   ██║   ██║   ██║   ██║█████╗  ███████╗
    // ██╔══██║██║  ██║██║  ██║    ██╔══╝  ██║╚██╗██║   ██║   ██║   ██║   ██║██╔══╝  ╚════██║
    // ██║  ██║██████╔╝██████╔╝    ███████╗██║ ╚████║   ██║   ██║   ██║   ██║███████╗███████║
    // ╚═╝  ╚═╝╚═════╝ ╚═════╝     ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝   ╚═╝   ╚═╝╚══════╝╚══════╝
    // example of how to manually add entities                                                                                 
    
    /////////////////////////////////// START - make parent entity
    //define a _scene object to act as the parent of any of your interactive objects
    //this will help performance by reducing number of entities the movesWithWorldSystem has to track
    const _myNonPhysicsScene = engine.addEntity()
    MovesWithWorld.create(_myNonPhysicsScene,{id:"_myNonPhysicsScene"})
    Transform.createOrReplace(_myNonPhysicsScene, {
        //scale: Vector3.create(6,120,6),
    })
    //for debugging will assign it a material to see where it is in the world
    Material.setPbrMaterial(_myNonPhysicsScene, 
        {
            albedoColor: Color4.Black(),
            specularIntensity: 0,
            metallic: 0,
            roughness: 1
        } )
    //make it a box
    MeshRenderer.setBox(_myNonPhysicsScene)
    /////////////////////////////////// END - make parent entity

    //some cleverness to allow making it the parent or not to the other entities below
    const parentIt = _myNonPhysicsScene

    /////////////////////////////////// START
    //create a demo cube to be moved with the world
    const testCubeEntOrigin = engine.addEntity()
    const testCubeEntOriginPos = Vector3.create(0,0,0)
    Material.setPbrMaterial(testCubeEntOrigin, 
        {
            albedoColor: Color4.Green(),
            specularIntensity: 0,
            metallic: 0,
            roughness: 1
        } )
    MeshRenderer.setBox(testCubeEntOrigin)
    Transform.createOrReplace(testCubeEntOrigin, {
        //for testing - make it very tall for easy finding 
        scale: Vector3.create(1,120,1), 
        position: !parentIt ? Vector3.Zero() : testCubeEntOriginPos,
        parent:parentIt
    })
    if(!parentIt){ //if not parented to _myNonPhysicsScene, must add move with world
        MovesWithWorld.create(testCubeEntOrigin,{
            id:"testCubeEntOrigin",
            position: testCubeEntOriginPos
        }) 
    }
    /////////////////////////////////// END

    /////////////////////////////////// START
    //create a demo cube to be moved with the world
    const testCubeEntPositioned = engine.addEntity()
    //setting position, position can inferred from your blender base scene
    //or use the debug UI to get the player position standing near where you want it to be placed
    const testCubeEntPositionedPos = Vector3.create( 25,5,65)
    Material.setPbrMaterial(testCubeEntPositioned, 
        {
            albedoColor: Color4.White(),
            specularIntensity: 0,
            metallic: 0,
            roughness: 1
        } )
    MeshRenderer.setBox(testCubeEntPositioned)
    Transform.createOrReplace(testCubeEntPositioned, {
        //for testing - make it very tall for easy finding 
        scale: Vector3.create(3,120,3),
        position: !parentIt ? Vector3.Zero() : testCubeEntPositionedPos,
        parent:parentIt
    })
    if(!parentIt){ //if not parented to _myNonPhysicsScene, must add move with world
        MovesWithWorld.create(testCubeEntPositioned,{
            id:"testCubeEntPositioned",
            position: testCubeEntPositionedPos
        })
    } 
    /////////////////////////////////// END
}
