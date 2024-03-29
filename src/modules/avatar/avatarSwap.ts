import { AvatarModifierArea, AvatarModifierType, ColliderLayer, Entity, GltfContainer, Material, MaterialTransparencyMode, MeshRenderer, PBGltfContainer, Transform, TransformTypeWithOptionals, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Vehicle, VehicleRotation } from "../../components"
import { Color4, Vector3 } from "@dcl/sdk/math"
import { CONFIG } from "../../config"
import { EntityWrapper } from "../SceneMgmt/subScene"
import { ISystemWrapper } from "../../utils/systemsHelpers"
import { cloneTransformTypeWithOptionals } from "../../utils/utilities"


//export let car:PlayerCar

//TODO flush this out
export type AvatarData = {
  id:string 
  name:string
  body:{
    transform: TransformTypeWithOptionals
    mesh:PBGltfContainer
  }

}

//TODO rename to avatarswap

export class BaseAvatar extends EntityWrapper{

  systems:ISystemWrapper[] = []

  //driverEntity:Entity
  avatar! :Entity
  avatarData:AvatarData
  /*
  carRearWheelL:Entity
  carRearWheelR:Entity
  carFrontWheelL:Entity
  carFrontWheelR:Entity
  carFrontWheelRootL:Entity
  carFrontWheelRootR:Entity
  exhaustFire:Entity
  wheelSpeed:number
  wheelSystem:WheelRotSystem
  skidSystem:SkidMarkSystem
  getInCarText:TextShape
  getInCarMarker:Entity
  driverPosition:Vector3
  wheelRotMax:number = 30
  wheelRotMin:number = -30
  carData:CarData
  driver:PlayerBase
  carCollider:Entity
  carColliderTop:Entity*/

  constructor(name:string,avatarData:AvatarData){
    super( name,[] )
    this.avatarData = avatarData
  }
  reset(){
    
  }

  updateCarData(carData:AvatarData){
    
  }
  onInit(bar:any){

    const car = this.avatar = engine.addEntity()
    let avatarRoot = this.rootEntity = engine.addEntity()

    //super.onInit()
    this.updateAvatarEntities(this.avatarData) 
    /*
    this.car = new Entity(this.name+'.car')
    this.driverEntity = new Entity(this.name+'.driverEnt')
    this.carRearWheelL = new Entity(this.name+'.carRearWheelL')
    this.carRearWheelR = new Entity(this.name+'.carRearWheelR')
    this.carFrontWheelL = new Entity(this.name+'.carFrontWheelL')
    this.carFrontWheelR = new Entity(this.name+'.carFrontWheelR')
    this.carFrontWheelRootL = new Entity(this.name+'.carFrontWheelRootL')
    this.carFrontWheelRootR = new Entity(this.name+'.carFrontWheelRootR')
    this.exhaustFire = new Entity(this.name+'.exhaustFire')
    this.carCollider = new Entity(this.name+'.carCollider')
    this.carColliderTop = new Entity(this.name+'.carCollider.top')

    //make sure added in order of parentage, parents first, children last
    const ents:Entity[] = [ this.car,this.driverEntity
      ,this.carRearWheelL,this.carRearWheelR,this.carFrontWheelL,this.carFrontWheelR,this.carFrontWheelRootL,this.carFrontWheelRootR,
      ,this.exhaustFire,this.carCollider,this.carColliderTop ]
    //load entities
    for(const p in ents){
      this.entities.push( ents[p] )
    }

    this.updateCarData(this.carData)
    */
    //will set default orientations
    this.reset()
  }
  
  
  
  updateAvatarEntities(carData:AvatarData){
      const avatar = this.avatar
      let avatarRoot = this.rootEntity

      Transform.createOrReplace(avatar, cloneTransformTypeWithOptionals(carData.body.transform))
      // MeshRenderer.setBox(car)
      // Material.setPbrMaterial(car, {
      //   transparencyMode:MaterialTransparencyMode.MTM_ALPHA_BLEND,
      //   albedoColor: Color4.fromInts(255,255,255,100)
    
    
      GltfContainer.createOrReplace(avatar, carData.body.mesh) 
      VehicleRotation.createOrReplace(avatar)
    
      Transform.createOrReplace(avatarRoot, {
        position:Vector3.create( CONFIG.infinEngineCenter.x, CONFIG.infinEngineCenter.y-0.35, CONFIG.infinEngineCenter.z )
      })
      Vehicle.createOrReplace(avatarRoot, {
        gravitySpeedY: 0
      })  
    
      //hide player, attached to vehicle
      AvatarModifierArea.createOrReplace(avatarRoot, {
        excludeIds: [],
        area: Vector3.create(4, 3, 4),
        modifiers: [AvatarModifierType.AMT_HIDE_AVATARS]
      })
      //Transform.getMutable(avatarTrap).parent = vehicleRoot
      Transform.getMutable(avatar).parent = avatarRoot
    
  }
  
  hide(): void {
    super.hide()
  }
  disable(){
    super.disable()
    /*for(const p in this.systems){
      if(this.systems[p].active)  engine.removeSystem(this.systems[p])
    }*/
  }

  enable(){
    super.enable()
    /*for(const p in this.systems){
      if(!this.systems[p].active)  engine.addSystem(this.systems[p])
    }*/
  }
  
}

export class PlayerAvatar extends BaseAvatar{
  
}
export function initAvatarSwap(avatarData:AvatarData){
  const avatar = new PlayerAvatar("playerAvatar",avatarData)
  avatar.init()

  return avatar
}

