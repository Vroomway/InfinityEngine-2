import Grid from "./Grid";

export enum GridTypeEnum{
    DEBUG_ENTITY = -1,
    TERRAIN_ENTITY = 1
}

export type GridEntityMgrArgs={
    attachFn?:()=>void
    detatchFn?:()=>void
    showFn?:()=>void
    hideFn?:()=>void
}

//TODO make a class to track state 
export class GridEntityMgr{
    attached:boolean = false
    visible:boolean = false

    attachFn?:()=>void
    detachFn?:()=>void
    showFn?:()=>void
    hideFn?:()=>void

    constructor(args:GridEntityMgrArgs){
        this.attachFn = args.attachFn
        this.detachFn = args.detatchFn
        this.showFn = args.showFn
        this.hideFn = args.hideFn
    }
    attach(){
        if(this.attachFn) this.attachFn()
        this.attached = true
    }
    detach(){
        if(this.detachFn) this.detachFn()
        this.attached = false
    }
    hide(){
        if(this.hideFn) this.hideFn()
        this.visible = false
    } 
    show(){
        if(this.showFn) this.showFn()
        this.visible = true
    }
  }
/**
 * @module IBoidEntity 
 * Entity class defines an entitiy model which has a position and a velocity.
 * Also it has some utiliy methods.
 */
export default interface IGridEntity {
    id:string
    type:number
    x:number
    y:number
    z:number
    mgr:GridEntityMgr
    grid?:Grid
    
    canMove:boolean //default is false

    enabled:boolean
    

    initEntity():void
    /**
     * Sets the grid instance
     * @param {Grid} grid 
     */
    setGrid(grid?:Grid):void

    /**
     * @returns {Number} type of the entity
     */
    getType():number

    /**
     * @returns {Number} the current scalar velocity of the entity.
     */
    getVelocity():number

    /**
     * Checks the velocity of the entitiy and limits it to the given parameter
     * @param {Number} maxVelocity 
     */
    checkVelocity():void

    /**
     * This method adds the given velocity to the current velocity.
     * @param {Number} vx x velocity
     * @param {Number} vy y velocity
     * @param {Number} vz z velocity
     */
    addVelocity(vx:number, vy:number, vz:number):void

    /**
     * This method moves the entity.
     * @param {Number} maxVelocity 
     * @param {Number} bx 
     * @param {Number} by 
     * @param {Number} bz 
     */
    move(maxVelocity:number, bx:number, by:number, bz:number):void

    /**
     * Calculate the distance between the entity and the given entity
     * @param {Entity} otherEntity 
     * @returns {Number} the distance between two entities
     */
    getDistance(otherEntity:IGridEntity):number

    /**
     * Updates the internal data of the entity if the IDs match
     * @param {Object} data 
     */
    updateData(data:any):void

}