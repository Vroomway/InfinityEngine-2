import *  as  ui from 'dcl-ui-toolkit'
//import { REGISTRY } from 'src/registry'
import { CONFIG } from '../config'
import { REGISTRY } from '../registry'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Transform, engine } from '@dcl/sdk/ecs'
import { log } from '../back-ports/backPorts'
import { destroyAvatarTrap, initAvatarTrap } from '../modules/avatarTrap/avatarTrap'


const buttonPosSTART = -200
let buttonPosCounter = buttonPosSTART
let buttonPosY = 350
const buttonWidth = 121
const changeButtonWidth = 120
const changeButtonHeight = 16

function updateDebugButtonUI(testButton: PromptButton) {
    if (changeButtonWidth > 0) testButton.imageElement.uiTransform!.width = changeButtonWidth
    if (changeButtonHeight > 0) testButton.imageElement.uiTransform!.height = changeButtonHeight
    testButton.labelElement.fontSize = 14
}
function boolShortNameOnOff(val: boolean) {
    if (val) return "On"
    return "Off"
}
let alreadyInit = false
export async function createDebugUIButtons() {
    if (!CONFIG.TEST_CONTROLS_ENABLE) {
        console.log("debug buttons DISABLED")
        return
    }
    if(alreadyInit) {
        log("createDebugUIButtons","alreadyInit!!!")
        debugger
        return
    }
    alreadyInit = true
    
    console.log("debug buttons")

    let testButton: PromptButton | null = null

    const testControlsToggle = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKLARGE, width: 1, height: 1, startHidden: false })

    // testControlsToggle.background.positionY = 350

    //testControls.background.visible = false
    testControlsToggle.closeIcon.hide()
    //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
    //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)  
    const enableDisableToggle = testButton = testControlsToggle.addButton(
        {
            style: ui.ButtonStyles.RED,
            text: 'show:false',
            xPosition: buttonPosCounter + (buttonWidth*4),
            yPosition: buttonPosY,
            onMouseDown: () => {
                console.log("enableDisableToggle " + testControls.isVisible())
                if (testControls.isVisible()) {
                    testControls.hide()
                    //testControls.isVisible() ? testControls.closeIcon.show() : testControls.closeIcon.hide()
                } else {
                    testControls.show()
                    //testControls.isVisible() ? testControls.closeIcon.show() : testControls.closeIcon.hide()
                }
                testControls.closeIcon.hide()
                enableDisableToggle.text = 'show:' + !testControls.isVisible()
            },
        }
    )

    if (changeButtonWidth > 0) testButton.imageElement.uiTransform!.width = changeButtonWidth
    if (changeButtonHeight > 0) testButton.imageElement.uiTransform!.height = changeButtonHeight

    buttonPosCounter += buttonWidth

    const testControls = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKLARGE, width: 1, height: 1, startHidden: false })

    //testControls.hide()

    // testControls.background.positionY = 350

    //testControls.background.visible = false
    testControls.closeIcon.hide()
    //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
    //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)  

    //type TourState = 'not-init'|'tour-not-ready'|'tour-npc-waiting'|'find-to-ask'|'ask-tour'|'touring'|'tour-completed'|'tour-declined'

    const testControlBtns = [
        
        {
            style: ui.ButtonStyles.RED,
            text: "RaceTrack:on",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR.goRaceTrack()
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "RaceTrack:off",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR.raceTrackScene.destroy()
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "SkateParkStom:on",
            onMouseDown: () => {
                //REGISTRY.SCENE_MGR.skateParkSceneStom.init()
                REGISTRY.SCENE_MGR.goSkateParkStom()
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "SkateParkStom:off",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR.skateParkSceneStom.destroy()
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Respawn:Default",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR._activeScene.moveVehicleToDefaultSpawn()
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "AvatarTrap:on",
            onMouseDown: () => {
                initAvatarTrap()
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "AvatarTrap:off",
            onMouseDown: () => {
                destroyAvatarTrap()
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Avatar1",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR._activeScene.avatar.updateAvatarEntities(
                    CONFIG.AVATAR_DEFAULTS
                )
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Avatar2",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR._activeScene.avatar.updateAvatarEntities(
                    CONFIG.AVATAR2_DEFAULTS
                )
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Skybox:off",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR._activeScene.skybox.hide()
            }
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Skybox:on",
            onMouseDown: () => {
                REGISTRY.SCENE_MGR._activeScene.skybox.show()
            }
        } 
    ]

    for (let i = 0; i < testControlBtns.length; i++) {
        if (i % 5 == 0) {
            // new row
            buttonPosY -= changeButtonHeight + 2
            buttonPosCounter = buttonPosSTART
        }
        updateDebugButtonUI(
            testControls.addButton({
                ...testControlBtns[i],
                xPosition: buttonPosCounter,
                yPosition: buttonPosY,
            })
        )
        buttonPosCounter += buttonWidth //next column
        
    }
}