# Infinity Engine SDK7 Template

This scene is built with the SDK7.

Demo use of the infinity engine.


## Try it out

**Previewing the scene**

1. Download this repository.

2. Install the [Decentraland Editor](https://docs.decentraland.org/creator/development-guide/sdk7/editor/)

3. Open a Visual Studio Code window on this scene's root folder. Not on the root folder of the whole repo, but instead on this sub-folder that belongs to the scene.

4. Open the Decentraland Editor tab, and press **Run Scene**

Alternatively, you can use the command line. Inside this scene root directory run:

```
npm run start
```

## Overview

Tools Used
--

| Tool                    | Desc
| ---                     | ---
| Skybox Image Generator  | Generates 360 degree skyboxes
| CannonJS                | Physic engine.  See docs here for more details <https://github.com/schteppe/cannon.js>
| Blender                 | Used to create models and run plugins described below <https://www.blender.org>
| DCL Scene Slicer        | Blender Plugin. Slices a large scene into tiles to be rendered by infinity engine. See docs here for more details: <https://github.com/stom66/blender-dcltk-scene-slicer>
| DCL Cannon Collider     | Blender Plugin. Reads meshes and generates cannon colliders with some physics. See docs here more more details: <https://github.com/stom66/blender-dcltk-cannon-colliders>

Terminology
--

| Term                      | Desc
| ---                       | ---
| AvatarSwap                | Hide the default DCL avatar and replace with a custom model
| SkyBox                    | Hide the default DCL skybox and surround scene with a custom one
| CannonJS                  | Physics engine used: <https://github.com/schteppe/cannon.js>
| Spacial Partition         | To optimize managing a large number of objects we break them down into smaller chunks. Read more about the concept here: <https://gameprogrammingpatterns.com/spatial-partition.html>
| Infinity Engine - Concept | DCL scenes have fixed boundaries for a scene (even if large) putting limits on how big a scene can be. Avatar controls today are a limitted.  The Infinity Engine adds the flexibility ontop of the basic DCL scene boundaries and Avatar controls for a more immersive scene experience.
| Infinity Engine - Code    | Collecting of Code that makes the Infinity Engine possible.


Folder Structure
--

| Folder 	                        | Desc
| ---		                          | ---
| `src/modules/avatar`            | Handles avatar swap logic
| `src/modules/avatarTrap`        | Handles avatar trap. when infinity engine is active we must hold player in center of scene and move the world around the player
| `src/modules/cannon-colliders`  | Utilites for processing colliders from <https://github.com/stom66/blender-dcltk-cannon-colliders>
| `src/modules/scene-slicer`      | Utilities for processing tilesets from  <https://github.com/stom66/blender-dcltk-scene-slicer>
| `src/modules/skybox`            | Generates skybox
| `src/modules/spacePartition`    | Utility to generate spacial partitioning
| `src/world`                     | Much of the infinity engine logic
| `src/terrain`                   | Utils around terrain generation spacial grid + colliders
| `src/ui`                        | 2D UI setup here



Pipeline Overview
--

![image](docs/pipeline-overview.png)



## Getting Started

See here [Getting Started](docs/getting-started.md)


## Configuration

### Scene Configuration

`src/config.ts`

Tell code how big scene is. Set these to number of tiles based off what is in your `scene.json`

```ts
//src/config.ts - line #16
const ParcelCountX = 5
const ParcelCountZ = 5
```

Defaults if infinity scene chooses not to override

```ts
//src/config.ts
AVATAR_TRAP_DEFAULTS // #72 - defaults for how avatar trap is configured
AVATAR_DEFAULTS      // #81 - defaults for how avatar swap is rendered
SKYBOX_DEFAULTS      // #116 - defaults for how skybox is generated
WORLD_VEHICLE_DEFAULTS //#124 - defaults for how world vehicle is configured
GRID_DEBUG_DEFAULTS  // #148 - the defaults when grid debug is enabled
```

Scene Admins

```ts
//src/config.ts, line #24
ADMINS = [
  "any", // if set to any will allow anyone to see
];
```

### Infinity Engine Config
---


See here [Infinity Engine Configuration](docs/infinity-engine-config.md)


### SceneConfig

See [src/sceneConfigType.ts](src/sceneConfigType.ts) for configuration types



## Debugging

See here [Debugging](docs/debugging.md)

## Components

MovesWithWorld found in `src/world/worldMoveComponent.ts`.  Add this component to any entity you wish to be moved by the Infinity Engine

```ts
engine.defineComponent('moves-with-world-id', {
	//id of entity
	id: Schemas.String, 
	//position in world, 0,0,0 as origin relative to Infinity engine scene origin. not scene 0,0,0
    position: Schemas.Vector3
})

```

## Systems



| System 	                        | Desc
| ---		                          | ---
| `src/world/movesWithWorldSystem`  | System that moves the world around the player.  The player is held in place via the Avatar Trap
| `src/world/worldSpacePartitionSystem`        | System determines nearby entities to be loaded and remove far away entities




## Things to keep in mind

* Keep number of tracked MovesWithWorld components to a minimum.  Parent as a much as you can and assign just the parent to MovesWithWorld.  The more items the movesWithWorldSystem has to move the worse performance will be

* If you assign a Transform scale to a parent entity using MovesWithWorld as it will throw off all positions of the children you expect it to be in.
* Will not work with any library that manipulates the Transfrom.position component unless those libraries account for accepting an alternative component AKA MovesWithWorld.position: SDK7 Utils, NPC Toolkit, etc
	* I do have ideas as to how these libraries could support alternate components
* MovesWithWorld not work with Tween as Tween manipulates the Transfrom.position component but the Infinity Engine uses Transform to perform its work too


