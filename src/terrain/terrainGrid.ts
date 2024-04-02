import {
  Billboard,
  BillboardMode,
  ColliderLayer,
  Entity,
  GltfContainer,
  Material,
  MeshRenderer,
  PBMaterial_PbrMaterial,
  TextShape,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { log } from '../back-ports/backPorts'
import { CONFIG } from '../config'
import Grid from '../modules/spacePartition/Grid'
import { createGridEntity } from '../modules/spacePartition/GridEntity'
import { GridEntityMgr, GridEntityMgrArgs, GridTypeEnum } from '../modules/spacePartition/IGridEntity'
import { REGISTRY } from '../registry'
import { TileSetConf } from '../sceneConfigType'
import { MovesWithWorld } from '../world/worldMoveComponent'

const CLASSNAME = "terrainGrid.ts"

export function destroyTerrainGrid(){
  if(REGISTRY.entities.moveWithWorldGrid){
    engine.removeEntityWithChildren(REGISTRY.entities.moveWithWorldGrid.entity)
    REGISTRY.entities.moveWithWorldGrid = undefined as any
  }
}
// terrain factory
export function createTerrainGrid(args:GridCreateRequest) {

  log("CONFIG",CONFIG)
 

  const gridDims = getGridDims(args.tileset)
  //TODO will be equal to or biggger
  const sceneSize = gridDims.gridSizeMeters//CONFIG.size
  const maxSize = Math.max(sceneSize.x, sceneSize.y, sceneSize.z)
  //set it to max parcel W or Z to get 16x16 grids
  //goal is to get 16x16x16 size grids
  const cellSize = gridDims.cellSizeMeters.x//CONFIG.SPACIAL_GRID_CELL_SIZE
  console.log(CLASSNAME,'calling create spacePartioner' ,"maxSize",maxSize,"gridDim",gridDims,"size",CONFIG.size,"cellSize",cellSize)
  
  REGISTRY.spacePartioner = new Grid(maxSize, cellSize)
  console.log(CLASSNAME,'calling create REGISTRY.spacePartioner' ,REGISTRY.spacePartioner)
  
  //TODO FIXME worldMoveState alters position more to ensurwe placement
  //need to fix that. need to know "thickness of model since 0 origin based?"
  //what if postion done netative to set "floor" at y=0 instead of some +0 y
  //currently keys off of "grid"
  if(CONFIG.ENABLE_GRID_SYSTEM){
    const moveWithWorldGrid = createGrid(
      args
      )  

    REGISTRY.entities.moveWithWorldGrid = {entity:moveWithWorldGrid.root}
    

    //need to add these to a grid system
    moveWithWorldGrid.cells.forEach((gridCell:GridCell,index:number)=>{
      //log("adding ",c,"to REGISTRY.spacePartioner")
      //push to 
      REGISTRY.spacePartioner.addEntity(
        createGridEntity(GridTypeEnum.DEBUG_ENTITY,gridCell.id,gridCell.position,gridCell,gridCell.root)
      )
    })
  }
  /*
  const fixedGrid = createGrid({
    id:"fixed-grid",
    //position: Vector3.create(0,CONFIG.center.y + 1,0),
    position: Vector3.create(0,0 + 1,0),
    dimX: CONFIG.sizeX/16,
    dimZ: CONFIG.sizeZ/16,
    cellSize: GRID_CELL_SIZE,
    cellOffset: Vector3.create(CENTER_OFFSET,0,CENTER_OFFSET),
    cellDebugTextOffset: Vector3.create(0,0,0),
    moveWithWorld:false,
    cellMaterial: {
      //texture: Material.Texture.,
      albedoColor: Color4.fromHexString("#00000088"),
      specularIntensity: 0,
      metallic: 0,
      roughness: 1
  }
  })

  REGISTRY.entities.fixedGrid = {entity:fixedGrid.root}*/
} 
export type GridDebugType={
    enabled: boolean,
    textOffset: Vector3
    cellMaterial:PBMaterial_PbrMaterial
}
type GridCreateRequest={
    id:string

    position: Vector3

    debug: GridDebugType

    moveWithWorld:boolean
  
    tileset:TileSetConf
}

export type GridCellArgs=GridEntityMgrArgs&{
  id:string
  position:Vector3
  parent?:Entity
  root?:Entity
  visible?:Entity
  debugText?:Entity
}
export class GridEntityMgrBase extends GridEntityMgr{
  //createFn?:()=>void
  id:string
  position:Vector3
  parent?:Entity
  root?:Entity
  visibleEnt?:Entity
  debugText?:Entity

  constructor(args:GridCellArgs){
    super(args)
    this.id = args.id
    this.position = args.position
    this.parent = args.parent
    this.root = args.root
    this.visibleEnt = args.visible
    this.debugText = args.debugText
  }
}
export class GridEntityInst extends GridEntityMgrBase{

}
//if need to differentiate grid cell from general grid entity
export class GridCell extends GridEntityMgrBase{
  constructor(args:GridCellArgs){
    super(args)
  }
}
type GridCreateResult={
  root:Entity
  cells:GridCell[]
}
export type TilesetGridDims =
  {
    cellSizeMeters:Vector3
    gridSizeMeters:Vector3
    gridSizeCenterMeters:Vector3
    gridSize:Vector3
    cellRatio:Vector3
    cellOffset:Vector3
  }

//in case the array index of x,y,zis not in that order 
// if flipYandZ = true then the order is xzy abstract away the index
export type TilsetIdx = {
  x:number
  y:number
  z:number
}
export function getTileSetIdx(tileset:TileSetConf):TilsetIdx{
  const flipYandZ = tileset.flipYandZ

  const TILE_SET_X_IDX = 0
  const TILE_SET_Y_IDX = flipYandZ ? 2 : 1
  const TILE_SET_Z_IDX = flipYandZ ? 1 : 2

  return {x:TILE_SET_X_IDX,y:TILE_SET_Y_IDX,z:TILE_SET_Z_IDX}
}
export function getGridDims(tileset:TileSetConf):TilesetGridDims
{
  const METHOD_NAME = "getGridDims"
  //log(CLASSNAME,METHOD_NAME,"ENTRY","tileset",tileset)

  //if has cached value use that
  //FIXME this is hacky storagle location, find better way to encasulate this behind getGridDims
  //and ensure gets garbage collected to avoid a memory leak
  if(tileset._measurements){
    //log(CLASSNAME,METHOD_NAME,"CACHED","tileset",tileset)
    return tileset._measurements
  }
  //debugger
  const terrainTileSet = tileset.data//skatepark_will_tileset_8x8x10

  const tileSetIdx = getTileSetIdx(tileset)

  const TILE_SET_X_IDX = tileSetIdx.x
  const TILE_SET_Y_IDX = tileSetIdx.y
  const TILE_SET_Z_IDX = tileSetIdx.z
  
  //Y might be bigger so make ratio to know how many rows to bump
  const cellYRatio = terrainTileSet.tile_dimensions[TILE_SET_Y_IDX]/ terrainTileSet.tile_dimensions[TILE_SET_X_IDX]
   
  //const cellOffset = args.cellOffset
  //const GRID_WIDTH_X = args.dimX
  const GRID_CELL_SIZE = terrainTileSet.tile_dimensions[TILE_SET_X_IDX]
  const GRID_CELL_SIZE_Y = terrainTileSet.tile_dimensions[TILE_SET_Y_IDX]
 
  //const GRID_WIDTH_Z = args.dimZ
  //const GRID_WIDTH_Y = args.dimY
  //const GRID_CELL_SIZE = args.cellSize
  const GRID_WIDTH_X = (terrainTileSet.tileset_size[TILE_SET_X_IDX])// * (PARCEL_UNIT_METERS/terrainTileSet.tile_dimensions[0])
  //multiply by cellYRatio to account for y being bigger
  //FIXME cellYRatio is wrong but needed for now somewhere else in code relies on it, need to solve that then can remove this
  const GRID_WIDTH_Y = (terrainTileSet.tileset_size[ TILE_SET_Y_IDX ]) * cellYRatio
  const GRID_WIDTH_Z = (terrainTileSet.tileset_size[ TILE_SET_Z_IDX ])// * (PARCEL_UNIT_METERS/terrainTileSet.tile_dimensions[1])
  //const GRID_WIDTH_Z = args.dimZ
  const CENTER_OFFSET = GRID_CELL_SIZE/2
  const cellOffset = Vector3.create(CENTER_OFFSET,GRID_CELL_SIZE_Y/2,CENTER_OFFSET)
  
  const gridSizeMeters = Vector3.create(
    GRID_WIDTH_X*(terrainTileSet.tile_dimensions[TILE_SET_X_IDX])
    ,(terrainTileSet.tileset_size[ TILE_SET_Y_IDX ])*(terrainTileSet.tile_dimensions[TILE_SET_Y_IDX])
    ,GRID_WIDTH_Z*(terrainTileSet.tile_dimensions[TILE_SET_Z_IDX]))

  const gridSizeCenterMeters = Vector3.divide(gridSizeMeters,Vector3.create(2,2,2))

  const retVal = {
    cellSizeMeters:Vector3.create(GRID_CELL_SIZE,GRID_CELL_SIZE_Y,GRID_CELL_SIZE),
    gridSizeMeters:gridSizeMeters,
    gridSizeCenterMeters:gridSizeCenterMeters,
    gridSize:Vector3.create(GRID_WIDTH_X,GRID_WIDTH_Y,GRID_WIDTH_Z),
    cellRatio:Vector3.create(1,cellYRatio,1),
    cellOffset: Vector3.create(CENTER_OFFSET,GRID_CELL_SIZE_Y/2,CENTER_OFFSET)
  }

  //store it for nexttime
  tileset._measurements = retVal  

  log(CLASSNAME,METHOD_NAME,"EXIT","retVal",retVal)

  return retVal
}
function createGrid(
    args:GridCreateRequest
  ):GridCreateResult {
  //const y = 0

  const pGrid = engine.addEntity()
  const cells:GridCell[]=[]
  Transform.create(pGrid, {
    position: args.position,
    //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
  })

  const flipYandZ = args.tileset.flipYandZ
  //const flipYandZ = args.tileset.modelFolder

  //WITH LOWER LOAD TIMES, WHAT IF WE PRELOADED ALL THE FILES?
  const terrainTileSet = args.tileset.data//skatepark_will_tileset_8x8x10
  const terrainTileSetModelFolder = args.tileset.modelFolder//"models/will-park-exact/" 
  
  
  const tileModelExt = "gltf" //blank if src contains extension

  const gridDims = getGridDims(args.tileset)

  //Y might be bigger so make ratio to know how many rows to bump
  const cellYRatio = gridDims.cellRatio.y//terrainTileSet.tile_dimensions[TILE_SET_Y_IDX]/ terrainTileSet.tile_dimensions[TILE_SET_X_IDX]
   
  const generalOffset = args.tileset.tilesetOffset ? args.tileset.tilesetOffset : Vector3.Zero()
  //const cellOffset = args.cellOffset
  //const GRID_WIDTH_X = args.dimX
  const GRID_CELL_SIZE = gridDims.cellSizeMeters.x//terrainTileSet.tile_dimensions[TILE_SET_X_IDX]
  const GRID_CELL_SIZE_Y = gridDims.cellSizeMeters.y//terrainTileSet.tile_dimensions[TILE_SET_Y_IDX]
 
  //const GRID_WIDTH_Z = args.dimZ
  //const GRID_WIDTH_Y = args.dimY
  //const GRID_CELL_SIZE = args.cellSize
  const GRID_WIDTH_X = gridDims.gridSize.x//(terrainTileSet.tileset_size[TILE_SET_X_IDX])// * (PARCEL_UNIT_METERS/terrainTileSet.tile_dimensions[0])
  //multiply by cellYRatio to account for y being bigger
  const GRID_WIDTH_Y = gridDims.gridSize.y//(terrainTileSet.tileset_size[ TILE_SET_Y_IDX ]) * cellYRatio
  const GRID_WIDTH_Z = gridDims.gridSize.z//(terrainTileSet.tileset_size[ TILE_SET_Z_IDX ])// * (PARCEL_UNIT_METERS/terrainTileSet.tile_dimensions[1])
  //const GRID_WIDTH_Z = args.dimZ
  //const CENTER_OFFSET = GRID_CELL_SIZE/2

  const cellOffset = gridDims.cellOffset//Vector3.create(CENTER_OFFSET,GRID_CELL_SIZE_Y/2,CENTER_OFFSET)
  
  const OPTIMIZATION_DRAW_CUBE_WITH_NO_TILESET = false
  const OPTIMIZATION_DRAW_CUBE_WITH_NO_MODEL = false

  for(let x = 0; x <= GRID_WIDTH_X; x++){
    let yGridIdxTracker = 0 //keep track of when to bump 'yGridIdx'
    //yGridIdx follows the grid index   when y = 2 its actually grid 1
    let yGridIdx = 0
    for(let y = 0; y <= GRID_WIDTH_Y; y++){
      for(let z = 0; z <= GRID_WIDTH_Z; z++){
        //const position = Vector3.create(CONFIG.center.x + CENTER_OFFSET + (x*GRID_CELL_SIZE), CONFIG.center.y + 15, CONFIG.center.z + CENTER_OFFSET +(z*GRID_CELL_SIZE))
        const position = Vector3.create(
            generalOffset.x + cellOffset.x + (x*GRID_CELL_SIZE)
          , generalOffset.y + cellOffset.y + (y*GRID_CELL_SIZE)
          , generalOffset.z + cellOffset.z +(z*GRID_CELL_SIZE)
        )
        const gridIdx = REGISTRY.spacePartioner.getGridIndex(position.x,position.y,position.z)

        const id = args.id+"(cell:"+x+","+y+","+z+")\n[idx:"+gridIdx+"]"
        const _yGridIdxTracker = yGridIdxTracker
 
        //optimization. dont include cubes that have no models to render
        //reduces the scan time by 2x
        //can worry about using a different grid for loading objects
        if(!OPTIMIZATION_DRAW_CUBE_WITH_NO_TILESET && y!=_yGridIdxTracker){
          continue;
        }


        //tool exports in xzy order not xyz
        const TILE_SET_X = x
        const TILE_SET_Y = flipYandZ ? z : yGridIdx//z
        const TILE_SET_Z = flipYandZ ? yGridIdx : z//yGridIdx
        //using yGridIdx because cell might be bigger x,z dimention
        const tileCell = (terrainTileSet.tiles && terrainTileSet.tiles[TILE_SET_X] && terrainTileSet.tiles[TILE_SET_X][TILE_SET_Y] && terrainTileSet.tiles[TILE_SET_X][TILE_SET_Y][TILE_SET_Z])
          ? terrainTileSet.tiles[TILE_SET_X][TILE_SET_Y][TILE_SET_Z] : undefined
        
        const debugText = 
          id + "\n" 
          +"pos("+position.x+","+position.y+","+position.z+")\n"
          +"(tile:"+x+","+yGridIdx+","+z+")\n"
          +"(tileIdx:"+TILE_SET_X+","+TILE_SET_Y+","+TILE_SET_Z+")\n"
          +"src:" + (y==_yGridIdxTracker ? (tileCell ? tileCell.src : "") : "----") 
        
        const hasModel = tileCell && tileCell.src && y == _yGridIdxTracker

        //optimization. dont include cubes that have no models to render
        if(!OPTIMIZATION_DRAW_CUBE_WITH_NO_MODEL && !hasModel){
          continue;
        }


        const cellEntities:{
          root:Entity
          visible:Entity
          visibleDebugCell:Entity
          debugText:Entity
        }={
          root:undefined as any,
          visible:undefined as any,
          visibleDebugCell:undefined as any,
          debugText:undefined as any
        }

        const createCell = ()=>{
          //TODO if we have to save entities, we can put the creation of this stuff inside
          //the attach detach stuff
          const cellRoot = engine.addEntity()
          const visibleCell = engine.addEntity()
          const visibleDebugCell = engine.addEntity()

          //consider tihs the only one that always exists???
          Transform.create(cellRoot, {
            position: position,
            //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
            //ONLY ATTACH WHEN READY to reduce overhead
            //start with no parent, call attach when ready
            //parent: pGrid
          })
          
          Transform.create(visibleCell, {
            //position: position,
            //scale: Vector3.create(GRID_CELL_SIZE-1,GRID_CELL_SIZE-1,GRID_CELL_SIZE-1),
            //HAD TO ROTATE 180 on Y
            //newer version has to rotate 270 + 180????
            //rotation: Quaternion.fromEulerDegrees(270,180,0),
            rotation: Quaternion.fromEulerDegrees(0,180,0),
            parent: cellRoot
          })

          Transform.create(visibleDebugCell, {
            //position: position,
            scale: Vector3.create(GRID_CELL_SIZE-1,GRID_CELL_SIZE-1,GRID_CELL_SIZE-1),
            parent: visibleCell
          })
          

          
          const entDebugText = engine.addEntity()

          Transform.create(entDebugText, {
            position: args.debug.textOffset,
            //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
            parent: cellRoot
          })
          
          
          //log("worldMoveGroup.INIT",id,"position",position,"gridIdx",gridIdx)
          //MovesWithWorld.create(pcell,{id:id})
          
          //VisibilityComponent.createOrReplace(visibleCell,{visible:false})
          //VisibilityComponent.createOrReplace(entDebugText,{visible:false})

          cellEntities.root = cellRoot
          cellEntities.visible = visibleCell
          cellEntities.visibleDebugCell = visibleDebugCell
          cellEntities.debugText = entDebugText 
        }
        const destoryCell = ()=>{
          //TODO if we have to save entities, we can put the creation of this stuff inside
          //the attach detach stuff
          if(!cellEntities.root){
            return
          }
          //log("destoryCell",id)
          //does this remove the entity or does it just remove the components?
          //entity count is not going down
          engine.removeEntity(cellEntities.root)
          engine.removeEntity(cellEntities.visible)
          engine.removeEntity(cellEntities.visibleDebugCell)
          engine.removeEntity(cellEntities.debugText)

          cellEntities.root = undefined as any
          cellEntities.visible = undefined as any
          cellEntities.visibleDebugCell = undefined as any
          cellEntities.debugText = undefined as any
        }
 
        //pre create all cells reduces FPS spikes
        //but costs a ton of up front creation going outside scene entity bounds
        //createCell()

        //when trus less jiters but overal FPS is worse
        const DO_NOT_UNLOAD_CELL = false
        const NESTED_CELLS_ENABLED = true
 
        let attached = false
        let visible = false
        const attachFn = ()=>{
          if(attached) return
          //lazy creating causes FPS spikes
          //can we pull from entity pool???
          if(!cellEntities.root){ 
            createCell()
          }
          
          if(NESTED_CELLS_ENABLED){
            Transform.createOrReplace(cellEntities.root, {
              position: position,
              //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
              //ONLY ATTACH WHEN READY to reduce overhead
              parent: pGrid
            })
          }else{
            if(args.moveWithWorld){
              Transform.createOrReplace(cellEntities.root, {
                //0 pos
                //position: position,
                //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
                //ONLY ATTACH WHEN READY to reduce overhead
                //parent: pGrid
              })

              MovesWithWorld.create(cellEntities.root,{
                id:args.id,
                //is offset of absolute?
                //use parent grid as anchor point?
                position: position
              })
            }
          }
          attached = true
        }
        const detatchFn = ()=>{
          if(DO_NOT_UNLOAD_CELL) return
          if(!attached) return

          if(NESTED_CELLS_ENABLED){
            Transform.createOrReplace(cellEntities.root, {
              position: position,
              //scale: Vector3.create(GRID_CELL_SIZE,1,GRID_CELL_SIZE)
              //ONLY ATTACH WHEN READY to reduce overhead
              parent: undefined
            })
          }else{
            //TODO remove moves with world
          }

          destoryCell()

          attached = false
        }
        
        const showFn = ()=>{
          if(visible) return
          visible = true

          //log("showFn",id,y,_yGridIdx)
          if(args.debug.enabled){
            Material.setPbrMaterial(cellEntities.visibleDebugCell, args.debug.cellMaterial)
            MeshRenderer.setBox(cellEntities.visibleDebugCell)

            //TODO let config set color and font size
            TextShape.createOrReplace(cellEntities.debugText, {text:debugText,textColor:Color4.Blue(),fontSize:4})
            Billboard.createOrReplace( cellEntities.debugText, {billboardMode: BillboardMode.BM_Y | BillboardMode.BM_Z | BillboardMode.BM_X})
          }
          if(hasModel){
            GltfContainer.createOrReplace(cellEntities.visible,{ 
              src: terrainTileSetModelFolder+tileCell.src + "." + tileModelExt,
              invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
              visibleMeshesCollisionMask: ColliderLayer.CL_NONE
            })
          } 
          
        }
        const hideFn = ()=>{
          //WHAT IF HIDE CALLS VISIBLE=FALSE ????
          //if(DO_NOT_UNLOAD_CELL) return
          visible = false
 
          //MeshRenderer.deleteFrom( cellEntities.visible)
          GltfContainer.deleteFrom( cellEntities.visible)
          MeshRenderer.deleteFrom( cellEntities.visibleDebugCell) 
          TextShape.deleteFrom( cellEntities.debugText)
          Billboard.deleteFrom( cellEntities.debugText)
        }
        cells.push(new GridCell({
          id:id,
          position: position,
          //createFn: ()=>{},
          attachFn: attachFn,
          detatchFn: detatchFn,
          showFn: showFn,
          hideFn: hideFn
          ,parent: pGrid
          //,root:cellRoot,visible:visibleCell,debugText:entDebugText
        }))

        /*Material.setPbrMaterial(cell, {
            //texture: Material.Texture.,
            albedoColor: Color4.fromHexString("#00000088"),
            specularIntensity: 0,
            metallic: 0,
            roughness: 1
        })*/
        //for(let y = -GRID_WIDTH; y < GRID_WIDTH; y++){

        //}
      }
      //increment by yCell ration because
      //FIXME  i think (y>yGridIdx) only works for ratio 2
      if(cellYRatio == 1 || (y>yGridIdxTracker)){
        yGridIdxTracker += cellYRatio
        yGridIdx++
      }
    }//end y loop
  }
 
  //SHOULD MOVE WITH WORLD POSITION BE DONE HERE?
  //currently everything move with world is centered to physics engine
  //and requires an offset to move it off that
  //or 1 root and parent the rest so its relative?
  //TRY THIS?
  //use a MovesWithWorldChild to flag it to be parented to root?
  if(args.moveWithWorld){
    MovesWithWorld.create(pGrid,{id:args.id})
  }
 
  return {root:pGrid,cells:cells}
}

