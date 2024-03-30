# Getting Started
--

[Back to main readme](../README.md)

# Making a scene from scratch

## 1) Create the project folder

We will use this repo (`infinity-engine-sdk7-template`) as a starter scene to get you off the ground faster.

1) Clone the repository
1) Open the repository in VSCode
1) Place your non-deployable assets - such as .blend files - in the `assets` folder
2) Create the folder `models/myFirstScene`



## 2) Export scene: use Blender Slicer and Collider tools

1) Ensure you have installed Blender, install plugins [blender-dcltk-scene-slicer](https://github.com/stom66/blender-dcltk-scene-slicer), and [blender-dcltk-cannon-colliders](https://github.com/stom66/blender-dcltk-cannon-colliders)
1) Follow steps for blender-dcltk-scene-slicer.  Export your sliced models into the scene folder `models/myFirstScene`.
1) Follow steps for blender-dcltk-cannon-colliders. Export your `colliders.json` into scene folder `models/myFirstScene`.
1) Before you continue verify your exported folder `models/myFirstScene` looks similar to this format:

	
```
//models/myFirstScene  
   ├──tex (textures here)
   |   └──*.png  
   ├──tile_0_1_0.bin
   ├──tile_0_1_0.gltf
   ├──tile_0_1_1.gltf
   ├──tile_0_1_1.gltf
   ├──...
   ├──tileset.json
   └──colliders.json
```

Ensure that it:
* Has a `tileset.json` file
* Has many sliced models `tile_*`
* Has a `tex` folder for any model textures
* Has a `colliders.json` file

## 3) Configure scene

Inside the `src/myFirstScene/getting-started.ts#createSceneConfig()` method. Adjust as nessesary:
	
> NOTE: All code for `src/myFirstScene/getting-started.ts#initMyFirstScene()` is already there just commented out. 
	
1) **Remove the return statement to activate code:**


    ```ts
    //src/myFirstScene/getting-started#initMyFirstScene()
    export function initMyFirstScene(){
    //DISABLED FOR NOW
    //REMOVE THIS ONE TO ACTIVATE THE BELOW CODE
    return; //<==== REMOVE THIS LINE TO ACTIVATE THE BELOW CODE
 	```


1) **Import your collider and tileset at the top of file:**

	Inside the `src/myFirstScene/getting-started.ts#createSceneConfig()` method. Adjust as nessesary:
	> NOTE: All code for `src/myFirstScene/getting-started.ts#initMyFirstScene()` is already there just commented out.  You can uncomment or copy paste what is here into it


	```ts
	//src/myFirstScene/getting-started
	import colliderJSON from '../models/myFirstScene/colliders.json'
	import tilesetJSON from '../models/myFirstScene/tileset.json'
	``` 

1) **Define scene configuration:**

	See full description of each option here: [Infinity Engine Configuration](./infinity-engine-config.md)

	Inside the `src/myFirstScene/getting-started.ts#createSceneConfig()` method. Adjust as nessesary:
	> NOTE: All code for `src/myFirstScene/getting-started.ts#initMyFirstScene()` is already there just commented out.  You can uncomment or copy paste what is here into it
	
    ```ts
    //src/myFirstScene/getting-started#createSceneConfig()
    function createSceneConfig():SceneConfig{
    let conf:SceneConfig ={ 
    ```
    
	Main things to update here are
	
	```ts
	// CORRECT THE PATH TO MATCH WHERE YOU EXPORTED THE COLLIDER JSON
	import colliderJSON from '../../models/stom-skatepark-8x8x30/colliders.json'
	```
	
	```ts
	// CORRECT THE PATH TO MATCH WHERE YOU EXPORTED THE TILESET
	import tilesetJSON from '../../models/stom-skatepark-8x8x30/tileset.json'
	```    
	
	```ts
		grid: {
          tileSetConf: {
            // CORRECT THE PATH TO MATCH WHERE YOU EXPORTED THE TILESET
            // MUST MATCH FOLDER for generated files from scene-slicer	
            modelFolder: "models/stom-skatepark-8x8x30/", //<== CORRECT THE PATH TO MATCH WHERE YOU EXPORTED MODELS
            ...
   ```
	
