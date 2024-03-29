import { Schemas, engine } from '@dcl/sdk/ecs'

// We use this component to track and group all the cubes.
// engine.getEntitiesWith(Cube)
export const Vehicle = engine.defineComponent('vehicle-id', {
    gravitySpeedY:Schemas.Number
  
})

export const VehicleRotation = engine.defineComponent('vehicle-rotation-id', {
    
})

export const Terrain = engine.defineComponent('terrain-id', {})

export const EntityId = engine.defineComponent('entity-name-id', {
    id: Schemas.String
})
