// deno-lint-ignore-file ban-types no-explicit-any

import { sendSignal } from '../client_deps.ts' 
import { onEvent } from '../client_deps.ts'
import { on, fire } from '../client_deps.ts'
import * as Players from './players.ts'
import type { Player }  from './players.ts'
import * as PlaySound from './sounds.ts'
import * as dice from './dice.ts'
import * as Possible from './possible.ts'
import ScoreElement from './scoreElement.ts'
import * as rollButton from './rollButton.ts'


///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//         local const for faster resolution        \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

const snowColor = 'snow'
const grayColor = 'gray'

///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//      exported aliases for faster resolution      \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

export let game: DiceGame

/** the main view-model for the dice game */
export class DiceGame {

    players: Set<Player>
    scoreItems: ScoreElement[]
    leftBonus: number
    fiveOkindBonus: number
    leftTotal: number
    rightTotal: number

    /** DiceGame private instance, exposed by init() */
    private static _instance: DiceGame

    /** singleton initialization */
    static init() {
        if (DiceGame._instance) {
            return
        } else {
            DiceGame._instance = new DiceGame()
            game = DiceGame._instance
        }
    }

    /** private singleton constructor, called from init() */
    private constructor() {
        Players.init(this, snowColor)
        this.players = Players.players;
        this.scoreItems = []
        this.leftBonus = 0
        this.fiveOkindBonus = 0
        this.leftTotal = 0
        this.rightTotal = 0
        dice.init()
        rollButton.init()

        onEvent('ResetTurn', (_data: {}) => {
            if (!this.isGameComplete()) {
                this.resetTurn()
            }
        })

        onEvent('ResetGame', () => {
            this.resetGame()
        })

        on('PopupResetGame', () => {
            sendSignal({ event: 'ResetGame', data: "" })
            this.resetGame()
        })

        on('ScoreElementResetTurn', () => {
            if (this.isGameComplete()) {
                this.clearPossibleScores()
                this.setLeftScores()
                this.setRightScores()
                this.showFinalScore(this.getWinner())
            } else {
                this.resetTurn()
            }
        })

        on('ViewWasAdded', (data: { type: string, index: number, name: string }) => {
            if (data.type === 'ScoreButton') {
                this.scoreItems.push(new ScoreElement(data.index, data.name))
            }
        })
    }

    /** check score total and determin the winner of this game */
    getWinner() {
        if (this.players.size === 1) {
            return this.getPlayer(0)
        }
        let thisWinner = this.getPlayer(0)
        let highscore = 0
        for (const player of this.players) {
            if (player.score > highscore) {
                highscore = player.score
                thisWinner = player
            }
        }
        return thisWinner
    }

    /** clear all scoreElements possible score value */
    clearPossibleScores() {
        for (const scoreItem of this.scoreItems) {
            scoreItem.clearPossible()
        }
    }

    /** evaluates the dice and then sets a possible score value for each scoreelements */
    evaluatePossibleScores() {
        for (const scoreItem of this.scoreItems) {
            scoreItem.setPossible()
        }
    }

    /** resets the turn by resetting values and state */
    resetTurn() {
        Players.setCurrentPlayer(Players.getNextPlayer(Players.currentPlayer))
        PlaySound.enabled(Players.currentPlayer.id === Players.thisPlayer.id)
        rollButton.btnState.color = Players.currentPlayer.color
        rollButton.btnState.disabled = false
        rollButton.btnState.text = 'Roll Dice'
        rollButton.update()
        dice.resetTurn()
        this.clearPossibleScores()
        this.setLeftScores()
        this.setRightScores()
    }

    /** resets game state to start a new game */
    resetGame() {
        document.title = Players.thisPlayer.playerName
        fire('HidePopup', {})
        Players.setCurrentPlayer(this.getPlayer(0))
        dice.resetGame()
        for (const scoreItem of this.scoreItems) {
            scoreItem.reset()
        }
        // clear the view
        Players.resetScoreLabels()
        this.leftBonus = 0
        this.fiveOkindBonus = 0
        this.leftTotal = 0
        this.rightTotal = 0

        fire('UpdateLeftscore',
            { color: 'gray', text: 'left total = 0' }
        )
        Players.resetPlayers()
        rollButton.btnState.color = 'brown'
        rollButton.btnState.text = 'Roll Dice'
        rollButton.btnState.disabled = false
        rollButton.update()
    }

    /** show a popup with winner and final score */
    showFinalScore(winner: any) {
        let winMsg
        if (winner.id !== Players.thisPlayer.id) {
            PlaySound.Nooo()
            winMsg = winner.playerName + ' wins!'
        }
        else {
            PlaySound.Woohoo()
            winMsg = 'You won!'
        }
        rollButton.btnState.color = 'black'
        rollButton.btnState.text = winMsg
        rollButton.update()
        fire('UpdateInfo', winMsg + ' ' + winner.score)
        fire('PopupResetGame', { show: true, title: 'You Won!', msg: winMsg + ' ' + winner.score })
        sendSignal({
            event: 'ShowPopup',
            data: {
                title: 'Game Over',
                msg: winner.playerName + ' wins!' + ' ' + winner.score
            }
        }
        )
    }

    /** check all scoreElements to see if game is complete */
    isGameComplete() {
        let result = true
        for (const scoreItem of this.scoreItems) {
            if (!scoreItem.owned) {
                result = false
            }
        }
        return result
    }

    /** sum and show left scoreElements total value */
    setLeftScores() {
        this.leftTotal = 0
        for (const player of this.players) {
            player.score = 0
        }
        let val
        for (let i = 0; i < 6; i++) {
            val = this.scoreItems[i].finalValue
            if (val > 0) {
                this.leftTotal += val
                const owner = this.scoreItems[i].owner
                if (owner) {
                    Players.addScore(owner, val)
                    if (this.scoreItems[i].hasFiveOfaKind && (dice.fiveOfaKindCount > 1)) {
                        Players.addScore(owner, 100)
                    }
                }
            }
        }
        if (this.leftTotal > 62) {
            let bonusWinner = this.getPlayer(0)
            let highleft = 0
            for (const player of this.players) {
                if (player.score > highleft) {
                    highleft = player.score
                    bonusWinner = player
                }
            }

            Players.addScore(bonusWinner, 35)

            fire('UpdateLeftscore',
                {
                    color: bonusWinner.color,
                    text: `left total = ${this.leftTotal.toString()} + 35`
                }
            )
        }
        else {

            fire('UpdateLeftscore',
                {
                    color: grayColor,
                    text: 'left total = ' + this.leftTotal.toString()
                }
            )
        }
        if (this.leftTotal === 0) {
            fire('UpdateLeftscore',
                { color: grayColor, text: 'left total = 0' }
            )
        }
    }

    /** sum the values of the right scoreElements */
    setRightScores() {
        let val
        const len = this.scoreItems.length
        for (let i = 6; i < len; i++) {
            val = this.scoreItems[i].finalValue
            if (val > 0) {
                const owner = this.scoreItems[i].owner
                if (owner) {
                    Players.addScore(owner, val)
                    if (this.scoreItems[i].hasFiveOfaKind
                        && (dice.fiveOfaKindCount > 1)
                        && (i !== Possible.FiveOfaKindIndex)
                    ) {
                        Players.addScore(owner, 100)
                    }
                }
            }
        }
    }

    getPlayer(index: number) {
        for (const player of this.players) {
            if (player.idx === index) {
                return player
            }
        }
        return [...this.players][index];
    }
}
