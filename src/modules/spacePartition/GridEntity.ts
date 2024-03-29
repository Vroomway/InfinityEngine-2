import BoidEntity from './GridEntity'

/**
 * @module Grid
 * Grid class creates cubic grid for spatial partitioning.
 * This helps lookups to be performed faster for nearby entities.
 * More information can be found here:
 * http://gameprogrammingpatterns.com/spatial-partition.html
 */

const EMPTY_ARRAY: BoidEntity[] = []

EMPTY_ARRAY.push = (entity:any) => { debugger; throw new Error("EMPTY_SET is read only") }
EMPTY_ARRAY.splice = (entity:any) => { throw new Error("EMPTY_SET is read only") }
EMPTY_ARRAY.indexOf = (entity:any) => {return -1}


//import BoidVisibleEntity from './BoidVisibleEntity.js'
//import { BOID_CONFIG } from './Constants.js'
import Grid from './Grid'
import IBoidEntity, { GridTypeEnum, GridEntityMgr } from './IGridEntity.js'
import IGridEntity from './IGridEntity.js';
import { Entity, Transform } from '@dcl/sdk/ecs';
import { Vector3 } from '@dcl/sdk/math';
//import IBoidVisibleEntity from './IBoidVisibleEntity.js'

let idCounter = 0

/**
 * @module BoidEntity
 * Entity class defines an entitiy model which has a position and a velocity.
 * Also it has some utiliy methods.
 */
export default class GridEntity implements IGridEntity {
  id: string
  type: number
  x: number
  y: number
  z: number
  mgr: any
  grid?: Grid

  //visibleEntity!: IBoidVisibleEntity
  enabled: boolean = true

  //entity!:Entity
  //modelEntity!:Entity
  canMove: boolean = false //default is false
  /*
  maxSpeed: number
  burstSpeed: number
  decelSpeed: number = 0.05
  acelSpeed: number = 0.2
  

  //optional //override system controlling it
  aligmentWeight?: number
  cohesionWeight?: number
  separationWeight?: number

  aligmentRadius?: number
  cohesionRadius?: number
  separationRadius?: number
  obstacleRadius?: number
  seekRadius?: number
  avoidRadius?: number*/

  //maxEntitySpeed?:number

  //aligmentRadius?:number
  //cohesionRadius?:number
  //separationRadius?:number
  //obstacleRadius?:number
/*
  static FLOCK_ENTITY = BoidTypeEnum.FLOCK_ENTITY
  static OBSTACLE_ENTITY = BoidTypeEnum.OBSTACLE_ENTITY
  static PREDATOR_ENTITY = BoidTypeEnum.PREDATOR_ENTITY
  static SEEK_ENTITY = BoidTypeEnum.SEEK_ENTITY*/
  /**
   * Constructor for the Entity class
   * @param {Number} type entitiy type that defines it as flock or obstacle entitiy
   * @param {Number} x x position
   * @param {Number} y y position
   * @param {Number} z z position
   */
  constructor(
    type: number,
    id:string,
    mgr: GridEntityMgr,
    x: number = 0,
    y: number = 0,
    z: number = 0
  ) {
    this.id = id
    this.type = type
    this.x = x
    this.y = y
    this.z = z
    this.mgr = mgr

    //this.maxSpeed = (Math.random() + 5) * BOID_CONFIG.MAX_SPEED_SCALE
    //this.burstSpeed = 0
    //this.grid = undefined;
    //this.mesh = undefined;

    //this.FLOCK_ENTITY = 1;
    //this.OBSTACLE_ENTITY = 1;

    this.initEntity()
    /*if(this.id == 1){
    log(this.id,"fish stats",{
        id:this.id,
        mass:this.mass,
        maxforce:this.maxforce,
        maxspeed:this.maxspeed,
    })
    }*/
  }

  initEntity() {
    //this.visibleEntity = new BoidVisibleEntity(this)
    //this.visibleEntity.initEntity()
  }
  /**
   * Sets the grid instance
   * @param {Grid} grid
   */
  setGrid(grid?: Grid) {
    this.grid = grid
  }

  /**
   * @returns {Number} type of the entity
   */
  getType() {
    return this.type
  }

  /**
   * @returns {Number} the current scalar velocity of the entity.
   */
  getVelocity() {
    return 0;//return Math.sqrt(this.vx * this.vx + this.vy * this.vy + this.vz * this.vz)
  }

  /**
   * Checks the velocity of the entitiy and limits it to the given parameter
   * @param {Number} maxVelocity
   */
  checkVelocity(maxVelocity = 1) {
    const velocity = this.getVelocity()
    /*if (velocity > maxVelocity && velocity > 0) {
      this.vx = (maxVelocity * this.vx) / velocity
      this.vy = (maxVelocity * this.vy) / velocity
      this.vz = (maxVelocity * this.vz) / velocity
    }*/
  }

  /**
   * This method adds the given velocity to the current velocity.
   * @param {Number} vx x velocity
   * @param {Number} vy y velocity
   * @param {Number} vz z velocity
   */
  addVelocity(vx: number, vy: number, vz: number) {
    /*this.vx += vx
    this.vy += vy
    this.vz += vz*/
  }

  /**
   * This method moves the entity.
   * @param {Number} maxVelocity
   * @param {Number} bx
   * @param {Number} by
   * @param {Number} bz
   */
  move(maxVelocity: number, bx: number, by: number, bz: number) {
    this.checkVelocity(maxVelocity)

    let nx = this.x// + this.vx
    let ny = this.y// + this.vy
    let nz = this.z// + this.vz

    /*nx = Math.max(0, nx)
    nx = Math.min(bx, nx)
    ny = Math.max(0, ny)
    ny = Math.min(by, ny)
    nz = Math.max(0, nz)
    nz = Math.min(bz, nz)*/

    this.grid?.moveEntity(this, nx, ny, nz)
  }

  /**
   * Calculate the distance between the entity and the given entity
   * @param {Entity} otherEntity
   * @returns {Number} the distance between two entities
   */
  getDistance(otherEntity: BoidEntity): number {
    const dx = this.x - otherEntity.x
    const dy = this.y - otherEntity.y
    const dz = this.z - otherEntity.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Updates the internal data of the entity if the IDs match
   * @param {Object} data
   */
  updateData(data: any) {
    //removed
  }

}


export function createGridEntity(type:number,id:string,position:Vector3,ent:GridEntityMgr,root?:Entity){
  //const transform = Transform.get(root)
  const pos = position
  return new GridEntity(type,id,ent,pos.x,pos.y,pos.z)
}