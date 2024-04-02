
import { initConfig } from './config'
import { initMyFirstScene } from './myFirstScene/getting-started'
import { REGISTRY, initRegistry } from './registry'
import { initSceneMgr } from './scenes/mySceneManager'
import { setupUi } from './ui/ui'
import { setupDemo } from './demo/setupDemo'

// export all the functions required to make the scene work
export * from '@dcl/sdk'

export function main(){ 
    initConfig().then((config)=>{
        const registry = initRegistry()
        initSceneMgr()

        //setup demo call
        //safe to remove if you write your own code
        setupDemo()

        //END TODO move to subscene
        setupUi()

        //init my first scene
        if (!initMyFirstScene()){
            //start with race trace as default it no other scene
            REGISTRY.SCENE_MGR.goSkateParkStom()
        }
    })
    
}
