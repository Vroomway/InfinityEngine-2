//import BoidEntity from './BoidEntity'

import IGridEntity from "./IGridEntity";

/**
 * @module Grid
 * Grid class creates cubic grid for spatial partitioning.
 * This helps lookups to be performed faster for nearby entities.
 * More information can be found here:
 * http://gameprogrammingpatterns.com/spatial-partition.html
 */

const EMPTY_ARRAY: IGridEntity[] = []

EMPTY_ARRAY.push = (entity:any) => { debugger; throw new Error("EMPTY_SET is read only") }
EMPTY_ARRAY.splice = (entity:any) => { throw new Error("EMPTY_SET is read only") }
EMPTY_ARRAY.indexOf = (entity:any) => {return -1}


export default class Grid {
  worldSize: number
  cellSize: number
  cellRowCount: number

  cellCount: number
  //switch from 2d array to map, in theory greatly reduce
  //grid size by not allocating uneeded cells
  //technically we are not a spatial hash grid
  //consider a octree impl to replace, solves issues if tons of objects are in same cell
  //as it does a trie lookup, not as fast as a hash but resolving is better as loops over less in theory if have dense cells
  //.  the lookup time for nearest may or may not help
  //move will be same as requires a remove then add, just like this one does
  //entityList: BoidEntity[][] = []
  //TODO consider a map of map.  a Sparse Spacial Hashmap
  map: Map<number,IGridEntity[]> = new Map()

  /**
   * Constructor for the Grid class. Grids can be only be a cube. It takes cellSize as a parameter
   * @param {Number} worldSize total world size in units. eg. 1000
   * @param {Number} cellSize cell size to divide the world into. eg. 20.
   */
  constructor(worldSize: number, cellSize: number) {
    this.worldSize = worldSize
    this.cellSize = cellSize
    this.cellRowCount = (this.worldSize / this.cellSize) | 0

    this.cellCount = this.cellRowCount * this.cellRowCount * this.cellRowCount
    /*this.entityList = []
    for (let i = 0; i < this.cellCount; i++) {
      this.entityList[i] = []
    }*/
    console.log("GridCLASS",'Grid created with' ,this)
  }

  reset(){
    this.map.clear()
  }
  /**
   * @returns {Number} world size
   */
  getWorldSize() {
    return this.worldSize
  }

  /**
   * @returns {Number} grid count in a row
   */
  getGridRowCount() {
    return this.cellRowCount
  }

  /**
   * Calculate the grid index for the given x,y,z position
   * @param {*} x x position of the entity
   * @param {*} y y position of the entity
   * @param {*} z z position of the entity
   * @returns {Number} index of the cell for the given point
   */
  getGridIndex(x: number, y: number, z: number) {
    let cellX = (x / this.cellSize) | 0
    let cellY = (y / this.cellSize) | 0
    let cellZ = (z / this.cellSize) | 0

    if (cellX < 0) {
      cellX = 0
    } else if (cellX > this.cellRowCount - 1) {
      cellX = this.cellRowCount - 1
    }

    if (cellY < 0) {
      cellY = 0
    } else if (cellY > this.cellRowCount - 1) {
      cellY = this.cellRowCount - 1
    }

    if (cellZ < 0) {
      cellZ = 0
    } else if (cellZ > this.cellRowCount - 1) {
      cellZ = this.cellRowCount - 1
    }

    let index = cellX + cellY * this.cellRowCount + cellZ * this.cellRowCount * this.cellRowCount
    return index | 0
  }

  /**
   * Adds the entity to the correspoding grid
   * @param {Object} entity
   */
  addEntity(entity: IGridEntity) {
    const index = this.getGridIndex(entity.x, entity.y, entity.z) | 0
    entity.setGrid(this)
    this.map.has(index) ? this.map.get(index)!.push(entity) : this.map.set(index,[entity])
    //this.entityList[index].push(entity)
  }

  /**
   * Removes the entity from the correspoding grid
   * @param {Object} entity
   */
  removeEntity(entity: IGridEntity) {
    const index = this.getGridIndex(entity.x, entity.y, entity.z) | 0
    const gridEntities = this.map.get(index)// this.entityList[index]
    const entityIndex = gridEntities ? gridEntities.indexOf(entity) : -1
    if (entityIndex == -1) {
      // serious error!
      throw 'removeEntity() can not find the entity to be removed!'
      return
    } else if(gridEntities){
      gridEntities.splice(entityIndex, 1)
      entity.setGrid(undefined)
    }
  }

