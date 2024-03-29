import { Schemas, engine } from "@dcl/sdk/ecs";

export const MovesWithWorld = engine.defineComponent('moves-with-world-id', {
	//id of entity
	id: Schemas.String, 
	//position in world, 0,0,0 as origin relative to Infinity engine scene origin. not scene 0,0,0
    position: Schemas.Vector3
})
