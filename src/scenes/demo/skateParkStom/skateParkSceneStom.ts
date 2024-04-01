import { log } from "../../../back-ports/backPorts";
import { IBaseEntityWrapper } from "../../../modules/SceneMgmt/subScene";
import { BaseScene } from "../../common/baseScene";

const CLASSNAME = "SkateParkSceneStom"

export class SkateParkSceneStom extends BaseScene{
  constructor( id: number,
    name: string){
    super(id,"SkateParkScene-"+name)
  }
  onInit(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onInit"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onInit(baseEntWrapper)
  }
  destroy(){
    const METHOD_NAME = "destroy"
    log(CLASSNAME,this.name,METHOD_NAME,"ENTRY")
    
    super.destroy()
    
  }
  onHide(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onHide"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onHide(baseEntWrapper)
  }
  onShow(baseEntWrapper: IBaseEntityWrapper){
    const METHOD_NAME = "onShow"
    log(CLASSNAME,this.name,baseEntWrapper.name,METHOD_NAME,"ENTRY")
    super.onShow(baseEntWrapper)
  };
}