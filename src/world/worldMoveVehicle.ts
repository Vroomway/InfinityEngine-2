import { Entity, Material, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Color4, Vector3 } from "@dcl/sdk/math";
import CANNON from "cannon";
import { REGISTRY } from "../registry";
import { SceneConfig } from "../sceneConfigType";
import { ColliderCreateResult } from "../terrain/terrainColliders";
import { CONFIG } from "../config";


const CLASSNAME = "worldMoveVehicle.ts"

//TODO seperate conf from state!
export type WorldMoveVehicleState = {
  //CONFIGURATION PROPERTIES

  /**if the force of the speed winds down or just turns off 
   * true - winds down, false - turns off once key is released
  */
  speedDecayEnabled:boolean
  /** decay force apply on speed if enabled */
  speedDecayFactor:number
  /** max speed/force */
  maxSpeed:number

  /** backwards force applied to speed */
  speedBackwardsFactor:number
  /** max backwards force allowed */
  maxBackSpeed:number

  /** impulse force applied when jumping */
  jumpImpulseForce:Vector3,

  /** mass of car */
  mass:number,
  /** size of the sphere representing the car */
  shapeRadius: number,
  linearDamping:number,
  angularDamping:number,
  
  //ACTIVE STATE PROPERTIES
  /** speed/force applied to car */
  speed:number
  gasActive:boolean
  brakesActive:boolean
  moveActive:boolean
  jump:boolean
  spin:boolean
}

export type WorldMoveVehicle = {
  entity: Entity
  physicsBody: CANNON.Body
  state: WorldMoveVehicleState
}