1) **Create a Basic Scene:**

    Inside the `src/myFirstScene/getting-started#initMyFirstScene()`

    ```ts
    //src/myFirstScene/getting-started#initMyFirstScene()

    const MY_SCENE_CONF:SceneConfig = createSceneConfig()

	//turn off any current active scene
    if(REGISTRY.SCENE_MGR._activeScene){
        REGISTRY.SCENE_MGR._activeScene.destroy()
    }

    //create a new scene
    const myScene = new BaseScene(REGISTRY.SCENE_MGR.generateSceneId(),"myScene")
    myScene.sceneConfig = MY_SCENE_CONF
        
    //init the scene
    myScene.init()

    //register this scene as the active scene
    REGISTRY.SCENE_MGR._activeScene = myScene

    // move player to center of your scene
    myScene.moveVehicleToDefaultSpawn()
    ```

1) **Start Scene and Test:**

    Open the Decentraland Editor tab, and press **Run Scene**

    Alternatively, you can use the command line. Inside this scene root directory run:

    ```sh
    npm install
    npm run start
    ```

	
	

## Add additional non-physics enties 

Following the steps above you should have a fully working Infinity Engine Scene. From here you may want place more interactable entities in specific spots, such as doors, NPCs, etc.  Here are the basic to do that.


Inside the `src/myFirstScene/getting-started#addAdditionalNonPhysicsEntities()`


```ts
//src/myFirstScene/getting-started#addAdditionalNonPhysicsEntities()

//define a _scene object to act as the parent of any of your interactive objects
//this will help performance by reducing number of entities the movesWithWorldSystem has to track
const _myNonPhysicsScene = engine.addEntity()
MovesWithWorld.create(_myNonPhysicsScene, { id: "_myNonPhysicsScene" })
Transform.createOrReplace(_myNonPhysicsScene, {
    //scale: Vector3.create(6,120,6),
})

//for debugging will assign it a material to see where it is in the world
Material.setPbrMaterial(_myNonPhysicsScene, {
    albedoColor: Color4.Black(),
    specularIntensity: 0,
    metallic: 0,
    roughness: 1
})

//make it a box
MeshRenderer.setBox(_myNonPhysicsScene)
```

Next we will add two cubes at world origin and at a specific place in the scene.  See 'Ways to determine position' for how you can position entities manually

```ts
//src/myFirstScene/getting-started#addAdditionalNonPhysicsEntities()
    
//some cleverness to allow making it the parent or not to the other entities below
const parentIt = _myNonPhysicsScene

//create a demo cube to be moved with the world
const testCubeEntOrigin = engine.addEntity()
const testCubeEntOriginPos = Vector3.create(0, 0, 0)
Material.setPbrMaterial(testCubeEntOrigin, {
    albedoColor: Color4.Green(),
    specularIntensity: 0,
    metallic: 0,
    roughness: 1
})
MeshRenderer.setBox(testCubeEntOrigin)
Transform.createOrReplace(testCubeEntOrigin, {
    //for testing - make it very tall for easy finding 
    scale: Vector3.create(1, 120, 1), 
    position: !parentIt ? Vector3.Zero() : testCubeEntOriginPos,
    parent: parentIt
})
if (!parentIt) { //if not parented to _myNonPhysicsScene, must add move with world
    MovesWithWorld.create(testCubeEntOrigin,{
        id: "testCubeEntOrigin",
        position: testCubeEntOriginPos
    }) 
}

//create a demo cube to be moved with the world
const testCubeEntPositioned = engine.addEntity()
//setting position, position can inferred from your blender base scene
//or use the debug UI to get the player position standing near where you want it to be placed
const testCubeEntPositionedPos = Vector3.create(25, 5, 65)
Material.setPbrMaterial(testCubeEntPositioned, {
    albedoColor: Color4.White(),
    specularIntensity: 0,
    metallic: 0,
    roughness: 1
})
MeshRenderer.setBox(testCubeEntPositioned)
Transform.createOrReplace(testCubeEntPositioned, {
    //for testing - make it very tall for easy finding 
    scale: Vector3.create(3, 120, 3),
    position: !parentIt ? Vector3.Zero() : testCubeEntPositionedPos,
    parent: parentIt
})
if (!parentIt) { //if not parented to _myNonPhysicsScene, must add move with world
    MovesWithWorld.create(testCubeEntPositioned, {
        id: "testCubeEntPositioned",
        position: testCubeEntPositionedPos
    })
} 
```
