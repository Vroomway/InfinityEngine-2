# Infinity Engine Configuration
--

[Back to main readme](../README.md)

### SceneConfig

See [src/sceneConfigType.ts](src/sceneConfigType.ts) for configuration types


### Example 

Example of a scene config largely inheriting defaults from ```src/config.ts```

```ts
const SKATE_PARK_STOM_CONF_8_8_30:SceneConfig = { 
  avatarTrap: {
    ...CONFIG.AVATAR_TRAP_DEFAULTS, //take defaults then override as needed
  },
  avatar: {
    ...CONFIG.AVATAR_DEFAULTS, //take defaults then override as needed
    body: {
      ...CONFIG.AVATAR_DEFAULTS.body, //take defaults then override as needed
      //override as needed
      transform: {
        position: Vector3.create(0,-0.15,0),
        scale: Vector3.create(0.5,0.5,0.5)
      },
      mesh: { 
        src: "models/skater.glb",
        invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
        visibleMeshesCollisionMask: ColliderLayer.CL_NONE
      }
    }
  },
  spawnPoints:{
            //if not set, will default center of tileset scene
            // default: new SpawnPoint({
            //     position: new SceneVector3Type(25,7,55), 
            // }) 
  }, 
  worldVehicle: {
    ...CONFIG.WORLD_VEHICLE_DEFAULTS, //take defaults then override as needed
    //override as needed
  },
  skybox: {
    ...CONFIG.SKYBOX_DEFAULTS, 
    //take defaults then override as needed
    enabled: true,
    materialFolder: "images/skybox/base"
  },
  grid: {
    tileSetConf: {
      //FIXME this is a hack to get the tileset to work had to cast as any
      data: tilesetJSON_8x8_30 as any, // tilesetJSON for generated files from scene-slicer
      modelFolder: "models/stom-skatepark-8x8x30/", // MUST MATCH FOLDER for generated files from scene-slicer
      flipYandZ: false,
      tilesetOffset: tilesetOffset
    },
    loadRadius: CONFIG.SPACIAL_GRID_LOAD_RADIUS,
    debug: {
      ...CONFIG.GRID_DEBUG_DEFAULTS, 
      //take defaults then override as needed
      //enabled: CONFIG.GRID_DEBUG_DEFAULTS.enabled,
      //textOffset: CONFIG.GRID_DEBUG_DEFAULTS.textOffset,
      //cellMaterial: CONFIG.GRID_DEBUG_DEFAULTS.cellMaterial,
    }
  },
  physics: { 
    ...CONFIG.PHYSICS_DEFAULTS, //take defaults then override
    defaults: {
      ...CONFIG.PHYSICS_DEFAULTS.defaults, 
      //take defaults then override as needed
      //gravity: CONFIG.PHYSICS_DEFAULTS.defaults.gravity,
      //friction: CONFIG.PHYSICS_DEFAULTS.defaults.friction
    },
    colliderData: {
      collider: colliderJSON, // << === colliderJSON came from blender-dcltk-cannon-colliders 
      offset: colliderOffset 
    }
  } 
}
```


