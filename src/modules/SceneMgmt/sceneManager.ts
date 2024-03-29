import { Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { ISubScene } from './subScene'

/*
export interface SubScene {
  id: number
  name: string
  entities: any[] // You can replace 'any' with the actual type of entities
  onInit?: () => void
  onHide?: () => void
  onShow?: () => void
  addOnInitListener: (listener: () => void) => void
  addOnHideListener: (listener: () => void) => void
  addOnShowListener: (listener: () => void) => void
  hide: () => void
  disable: () => void
  enable: () => void
  show: () => void
  init: () => void
}*/
//interface SubScene

interface SceneInitData {
  name: string
  entities: any[]
  onInit?: () => void
  onHide?: () => void
  onShow?: () => void
}

export interface ISceneManager {
  scenes: ISubScene[]
  generateSceneId: () => number
  getSceneById: (id: number) => ISubScene | null
  addScene: (scene: ISubScene | SceneInitData) => ISubScene
  changeToScene: (scene: ISubScene) => void
  initScenes: () => void
  hideScenes: () => void
}

export class SceneManager implements ISceneManager{
  scenes: ISubScene[] = []
  sceneIdGen = 1000

  generateSceneId(): number {
    return this.sceneIdGen++
  }
  getSceneById(id: number): ISubScene | null {
    const scenes = this.scenes
    
    for (const p in scenes) {
      if (scenes[p].id == id) {
        return scenes[p]
      }
    }
    return null
  }
  addScene(scene: ISubScene | SceneInitData): ISubScene {
    console.log('addScene ENTRY ', scene)
    let retScene: ISubScene

    if ('id' in scene) {
      retScene = scene
      this.scenes.push(scene)
    } else {
      const newScene: ISubScene = {
        id: this.generateSceneId(),
        name: scene.name,
        entities: scene.entities,
        addOnInitListener: () => {},
        addOnHideListener: () => {},
        addOnShowListener: () => {},
        hide: () => {},
        disable: () => {},
        enable: () => {},
        show: () => {},
        init: () => {}
      }

      if (scene.onInit !== undefined) newScene.addOnInitListener(scene.onInit)
      if (scene.onHide !== undefined) newScene.addOnHideListener(scene.onHide)
      if (scene.onShow !== undefined) newScene.addOnShowListener(scene.onShow)

      retScene = newScene
      this.scenes.push(newScene)
    }

    console.log('addScene EXIT ', retScene)
    return retScene
  }
  changeToScene(scene: ISubScene) {
    console.log('changeToScene', scene.name)
    const scenes = this.scenes

    for (const p in scenes) {
      if (scenes[p] == scene) {
      } else {
        console.log('changeToScene. hiding', scenes[p].name)
        scenes[p].hide()
        scenes[p].disable()
      }
    }
    console.log('changeToScene. activating', scene.name)
    scene.enable()
    scene.show()
  }

  initScenes() {
    for (const p in this.scenes) {
      this.scenes[p].init()
    }
  }

  hideScenes() {
    for (const p in this.scenes) {
      this.scenes[p].hide()
    }
  }
}
export function createSceneManager(): ISceneManager {
  const scenes: ISubScene[] = []
  let sceneIdGen = 1000

  function generateSceneId(): number {
    return sceneIdGen++
  }

  function getSceneById(id: number): ISubScene | null {
    for (const p in scenes) {
      if (scenes[p].id == id) {
        return scenes[p]
      }
    }
    return null
  }

  function addScene(scene: ISubScene | SceneInitData): ISubScene {
    console.log('addScene ENTRY ', scene)
    let retScene: ISubScene

    if ('id' in scene) {
      retScene = scene
      scenes.push(scene)
    } else {
      const newScene: ISubScene = {
        id: generateSceneId(),
        name: scene.name,
        entities: scene.entities,
        addOnInitListener: () => {},
        addOnHideListener: () => {},
        addOnShowListener: () => {},
        hide: () => {},
        disable: () => {},
        enable: () => {},
        show: () => {},
        init: () => {}
      }

      if (scene.onInit !== undefined) newScene.addOnInitListener(scene.onInit)
      if (scene.onHide !== undefined) newScene.addOnHideListener(scene.onHide)
      if (scene.onShow !== undefined) newScene.addOnShowListener(scene.onShow)

      retScene = newScene
      scenes.push(newScene)
    }

    console.log('addScene EXIT ', retScene)
    return retScene
  }

  function changeToScene(scene: ISubScene) {
    console.log('changeToScene', scene.name)
    for (const p in scenes) {
      if (scenes[p] == scene) {
      } else {
        console.log('changeToScene. hiding', scenes[p].name)
        scenes[p].hide()
        scenes[p].disable()
      }
    }
    console.log('changeToScene. activating', scene.name)
    scene.enable()
    scene.show()
  }

  function initScenes() {
    for (const p in scenes) {
      scenes[p].init()
    }
  }

  function hideScenes() {
    for (const p in scenes) {
      scenes[p].hide()
    }
  }

  return {
    scenes,
    generateSceneId,
    getSceneById,
    addScene,
    changeToScene,
    initScenes,
    hideScenes
  }
}
