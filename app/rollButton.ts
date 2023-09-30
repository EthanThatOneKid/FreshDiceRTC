
import { onEvent } from '../client_deps.ts'
import { sendSignal } from '../client_deps.ts'
import { on, fire } from '../client_deps.ts'
import * as dice from './dice.ts'

export const btnState = { text: 'Roll Dice', color: 'Brown', disabled: false }

/** RollButton viewModel initialization - Called from DiceGame ctor */
export const init = () => {
    // when this instance rolls dice
    on('RollButtonTouched', () => {
        dice.roll(null)
        sendSignal({event: 'UpdateRoll', data: dice.toString()})
        updateRollState()
    })

    // when oponents rolled the dice
    onEvent('UpdateRoll', (diceArray: string) => {
        dice.roll(JSON.parse(diceArray))
        updateRollState()
    })

}

/** state management for the roll button */
const updateRollState = () => {
    switch (dice.rollCount) {
        case 1:
            btnState.text = 'Roll Again'
            break
        case 2:
            btnState.text = 'Last Roll'
            break
        case 3:
            btnState.disabled = true
            btnState.text = 'Select Score'
            break
        default:
            btnState.text = 'Roll Dice'
            dice.setRollCount(0)
    }
    update()
}

/** fires an update event with the current state */
export const update = () => {
    fire('UpdateRollButton', btnState)
}