  /**
   * Moves the entity. Checks the new grid index, if the given position
   * requires entitiy move from cell to cell, it handles that transition.
   * @param {Object} entity entitiy object
   * @param {Number} newX new x position
   * @param {Number} newY new y position
   * @param {Number} newZ new z position
   */
  moveEntity(entity: IGridEntity, newX: number, newY: number, newZ: number) {
    const oldIndex = this.getGridIndex(entity.x, entity.y, entity.z) | 0
    const newIndex = this.getGridIndex(newX, newY, newZ) | 0

    if (oldIndex == newIndex) {
      entity.x = newX
      entity.y = newY
      entity.z = newZ
      // no need to update
      return
    }

    // remove from the old grid list
    const gridEntities = this.map.get(oldIndex)//this.entityList[oldIndex]
    //TODO make map of maps - sparse spacial hash
    const entityIndex = gridEntities ? gridEntities.indexOf(entity) : -1
    if (entityIndex == -1) {
      // serious error!
      throw 'moveEntity() can not find the entity to be removed!'
      return
    } else if(gridEntities){
      gridEntities.splice(entityIndex, 1)
    }

    // add to the new grid list
    entity.x = newX
    entity.y = newY
    entity.z = newZ
    //this.entityList[newIndex].push(entity)
    this.map.has(newIndex) ? this.map.get(newIndex)!.push(entity) : this.map.set(newIndex,[entity])
  }

  /**
   * Finds the corresponding grid for the given x,y,z position and
   * returns the entities in that grid.
   * @param {Number} x x position to find a cell
   * @param {Number} y y position to find a cell
   * @param {Number} z z position to find a cell
   * @returns {Array} entity list for that grid
   */
  getEntitiesInGrid(x: number, y: number, z: number) {
    const index = this.getGridIndex(x, y, z) | 0
    const elem = this.map.get(index)
    if(elem) return elem
    return EMPTY_ARRAY
    //return this.entityList[index]
  }

  /**
   * Returns the entities in the grid with the given index
   * @param {Number} index
   * @returns {Array} entity list for that grid
   */
  getEntitiesInGridIndex(index: number) {
    if (index < 0 || index >= this.cellCount) {
      throw 'getEntitiesInGridIndex() out of bounds!'
    }
    const elem = this.map.get(index | 0)
    if(elem) return elem
    return EMPTY_ARRAY

    //return this.entityList[index | 0]
  }

  /**
   * This method finds the entities in the cube that is defined with an origin position and a size.
   * The callback is executed for every entity that is found in the cube.
   * @param {Number} originX x position for the cube
   * @param {Number} originY y position for the cube
   * @param {Number} originZ z position for the cube
   * @param {Number} size size of the cube
   * @param {Function} callback callback is executed for every entity that is found in the cube
   */
  getEntitiesInCube(
    originX: number,
    originY: number,
    originZ: number,
    size: number,
    callback: (e: IGridEntity) => void
  ) {
    const start = this.getGridIndex(originX - size, originY - size, originZ - size) // top left
    const topEnd = this.getGridIndex(originX + size, originY - size, originZ - size) // top right
    const bottomStart = this.getGridIndex(originX - size, originY + size, originZ - size) // bottom left
    const backStart = this.getGridIndex(originX + size, originY + size, originZ + size) // back left

    const index = start
    const width = topEnd - start + 1
    const height = ((bottomStart - start) / this.cellRowCount + 1) | 0
    const depth = ((backStart - start) / (this.cellRowCount * this.cellRowCount) + 1) | 0
    for (let d = 0; d < depth; d++) {
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const currentIndex = index + d * this.cellRowCount * this.cellRowCount + h * this.cellRowCount + w
          if (currentIndex >= this.cellCount) {
            continue
          }

          const currentItems = this.map.get(currentIndex)//this.entityList[currentIndex]
          if(!currentItems) continue
          const curLen = currentItems.length
          for (let i = 0; i < curLen; i++) {
            const item = currentItems[i]
            if (
              item !== undefined &&
              item.x >= originX - size &&
              item.x <= originX + size &&
              item.y >= originY - size &&
              item.y <= originY + size &&
              item.z >= originZ - size &&
              item.z <= originZ + size
            ) {
              callback(item)
            }
          }
        }
      }
    }
  }
}
