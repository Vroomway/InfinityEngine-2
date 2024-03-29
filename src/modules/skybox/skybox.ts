import {  Entity, InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, Transform, VisibilityComponent, engine, inputSystem } from "@dcl/sdk/ecs";
import {  Vector3 , Quaternion} from "@dcl/sdk/math";
import { CONFIG } from "../../config";






//#region SkyBox

export class Skybox {
  skyboxRoot:Entity
  skyboxPZ:Entity
  skyboxNZ:Entity
  skyboxPY:Entity
  skyboxNY:Entity
  skyboxPX:Entity
  skyboxNX:Entity

  //fogSphere2: Entity;
  //fogSphere3: Entity;

  entities:Entity[] = []
  /*
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  raceGroundElevation: number;*/

  //making this small enough hides the level at distance
  //could be used when spawning stuff in
  //70 shows that on skate park
  //75 is safe for default 150 draw radius
  constructor(args:{radius: number, materialFolder: string}){
    const folderNumber = args.materialFolder//"8"

    //push box up
    const skyboxRadius = args.radius ? args.radius : 100
    const skyBoxYOffset = skyboxRadius//100

    //root
    this.skyboxRoot = engine.addEntity()
    Transform.create(this.skyboxRoot, {
      //TODO should be using skyBoxYOffset
        position: Vector3.create(CONFIG.infinEngineCenter.x, 0, CONFIG.infinEngineCenter.z)
    })
    
    //front
     this.skyboxPZ = engine.addEntity()
    Transform.create(this.skyboxPZ, {
        position: Vector3.create(0, 0 + skyBoxYOffset, skyboxRadius),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxPZ)
    Material.setBasicMaterial(this.skyboxPZ, {
        texture: Material.Texture.Common({
          src: folderNumber +"/pz.png" 
        })
      })
    
    //back
     this.skyboxNZ = engine.addEntity()
    Transform.create(this.skyboxNZ, {
        position: Vector3.create(0, 0 + skyBoxYOffset, -skyboxRadius),
        rotation: Quaternion.fromEulerDegrees(0,180,0),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxNZ)
    Material.setBasicMaterial(this.skyboxNZ, {
        texture: Material.Texture.Common({
          src: folderNumber +"/nz.png" 
        })
      })
    
    //Top
     this.skyboxPY = engine.addEntity()
    Transform.create(this.skyboxPY, {
        position: Vector3.create(0, skyboxRadius + skyBoxYOffset, 0),
        rotation: Quaternion.fromEulerDegrees(-90,0,0),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxPY)
    Material.setBasicMaterial(this.skyboxPY, {
        texture: Material.Texture.Common({
          src: folderNumber +"/py.png" 
        })
      })
    
    //Bottom
     this.skyboxNY = engine.addEntity()
    Transform.create(this.skyboxNY, {
        position: Vector3.create(0, -skyboxRadius + skyBoxYOffset, 0),
        rotation: Quaternion.fromEulerDegrees(90,0,0),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxNY)
    Material.setBasicMaterial(this.skyboxNY, {
        texture: Material.Texture.Common({
          src: folderNumber +"/ny.png" 
        })
      })
    
    //Right
     this.skyboxPX = engine.addEntity()
    Transform.create(this.skyboxPX, {
        position: Vector3.create(skyboxRadius, 0 + skyBoxYOffset, 0),
        rotation: Quaternion.fromEulerDegrees(0,90,0),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxPX)
    Material.setBasicMaterial(this.skyboxPX, {
        texture: Material.Texture.Common({
          src: folderNumber +"/px.png" 
        })
      })
    
    // Left
     this.skyboxNX = engine.addEntity()
    Transform.create(this.skyboxNX, {
        position: Vector3.create(-skyboxRadius, 0 + skyBoxYOffset, 0),
        rotation: Quaternion.fromEulerDegrees(0,-90,0),
        scale: Vector3.create(skyboxRadius*2,skyboxRadius*2,skyboxRadius*2),
        parent: this.skyboxRoot
    })
    MeshRenderer.setPlane(this.skyboxNX)
    Material.setBasicMaterial(this.skyboxNX, {
        texture: Material.Texture.Common({
          src: folderNumber +"/nx.png" 
        })
      })
    //#endregion
    
    //push all entities into array
    this.entities.push(this.skyboxRoot)
    this.entities.push(this.skyboxPZ)
    this.entities.push(this.skyboxNZ)
    this.entities.push(this.skyboxPY)
    this.entities.push(this.skyboxNY) 
    this.entities.push(this.skyboxPX)
    this.entities.push(this.skyboxNX)   
  }

  hide(){
    this.entities.forEach((entity)=>{
      VisibilityComponent.createOrReplace(entity, {visible: false})
    })
  }
  show(){
    this.entities.forEach((entity)=>{
      VisibilityComponent.createOrReplace(entity, {visible: true})
    })
  }
  destroy(){
    engine.removeEntityWithChildren(this.skyboxRoot)
  }
}
 
