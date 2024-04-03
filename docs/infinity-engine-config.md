# Infinity Engine Configuration
--

[Back to main readme](../README.md)


### Infinity Engine defaults

default properties used by the engine. These can be over-ridden on a per-scene basis.


  ```ts
  //src/config.ts
  AVATAR_TRAP_DEFAULTS   // #72 - defaults for how avatar trap is configured
  AVATAR_DEFAULTS        // #81 - defaults for how avatar swap is rendered
  SKYBOX_DEFAULTS        // #116 - defaults for how skybox is generated
  WORLD_VEHICLE_DEFAULTS // #124 - defaults for how world vehicle is configured
  GRID_DEBUG_DEFAULTS    // #148 - the defaults when grid debug is enabled
  ```


### SceneConfig

See [src/sceneConfigType.ts](src/sceneConfigType.ts) for configuration types


| Property | Term                      | Desc
| ---      | ---                       | ---
| `avatarTrap` | Avatar Trap 				 |Holds the DCL avatar in place so Infinity Engine can move scene around player
| `avatar` |AvatarSwap                | Hide the default DCL avatar and replace with a custom model.
| `spawnPoints ` | Spawn Point                | Spawn point for player inside the Infinity Engine scene
| `worldVehicle` | World Vehicle                | The vehicle that represents the player in the Inifinity Engine Scene
| `skybox` |SkyBox                    | Hide the default DCL skybox and surround scene with a custom one
| `grid` | Spacial Partition         | To optimize managing a large number of objects we break them down into smaller chunks. Read more about the concept here: <https://gameprogrammingpatterns.com/spatial-partition.html>
| `physics` |Physics                  | Tune physics engine settings

### Example 

Example of a scene config largely inheriting defaults from `src/config.ts`

Example usage can be found here [https://github.com/Vroomway/InfinityEngine-2/blob/main/src/scenes/demo/skateParkStom/skateParkSceneStomConfs.ts#L17](https://github.com/Vroomway/InfinityEngine-2/blob/main/src/scenes/demo/skateParkStom/skateParkSceneStomConfs.ts#L17)

```ts
let conf:SceneConfig ={ 
        //  █████╗ ██╗   ██╗ █████╗ ████████╗ █████╗ ██████╗     ████████╗██████╗  █████╗ ██████╗ 
        // ██╔══██╗██║   ██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗
        // ███████║██║   ██║███████║   ██║   ███████║██████╔╝       ██║   ██████╔╝███████║██████╔╝
        // ██╔══██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══██║██╔══██╗       ██║   ██╔══██╗██╔══██║██╔═══╝ 
        // ██║  ██║ ╚████╔╝ ██║  ██║   ██║   ██║  ██║██║  ██║       ██║   ██║  ██║██║  ██║██║     
        // ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝                                                                     
        avatarTrap: {
          ...CONFIG.AVATAR_TRAP_DEFAULTS, // '...' copies the value from defaults then override as needed
          // override as needed
          // model:{
          //   src: "assets/avatar_trap.glb",
          //   invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
          // },
          // offset: Vector3.create(0,-0.5,0)
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
              src: "assets/demo/skater.glb" , // <<=== define what your avatar swap looks like              
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
            // speed: 0,
            // speedDecayEnabled: true,
            // speedDecayFactor: 30*10,
            // maxSpeed: 200,
            // maxBackSpeed: -200 ,
            // speedBackwardsFactor: 30*20,
            // jumpImpulseForce: Vector3.create(0 ,25,0),

            // mass: 5,
            // shapeRadius: .5, //how big the sphere is
            // linearDamping: 0.4,
            // angularDamping: 0.4,
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
          //radius: 16*(ParcelCountX/2),
          materialFolder: "assets/images/skybox/base"
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
            modelFolder: "assets/demo/stom-skatepark-8x8x30/", // MUST MATCH FOLDER for generated files from scene-slicer
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
```



# FAQs

### How do I change Infinity Engine scene center 

  You may want to do this if you have a very large scene but want to position where the infinty engine scene spawns

  ```ts
  //src/config.ts#Config.initForEnv()
  //set infinity engine center here. be considerate of overall scene.json size
  this.infinEngineCenter = Vector3.create(this.sizeX/2,this.sizeY/2 - 10,this.sizeZ/2)
  ```


### How do I increase scene size

* update scene.json
* update config at `src/config.ts`

NOTE: Infinity Engine scene can be set smaller than the actual scene.  
    
Example you have a 20x20 scene but want the Infinity Engine scene to be 4x4 because your tile dimentions and load radius are small.

* **Parcel size:** defines the size of the scene. Set these to match the `tile_dimensions` declared in `scene.json`

	```ts
	//src/config.ts - line #16
	const ParcelCountX = 5
	const ParcelCountZ = 5
	```
	
### How do I change the Grid loadRadius

It defaults to 50% the size of the scene AKA will be the full scene


Make sure the load radius is not too big.  Set these to complement the `tile_dimensions`.  Load radius is not recommended to be larger than 4x your x and z tile sizes for performance reasons.

* *Globally:** defines the load radius globally. 

	```ts
	//src/config.ts
	SPACIAL_GRID_LOAD_RADIUS:number = 16*(ParcelCountX/2) //CHANGE HERE
	```
	
* *Per Scene:** defines the load radius per scene. 

	```ts
	//declared type	in src/sceneConfigType.ts
	SceneGridConf.loadRadius:number
	```
	
	```ts
	const MY_SCENE_CONF:SceneConfig = { 
	  ...
	  grid: {
	    ...
	    loadRadius: CONFIG.SPACIAL_GRID_LOAD_RADIUS, //CHANGE HERE
	    ...}
	```
