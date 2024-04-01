
import { initConfig } from '../config'
import { initMyFirstScene } from '../myFirstScene/getting-started'
import { REGISTRY, initRegistry } from '../registry'
import { initSceneMgr } from '../scenes/mySceneManager'
import { RACE_TRACK_CONF_8_8_32, initRaceTrackSceneConf } from '../scenes/demo/raceTrack/raceTrackConfs'
import { RaceTrackScene } from '../scenes/demo/raceTrack/raceTrackScene'
import { SkateParkSceneStom } from '../scenes/demo/skateParkStom/skateParkSceneStom'
import { SKATE_PARK_STOM_CONF_8_8_30, initSkateParkStomConfs } from '../scenes/demo/skateParkStom/skateParkSceneStomConfs'
import { setupUi } from '../ui/ui'


export function setupDemo(){
    //IT IS SAFE TO DELETE everything in this method if you plan to write your own scene code
    function setupSkateParkStomInst(){
        const skatePartScene = new SkateParkSceneStom(REGISTRY.SCENE_MGR.generateSceneId(),"skateParkStomScene")
        initSkateParkStomConfs() 
        //set default
        skatePartScene.sceneConfig = SKATE_PARK_STOM_CONF_8_8_30
        
        REGISTRY.SCENE_MGR.skateParkSceneStom = skatePartScene
    }
     
    
    function setupRaceTrackInst(){
        const raceTrackScene = new RaceTrackScene(REGISTRY.SCENE_MGR.generateSceneId(),"raceTrackScene")
        initRaceTrackSceneConf() 
        //set default
        raceTrackScene.sceneConfig = RACE_TRACK_CONF_8_8_32
        
        REGISTRY.SCENE_MGR.raceTrackScene = raceTrackScene
    }
    
    setupSkateParkStomInst()
    setupRaceTrackInst()    
    
}