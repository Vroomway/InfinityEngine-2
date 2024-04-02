import { Schemas, engine } from '@dcl/sdk/ecs'


export const Vehicle = engine.defineComponent('vehicle-id', {
    gravitySpeedY:Schemas.Number
  
})

export const VehicleRotation = engine.defineComponent('vehicle-rotation-id', {
    
})

export const EntityId = engine.defineComponent('entity-name-id', {
    id: Schemas.String
})
