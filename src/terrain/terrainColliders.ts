import { Vector3 } from '@dcl/sdk/math'
import { log } from '../back-ports/backPorts'
import { loadCollidersFromJSON } from '../modules/cannon-colliders/func.collidersFromJSON'
import { Collider, ColliderInst } from '../modules/cannon-colliders/interface.Collider'
import { REGISTRY } from '../registry'
import { ColliderData } from '../sceneConfigType'

const CLASSNAME = "terrainColliders.ts"



export type CollidersCreateRequest = {
  colliderData: ColliderData
}
export type ColliderCreateResult={
  colliders: ColliderInst[]
}

export function createTerrainColliders(
    args:CollidersCreateRequest
  ):ColliderCreateResult
  {
    const METHOD_NAME = "createColliders"
    log(CLASSNAME,METHOD_NAME,"ENTRY")
    if(REGISTRY.physics.world === undefined){
      throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics world!!")
    }
    if(REGISTRY.physics.groundMaterial === undefined){
      throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics groundMaterial!!")
    }
    //log(CLASSNAME,METHOD_NAME,"CANNON",CANNON)
  
    //log(CLASSNAME,METHOD_NAME,"CANNON.Trimesh",CANNON.Trimesh)
  
    const offset = args.colliderData.offset
    const colliderConf:Collider[] = args.colliderData.collider//skatepark_will_colliders_8x8x10// as ColliderConf[]

    
    const world = REGISTRY.physics.world!
    const colliderInsts = loadCollidersFromJSON(world, colliderConf,offset ? offset : Vector3.Zero())
    
    /*for(const collider of colliderConf){
      let colliderShape = new CANNON.Trimesh(collider.vertices, collider.indices)
      const colliderBody = new CANNON.Body({
        mass: 0, // mass == 0 makes the body static //why is the trick 0 mass???
        position: new CANNON.Vec3(collider.position[0],collider.position[1],collider.position[2])
      }) 
      colliderBody.material = REGISTRY.physics.groundMaterial
      colliderBody.addShape(colliderShape)

      world.addBody(colliderBody)

       
    }*/
    
    const result:ColliderCreateResult = {
      colliders: colliderInsts
    }
    return result;
}

