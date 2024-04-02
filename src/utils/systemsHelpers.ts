import { SystemFn, SystemItem, engine } from "@dcl/sdk/ecs";


export const SYSTEM_PRIORITES={
    //REGULAR copied from engine/system.ts export declare const SYSTEMS_REGULAR_PRIORITY = 100000;
    REGULAR: 100000
}

export interface ISystemWrapper{
    addToEngine():void 
    removeFromEngine():void
    getName():void
}
export class SystemWrapper implements ISystemWrapper{
    _system: SystemWrapperBasic
    state:SystemState
    _fn:SystemFn
    constructor(name:string,priority:number=SYSTEM_PRIORITES.REGULAR,fn:SystemFn){
        this.state = new SystemState()
        this._fn = fn
        this._system = new SystemWrapperBasic(
            {name:name,priority:priority,fn:this.update.bind(this)}
            ,this.state)
    }
    addToEngine() {
        this._system.addToEngine()
    }
    removeFromEngine() {
        this._system.removeFromEngine()
    }
    getName() {
        this._system.getName()
    }
    update(dt:number){
        if(this.state.enabled){
            this._fn(dt)
        }
    }
}
export class SystemWrapperBasic implements ISystemWrapper{
    item:SystemItem
    state:SystemState

    constructor(item:SystemItem,state:SystemState){
        this.item = item;
        this.state = state
    }
    addToEngine(){
        this.state.alive = true
        engine.addSystem(this.item.fn,this.item.priority,this.item.name);
    }
    removeFromEngine(){
        this.state.alive = false
        return engine.removeSystem(this.item.fn);
    }
    getName(){
        return this.item.name
    }
}

export class SystemState{
    enabled:boolean = true
    alive:boolean = false
}