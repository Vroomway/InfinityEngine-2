import { Entity, GltfContainer, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { MovesWithWorld } from "../world/worldMoveComponent";

export class DebugSpherePool {
    spheres:Entity[]
    MAX_POOL_SIZE:number = 1

    constructor(){
        this.spheres = []

        for (let i=0; i< this.MAX_POOL_SIZE; i++ ){

            let sphere = engine.addEntity()
            Transform.create(sphere, {
                //position: Vector3.create(10,-3, 10),
                scale: Vector3.create(8.25,8.25,8.25)
            })
            GltfContainer.create(sphere, { src: "assets/axis.glb"})
            MovesWithWorld.create(sphere)

            this.spheres.push(sphere)
        }
    }

    spawnSphere(_pos:Vector3, _normal:Vector3, _forward:Vector3){
        let sphere = this.spheres.shift()

        if(sphere){

            const transform = Transform.getMutable(sphere)
            Vector3.copyFrom(_pos, transform.position)
            //transform.rotation = Quaternion.fromToRotation( Vector3.Up(), _normal, _forward)
            transform.rotation = Quaternion.lookRotation(_forward, _normal)


            this.spheres.push(sphere)
        }
    }
}