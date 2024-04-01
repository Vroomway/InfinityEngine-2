import { Vector3 } from "@dcl/sdk/math";
import { SceneManager } from "../modules/SceneMgmt/sceneManager";
import { SceneVector3Type, SpawnPoint } from "../modules/SceneMgmt/types";
import { log } from "../back-ports/backPorts";
import { CONFIG } from "../config";
import { REGISTRY } from "../registry";
import { BaseScene } from "./common/baseScene";

const CLASS_NAME = "MySceneManager"
export class MySceneManager extends SceneManager {

  static instance:MySceneManager
 
  static getInstance(){
    if(!MySceneManager.instance || MySceneManager.instance === undefined){
      MySceneManager.instance = new MySceneManager();
    }
    return MySceneManager.instance
  } 

  _activeScene!:BaseScene
  //ideally these point at concrete instance classes
  //however to keep the demo simple for deleteing demo things
  //will use common base class
  skateParkSceneStom!:BaseScene
  raceTrackScene!:BaseScene
  
  playerLocationBeforeRace:Vector3 = Vector3.Zero()


  goSkateParkStom(force?:boolean){
    //Constants.doLoginFlow(
    //    {
    //      onSuccess:()=>{ 
            this.destroyActiveScene()

            const alreadyRacing = this.skateParkSceneStom.isVisible()
            
            this._activeScene = this.skateParkSceneStom
            //-3 for player height with padding if standing on stuff
            
            this.capturePlayerLobbyPosition()

            if( (force === undefined || !force ) && alreadyRacing ){
              log("already racing")
              //run these anyway just in case state got messed up
              this.changeToScene(this.skateParkSceneStom)
              this.skateParkSceneStom.moveVehicleToDefaultSpawn()
            }else{
              //if(!Constants.showedHowToPlayAlready){
                //REGISTRY.Game_2DUI.openHowToPlayPrompt()
              //}else{
                this.changeToScene(this.skateParkSceneStom)
                this.skateParkSceneStom.moveVehicleToDefaultSpawn()
                //this.racingScene.initRace(force)
              //}
            }
      //    }
      //  }
      //)
  } 

  goRaceTrack(force?:boolean){
    //Constants.doLoginFlow(
    //    {
    //      onSuccess:()=>{ 
            this.destroyActiveScene()

            const alreadyRacing = this.raceTrackScene.isVisible()
            
            this._activeScene = this.raceTrackScene
            //-3 for player height with padding if standing on stuff
            
            this.capturePlayerLobbyPosition()

            if( (force === undefined || !force ) && alreadyRacing ){
              log("already racing")
              //run these anyway just in case state got messed up
              this.changeToScene(this.raceTrackScene)
              this.raceTrackScene.moveVehicleToDefaultSpawn()
            }else{
              //if(!Constants.showedHowToPlayAlready){
                //REGISTRY.Game_2DUI.openHowToPlayPrompt()
              //}else{
                this.changeToScene(this.raceTrackScene)
                this.raceTrackScene.moveVehicleToDefaultSpawn()
                //this.racingScene.initRace(force)
              //}
            }
      //    }
      //  }
      //)
  } 
  destroyActiveScene() {
    //destrony any existing scene
    if(this._activeScene){
      this._activeScene.destroy()
    } 
  }

  capturePlayerLobbyPosition(){
    /*if( player.camera.position.y  < scene.raceGroundElevation - 3 ){
      this.playerLocationBeforeRace = new Vector3().copyFrom( player.camera.position )

      //also check distance from center which is not a place to be spawned

      const centerIgnoreHeight = new Vector3().copyFrom(scene.center)
      centerIgnoreHeight.y = this.playerLocationBeforeRace.y
      const distFromCenter = realDistance(this.playerLocationBeforeRace,centerIgnoreHeight)
      log("goRace check dist from center",this.playerLocationBeforeRace,distFromCenter)
      const minDistance = 8
      if(distFromCenter < minDistance){
        //how did they start a game from in side the tower?
        //TODO have predefined spawn spots?
        this.playerLocationBeforeRace.x += (minDistance-this.playerLocationBeforeRace.x)
        this.playerLocationBeforeRace.y += 1 //to avoid spawning inside something
        log("goRace move out from center",this.playerLocationBeforeRace,distFromCenter)
      }

    }else{
      log("goRace playerLocationBeforeRace player in race so dont capture",this.playerLocationBeforeRace)
      //see if has value, if missing for some reason pick a safe respawn point
      //this.playerLocationBeforeRace
    }*/
  }
}

//export const SCENE_MGR = new RaceSceneManager();
export function initSceneMgr(){
  REGISTRY.SCENE_MGR = MySceneManager.getInstance()
}
 