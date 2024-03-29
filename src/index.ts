
import { initConfig } from './config'
import { initMyFirstScene } from './myFirstScene/getting-started'
import { REGISTRY, initRegistry } from './registry'
import { initSceneMgr } from './scenes/mySceneManager'
import { RACE_TRACK_CONF_8_8_32, initRaceTrackSceneConf } from './scenes/raceTrack/raceTrackConfs'
import { RaceTrackScene } from './scenes/raceTrack/raceTrackScene'
import { SkateParkSceneStom } from './scenes/skateParkStom/skateParkSceneStom'
import { SKATE_PARK_STOM_CONF_8_8_30, initSkateParkStomConfs } from './scenes/skateParkStom/skateParkSceneStomConfs'
import { setupUi } from './ui/ui'


//import colliderJSON from '../models/stom-skatepark-8x8x30/colliders.json'
//import tilesetJSON from '../models/stom-skatepark-8x8x30/tileset.json'


// export all the functions required to make the scene work
export * from '@dcl/sdk'

export function main(){ 
    // export let cube = engine.addEntity()
    // Transform.create(cube)
    // MeshRenderer.setBox(cube)
    // Vehicle.create(cube)ß

    initConfig().then((config)=>{
        const registry = initRegistry()
        initSceneMgr()
        //START TODO move to subscene
        setupSkateParkSFInst()
        setupSkateParkStomInst()

        //REGISTRY.SCENE_MGR.skateParkScene.init()
        //END TODO move to subscene
        setupUi()

        //start with race trace
        REGISTRY.SCENE_MGR.goRaceTrack()

        //init my first scene
        initMyFirstScene()
    })
    
}

function setupSkateParkStomInst(){
    const skatePartScene = new SkateParkSceneStom(REGISTRY.SCENE_MGR.generateSceneId(),"skateParkStomScene")
    initSkateParkStomConfs() 
    //set default
    skatePartScene.sceneConfig = SKATE_PARK_STOM_CONF_8_8_30
    
    REGISTRY.SCENE_MGR.skateParkSceneStom = skatePartScene
}
 

function setupSkateParkSFInst(){
    const raceTrackScene = new RaceTrackScene(REGISTRY.SCENE_MGR.generateSceneId(),"raceTrackScene")
    initRaceTrackSceneConf() 
    //set default
    raceTrackScene.sceneConfig = RACE_TRACK_CONF_8_8_32
    
    REGISTRY.SCENE_MGR.raceTrackScene = raceTrackScene
}