export function createWorldMoveVehicleContacts(result:ColliderCreateResult){
  const METHOD_NAME = "createWorldMoveVehicleContacts"

  if(REGISTRY.physics.world === undefined){
    throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics world!!")
    return;
  }
  if(REGISTRY.physics.player === undefined){
    throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics player!!")
    return;
  }

  const playerMaterial = REGISTRY.physics.player.physicsBody.material

  //does not seem to do anything???
  /*const ballGroundContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(playerMaterial, groundMaterial, {
    friction: 0.3,
    restitution: 0, //bouncyness, larger number more bouncy 
    contactEquationStiffness: 1000,
    contactEquationRelaxation: 1000, //small makes bouncier? large makes less bouncy
  })      
  world.addContactMaterial(ballGroundContactMaterial)*/

  //const groundMaterial = new CANNON.Material('groundMaterial')
  //REGISTRY.physics.groundMaterial = groundMaterial

  for(const collider of result.colliders){
    const conf = collider.conf
    const colliderontactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(playerMaterial, collider.body.material, {
      friction: conf.friction,
      restitution: conf.restitution,//0, //bouncyness, larger number more bouncy 
      contactEquationStiffness: 1000,
      contactEquationRelaxation: 1000, //small makes bouncier? large makes less bouncy
    })      
    REGISTRY.physics.world!.addContactMaterial(colliderontactMaterial)

  }
    

}
export function initWorldMoveVehicle(sceneConfig:SceneConfig){
  const METHOD_NAME = "initWorldMoveVehicle"

  if(REGISTRY.physics.world === undefined){
    throw new Error(CLASSNAME+"."+METHOD_NAME+": no physics world!!")
    return;
  }

  //should be part of "car"?
  let vehicle:WorldMoveVehicle = createWorldMoveVehicle(
    Vector3.create(2,0,2),
    REGISTRY.physics.world,
    sceneConfig.worldVehicle
  )

  //copy values over
  //sceneConfig.worldVehicle = {...sceneConfig.worldVehicle}
  //vehicle.state.speed

  REGISTRY.physics.player = vehicle
  
}
export function createWorldMoveVehicle(position: Vector3, cannonWorld: CANNON.World, worldVehicleConf:WorldMoveVehicleState):WorldMoveVehicle {
  const ball = engine.addEntity()
  let body: CANNON.Body
  let world = cannonWorld
  


  //TODO not sure what ball does for us?  not even needed????
  Transform.create(ball, {
    position: position,
    scale: Vector3.create(1,1,1)
  })
  MeshRenderer.setSphere(ball)
  
  Material.setPbrMaterial(ball, {
      //texture: Material.Texture.,
      albedoColor: Color4.fromHexString("#00000088"),
      specularIntensity: 0,
      metallic: 0,
      roughness: 1
  })
    // Create physics body for ball

  const ballTransform =  Transform.get(ball)




  
  //NOTE. trimesh only works with spheres and planes, nothing else
  //https://sbcode.net/threejs/physics-cannonjs/
  //could the car wheels be made sphers to work???
  if(false){
    //can this help? 
    //https://github.com/pmndrs/cannon-es/blob/master/examples/raycast_vehicle.html
    //https://github.com/decentraland-scenes/cannon-car-example-scene/blob/master/src/game.ts#L148C7-L148C19
    //https://github.com/decentraland/sdk7-goerli-plaza/blob/main/cannon-car-example-scene/src/index.ts

    // Build the car chassis
    //const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1))
    const scale = 1;
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2/scale, 0.5/scale, 1/scale))
    const chassisBody = new CANNON.Body({ mass: 1 })
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(  
      ballTransform.position.x,
      ballTransform.position.y,
      ballTransform.position.z
    ) 
    chassisBody.angularVelocity.set(0, 0.5, 0)
    //demo.addVisual(chassisBody) 
    
    // Create the vehicle
    const vehicle = new CANNON.RaycastVehicle({
      chassisBody,
    })
    
    const wheelOptions = {
      radius: 0.5/scale,
      directionLocal: new CANNON.Vec3(0, 0, -1),//new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 30,
      suspensionRestLength: 0.3,
      frictionSlip: 1.4,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(0, 1, 0),//new CANNON.Vec3(0, 0, 1),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),//new CANNON.Vec3(-1, 0, 1),
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    }

    wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1, 0, 1)
    vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1, 0, -1)
    vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(world)

    // Add the wheel bodies
    const wheelBodies:CANNON.Body[] = []
    const wheelMaterial = new CANNON.Material('wheel')
    //TODO ADD THIS BACK had to comment out when ground material was getting removed
    /*const wheelGroundContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000,
    })*/
    
    vehicle.wheelInfos.forEach((wheel) => {
      //FIXME make wheel a sphere for trimesh?
      const cylinderShape = new CANNON.Cylinder(wheel.radius!, wheel.radius!, wheel.radius! / 2, 20)
      const wheelBody = new CANNON.Body({
        mass: 0,
        material: wheelMaterial,
      })
      wheelBody.type = CANNON.Body.KINEMATIC
      wheelBody.collisionFilterGroup = 0 // turn off collisions
      if(false){
        const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
      }else{
        let q: CANNON.Quaternion = new CANNON.Quaternion()
        q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q)
      }

      wheelBodies.push(wheelBody)
      //demo.addVisual(wheelBody)
      world.addBody(wheelBody)
    })

    // Update the wheel bodies, 
    //FIXME needs to go goes in the system!!!
    world.addEventListener('postStep', () => {
      for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i)
        //hack cast to any
        const transform = (vehicle.wheelInfos[i] as any).worldTransform
        const wheelBody = wheelBodies[i]
        wheelBody.position.copy(transform.position)
        wheelBody.quaternion.copy(transform.quaternion)
      }
    })
    //NEEDS TO BE CANNON.BODY
    body = chassisBody

  }else{

    //UPDATE FROM CONF!!!
      // Create physics body for ball
      body = new CANNON.Body({
        mass: worldVehicleConf.mass, // kg
        position: new CANNON.Vec3(
          Transform.get(ball).position.x,
          Transform.get(ball).position.y,
          Transform.get(ball).position.z
        ), // m
        // does not work for any shape but sphere
        shape: new CANNON.Sphere( worldVehicleConf.shapeRadius ) // Create sphere shaped body with a diameter of 0.22m
        //shape: new CANNON.Box(new CANNON.Vec3(1,1,1)) 
      })

      const ballMaterial = new CANNON.Material('ballMaterial')
      
      // Add material and dampening to stop the ball rotating and moving continuously
      //body.sleep()
      body.material = ballMaterial //works without this???
      //bigger means less roll
      //smaller means more roll
      body.linearDamping = worldVehicleConf.linearDamping
      body.angularDamping = worldVehicleConf.angularDamping
      world.addBody(body) // Add ball body to the world

  }
  // Ball collision
  // body.addEventListener('collide', () => {
  //   body.angularVelocity.setZero()    
  // })

  // Animator.create(ball, {
  //   states: [
  //     {
  //       clip: 'PickUp',
  //       playing: false,
  //       loop: false
  //     }
  //   ]
  // })

  return { entity:ball, physicsBody:body, state: {...worldVehicleConf} }
}
