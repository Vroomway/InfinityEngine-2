import { Entity } from "@dcl/sdk/ecs";
import { EntityWrapper } from "../registry";

export function assertAssigned(entity:EntityWrapper|Entity,entId:string,caller:string,failMsg:string){
    if(!entity){
        console.log("WARNING",entId,caller,failMsg)
    }
}