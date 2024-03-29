import { Entity, SystemFn, SystemItem, engine } from "@dcl/sdk/ecs";
import { SystemWrapperBasic } from "./utils/systemsHelpers";
import { WorldMoveVehicle } from "./world/worldMoveVehicle";
import { AvatarTrapEntity } from "./modules/avatarTrap/avatarTrap";
import { MySceneManager } from "./scenes/mySceneManager";
import Grid from "./modules/spacePartition/Grid";
import CANNON from "cannon";
import { WorldState } from "./world/worldMoveState";

//registry will hold
//physicsSystem - decouple sync back to DCL sdk? or make easier to register callback???
//WorldState
//playerMoveInput system - current in worldMoveSate

export type EntityWrapper={
  entity:Entity
}


export class RegistryEntities {
  avatarTrap!: AvatarTrapEntity
  moveWithWorldGrid!: EntityWrapper
  fixedGrid!: EntityWrapper
  /*
  alternativeScene!: Entity;
  secondaryAlternativeScene!: Entity;
  rootScene!: Entity;*/
} 
export class RegistrySystems {
  worldStepSystem?: SystemWrapperBasic
  keepPlayerCenteredSystem?: SystemWrapperBasic
  /*
  alternativeScene!: Entity;
  secondaryAlternativeScene!: Entity;
  rootScene!: Entity;*/
} 
export class RegistryPhysics {
  world?: CANNON.World
  player?: WorldMoveVehicle
  //TODO REMOVE groundMaterial
  groundMaterial?: CANNON.Material
  /*
  alternativeScene!: Entity;
  secondaryAlternativeScene!: Entity;
  rootScene!: Entity;*/
} 

export class Registry {
  worldState!:WorldState
  SCENE_MGR!: MySceneManager
  spacePartioner!:Grid
  systemsByName:Map<string,SystemWrapperBasic> = new Map();
  entities: RegistryEntities = new RegistryEntities();
  systems: RegistrySystems = new RegistrySystems();
  physics: RegistryPhysics = new RegistryPhysics();

  registerSystem(system: SystemWrapperBasic) {
    const name = system.getName()
    if(name){
      this.systemsByName.set(name , system)
    }else{
      console.log("WARNING","registerSystem","system missing name!!!");
      
    }
  }
  unregisterSystem(system: SystemWrapperBasic) {
    const name = system.getName()
    if(name){
      this.systemsByName.delete(name)
    }else{
      console.log("WARNING","unregisterSystem","system missing name!!!");
      
    }
  }
}

export let REGISTRY: Registry;
export function initRegistry() {
  console.log("initRegistry called");
  if (REGISTRY === undefined) {
    REGISTRY = new Registry();
  }
  return REGISTRY
}