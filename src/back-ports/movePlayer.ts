//workaround, during move player, onEnterScene/onLeaveScene trigger, should not

import { Vector3 } from "@dcl/sdk/math"
import { movePlayerTo } from "~system/RestrictedActions"

let MOVE_PLAYER_IN_PROGRESS = false

export function isMovePlayerInProgress(){
    return MOVE_PLAYER_IN_PROGRESS
}
export function setMovePlayerInProgress(b:boolean){
    console.log("setMovePlayerInProgress",b)
    MOVE_PLAYER_IN_PROGRESS = b
}

export function _movePlayerTo(position:Vector3,cameraLook?:Vector3){
    setMovePlayerInProgress(true)
    const p = movePlayerTo({newRelativePosition:position,cameraTarget:cameraLook})
    p.then(()=>{  
        setMovePlayerInProgress(false)
    })
    return p
}
