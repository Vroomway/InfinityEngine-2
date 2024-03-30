# Infinity Engine SDK7 Template

<img align="left" width="100" height="100" src="./assets/logo-128.png" style="margin-right: 1em; /">

This scene is an example of using the Infinity Engine with Decentraland SDK7.

It includes a pair of working example scenes, as well as the blend files used to create them. There are also full instructions for importing your own scenes.

You can see a demo of the scene at [ToDo - add link].


Contents:
--

* [Try it out](#try-it-out)
* [Overview](#overview)
	* [Tools used](#tools-used)
	* [Terminology](#terminology)
	* [Folder structure](#folder-structure)
	* [Pipeline overview](#pipeline-overview)
* [Getting Started]()
	* [Scene configuration](#scene-configuration)
	* [Making a scene from scratch](docs/getting-started.md)
	* [Debugging](#debugging)
	* [Components](#components)
	* [Systems](#systems)

## Try it out

**Previewing the scene**

1. Download this repository.

2. Install the [Decentraland Editor](https://docs.decentraland.org/creator/development-guide/sdk7/editor/)

3. Open the repository folder in Visual Studio Code.

4. Open the Decentraland Editor tab, and press **Run Scene**

Alternatively, you can use the command line. Inside this scene root directory run:

```
npm install
npm run start
```

---

# Overview

Tools Used
--

| Tool                    | Desc
| ---                     | ---
| Blender                 | Used to create models and run plugins described below <https://www.blender.org>
| CannonJS                | Physic engine.  See docs here for more details <https://github.com/schteppe/cannon.js>
| DCL Cannon Collider     | Blender Plugin. Reads meshes and generates cannon colliders with some physics. See docs here more more details: <https://github.com/stom66/blender-dcltk-cannon-colliders>
| DCL Scene Slicer        | Blender Plugin. Slices a large scene into tiles to be rendered by Infinity Engine. See docs here for more details: <https://github.com/stom66/blender-dcltk-scene-slicer>
| Skybox Image Generator  | Generates 360 degree skyboxes

Terminology
--

| Term                      | Desc
| ---                       | ---
| AvatarSwap                | Hide the default DCL avatar and replace with a custom model.
| CannonJS                  | Physics engine used: <https://github.com/schteppe/cannon.js>
| Infinity Engine - Code    | Collecting of Code that makes the Infinity Engine possible.
| Infinity Engine - Concept | DCL scenes have fixed boundaries, putting limits on how big a scene can be. Avatar controls today are somewhat limited. The Infinity Engine adds flexibility to the basic DCL scene boundaries and Avatar controls for a more immersive scene experience.
| SkyBox                    | Hide the default DCL skybox and surround scene with a custom one
| Spacial Partition         | To optimize managing a large number of objects we break them down into smaller chunks. Read more about the concept here: <https://gameprogrammingpatterns.com/spatial-partition.html>


Folder Structure
--

| Folder 	                        | Desc
| ---		                          | ---
| `src/modules/avatar`            | Handles avatar swap logic
| `src/modules/avatarTrap`        | Handles avatar trap. When Infinity Engine is active we must hold the player in center of scene and move the world around the player
| `src/modules/cannon-colliders`  | Utilites for processing colliders from <https://github.com/stom66/blender-dcltk-cannon-colliders>
| `src/modules/scene-slicer`      | Utilities for processing tilesets from  <https://github.com/stom66/blender-dcltk-scene-slicer>
| `src/modules/skybox`            | Generates skyboxes
| `src/modules/spacePartition`    | Utility to generate spacial partitioning
| `src/terrain`                   | Utils around terrain generation spacial grid + colliders
| `src/ui`                        | 2D UI setup here
| `src/world`                     | Much of the Infinity Engine logic



Pipeline Overview
--

![image](docs/pipeline-overview.png)



# Getting Started

## Creating a Scene from Scratch

See here for a in-depth guide to importing your own scene: [Creating a Scene from Scratch](docs/getting-started.md).

## Scene Configuration

For a full example of a config file see [Infinity Engine Configuration](docs/infinity-engine-config.md).
See [src/sceneConfigType.ts](src/sceneConfigType.ts) for configuration types.

Some of the most common config options are covered below:

* **Parcel size:** defines the size of the scene. Set these to match the `tile_dimensions` declared in `scene.json`

	```ts
	//src/config.ts - line #16
	const ParcelCountX = 5
	const ParcelCountZ = 5
	```

* **Infinity Engine defaults**: default properties used by the engine. These can be over-ridden on a per-scene basis.

	```ts
	//src/config.ts
	AVATAR_TRAP_DEFAULTS   // #72 - defaults for how avatar trap is configured
	AVATAR_DEFAULTS        // #81 - defaults for how avatar swap is rendered
	SKYBOX_DEFAULTS        // #116 - defaults for how skybox is generated
	WORLD_VEHICLE_DEFAULTS // #124 - defaults for how world vehicle is configured
	GRID_DEBUG_DEFAULTS    // #148 - the defaults when grid debug is enabled
	```

* **Scene Admins:** define a list of users authorised to see the various debug/control UI elements.

	```ts
	//src/config.ts, line #24
	ADMINS = [
	  "any", // if set to any will allow anyone to see
	];
	```

## Debugging

See here: [Debugging](docs/debugging.md)

## Components

`MovesWithWorld` can be found in `src/world/worldMoveComponent.ts`. Add this component to any entity you wish to be moved by the Infinity Engine.

```ts
engine.defineComponent('moves-with-world-id', {
	// id of entity
	id: Schemas.String, 

	// position in world, 0,0,0 as origin relative to Infinity Engine scene origin, not scene 0,0,0
    position: Schemas.Vector3
})

```

## Systems



| System 	                        	| Desc
| ---		                        	| ---
| `src/world/movesWithWorldSystem`  	| System that moves the world around the player.  The player is held in place via the Avatar Trap.
| `src/world/worldSpacePartitionSystem` | System determines nearby entities to be loaded and remove far away entities.




## Things to keep in mind

* The more items the `MovesWithWorldSystem` has to move, the worse performance will be.
* Keep the number of tracked `MovesWithWorld` components to a minimum. Parent objects as a much as you can, and assign **just** the parent to `MovesWithWorld`. 

* If you assign a `Transform.scale` to a parent entity using `MovesWithWorld` it will affect the positions of the children.

* Will not work with any library that manipulates the `Transfrom.position` component, unless those libraries account for accepting an alternative component, `MovesWithWorld.position`. For example: SDK7 Utils, NPC Toolkit, etc.
	* I do have ideas as to how these libraries could support alternate components.

* `MovesWithWorld` not work with Tween, as Tween manipulates the `Transfrom.position` component, but the Infinity Engine uses Transform to perform its work too.


