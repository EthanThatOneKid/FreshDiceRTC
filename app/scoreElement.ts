
import { onEvent } from '../client_deps.ts'
import { sendSignal } from '../client_deps.ts'
import { on, fire } from '../client_deps.ts'
import { currentPlayer, thisPlayer, Player } from './players.ts'
import * as PlaySound from './sounds.ts'
import * as dice from './dice.ts'
import * as Possible from './possible.ts'

const SmallStraight = 8
const LargeStraight = 9
const FullHouse = 10

const emptyString = ''
const black = 'black'

/** ScoreElement viewModel class */
export default class ScoreElement {

    available: boolean
    owned: boolean
    index: number
    name: string
    owner: Player | null = null
    finalValue: number
    possibleValue: number
    scoringDieset: number[]
    scoringDiesetSum = 0
    hasFiveOfaKind = false

    /** constructor ... called from DiceGame.buildScoreItems()
     * @param index (number) - index of this instance
     * @param name (string) - the name of this instance */
    constructor(index: number, name: string) {

        this.available = false
        this.owned = false
        this.index = index
        this.name = name
        this.finalValue = 0
        this.possibleValue = 0
        this.scoringDieset = [0, 0, 0, 0, 0]

        // when I select a score
        on('ScoreButtonTouched', (index: number) => {
            if (index === this.index) {
                // notify all other players
                sendSignal({ event: 'UpdateScore', data: this.index })
                if (this.clicked()) {
                    sendSignal({ event: 'ResetTurn', data: "" })
                    fire('ScoreElementResetTurn', "")
                }
            }
        })

        // when other players select a score
        onEvent('UpdateScore', (index: number) => {
            if (index === this.index) {
                this.clicked()
            }
        })

        // show a message at bottom of screen when a user hovers on this element
        on('UpdateTooltip', (data: { index: number, hovered: boolean }) => {
            if (index === this.index) {
                let msg = ''
                if (data.hovered) {
                    if (this.owned) {
                        msg = `${thisPlayer.playerName} owns ${this.name} with ${this.scoringDieset.toString()}`
                    } else { // hovered not owned
                        msg = `${this.name}`
                    }
                } else { // not hovered
                    msg = ''
                }
                fire('UpdateInfo', msg);
            }
        })
    }

    /** broadcasts a message used to update the bottom infolabel element */
    updateInfo(text: string) {
        fire('UpdateInfo', text)
    }

    /** sets a flag to indicate this score is owned by the current player */
    setOwned(value: boolean) {
        this.owned = value
        if (this.owned) {
            this.owner = currentPlayer
            this.updateScoreElement(this.owner.color, this.possibleValue.toString())
        }
        else {
            this.owner = null
            this.updateScoreElement(black, emptyString)
        }
    }

    /** fires event used to update the score value */
    renderValue(value: number) {
        fire('UpdateScoreElement',
            {
                index: this.index,
                renderAll: false,
                fillColor: (this.owner) ? this.owner.color : black,
                value: value.toString(),
                available: this.available
            }
        )
    }

    /** broadcasts a message used to update the score view element */
    updateScoreElement(color: string, value: string) {
        fire('UpdateScoreElement',
            {
                index: this.index,
                renderAll: true,
                fillColor: color,
                value: value,
                available: this.available
            }
        )
    }

    /** sets a flag that determins if this scoreElement is available   
     *  to be selected by the current player */
    setAvailable(value: boolean) {
        this.available = value
        if (this.available) {
            if (this.possibleValue > 0) {
                this.renderValue(this.possibleValue)
            }
        }
        else {
            if (this.owned) {
                this.renderValue(this.possibleValue)
            } else {
                this.renderValue(this.possibleValue)
            }
        }
    }

    /** the clicked event handler for this scoreElement.    
     *  returns true if the click caused this score to be    
     *  taken by the current player */
    clicked() {
        console.log('score-clicked')
        // if game has not started ... just return
        if (dice.toString() === '[0,0,0,0,0]') return false

        // if it's available
        let scoreTaken = false

        // and it's not taken yet
        if (!this.owned) {
            if (this.possibleValue === 0) {
                currentPlayer.lastScore = `sacrificed ${this.name} ${dice.toString()}`
                this.updateInfo(`${currentPlayer.playerName} ${currentPlayer.lastScore}`)
            } else {
                const wasItYou = currentPlayer.id === thisPlayer.id
                const wasTaken = (wasItYou) ? 'chose' : 'took'
                currentPlayer.lastScore = `${wasTaken} ${this.name} ${dice.toString()}`
                this.updateInfo(`${(wasItYou) ? 'You' : currentPlayer.playerName} ${currentPlayer.lastScore}`)
            }
            if (this.index === Possible.FiveOfaKindIndex) {
                if (dice.isFiveOfaKind) {
                    dice.setfiveOfaKindBonusAllowed(true)
                    PlaySound.Heehee()
                }
                else {
                    dice.setfiveOfaKindWasSacrificed(true)
                    PlaySound.Dohh()
                }
            }
            this.setValue()
            scoreTaken = true

        } // it's been taken
        else if (this.available) {
            currentPlayer.lastScore = `stole ${this.name} ${dice.toString()} was: ${this.scoringDieset.toString()}`;
            this.updateInfo(`${currentPlayer.playerName} ${currentPlayer.lastScore}`)
            this.setOwned(false)
            PlaySound.Heehee()
            this.setValue()
            scoreTaken = true
        }
        return scoreTaken
    }

    /** sets the value of this scoreElement after taken by a player */
    setValue() {
        this.setOwned(true)
        this.finalValue = this.possibleValue
        this.scoringDiesetSum = 0
        // DO NOT use for/of here! needs index
        this.scoringDieset.forEach((_die: number, index: number) => {
            this.scoringDieset[index] = dice.die[index].value
            this.scoringDiesetSum += dice.die[index].value
        })
        if (dice.isFiveOfaKind) {
            if (dice.fiveOfaKindBonusAllowed) {
                dice.setfiveOfaKindCount(dice.fiveOfaKindCount + 1)
                if (this.index !== Possible.FiveOfaKindIndex) {
                    this.finalValue += 100
                }
                this.hasFiveOfaKind = true
                PlaySound.Heehee()
            }
            else {
                this.hasFiveOfaKind = false
                PlaySound.Cluck()
            }
        }
        else {
            this.hasFiveOfaKind = false
            if (this.finalValue === 0) {
                PlaySound.Dohh()
            }
            else {
                PlaySound.Cluck()
            }
        }
    }

    /** evaluates and displays a possible value for this scoreElement */
    setPossible() {
        this.possibleValue = Possible.evaluate(this.index)
        if (!this.owned) {
            if (this.possibleValue === 0) {
                this.renderValue(0)
            }
            else {
                this.renderValue(this.possibleValue)
            }
            this.setAvailable(true)
        }
        else if (currentPlayer !== this.owner) {
            if (this.possibleValue > this.finalValue) {
                if (!this.hasFiveOfaKind) {
                    this.setAvailable(true)
                    this.renderValue(this.possibleValue)
                }
            } else if ( // less than current value
                (this.index === SmallStraight || this.index === LargeStraight) &&
                (this.possibleValue === this.finalValue) &&
                (this.possibleValue > 0) &&
                (this.scoringDiesetSum < dice.sum)) {
                this.setAvailable(true)
                this.renderValue(this.possibleValue)
            } else if (
                (this.index === FullHouse) &&
                (this.possibleValue === this.finalValue) &&
                (this.scoringDiesetSum < dice.sum)
            ) {
                this.setAvailable(true)
                this.renderValue(this.possibleValue)
            }
        }
    }


    /** resets this scoreElement */
    reset() {
        this.setOwned(false)
        this.finalValue = 0
        this.possibleValue = 0
        this.updateScoreElement(black, emptyString)
        this.hasFiveOfaKind = false
    }

    /** clears the possible value for this scoreElement */
    clearPossible() {
        this.possibleValue = 0
        this.setAvailable(false)
        if (!this.owned) {
            this.finalValue = 0
            this.renderValue(0)
        }
        else {
            this.renderValue(this.finalValue)
        }
    }
}

export const SCORE_TEXT = [
    "Ones",
    "Twos",
    "Threes",
    "Fours",
    "Fives",
    "Sixes",
    "Three\nO-Kind",
    "Four\nO-Kind",
    "Small\nStraight",
    "Large\nStraight",
    "Full\nHouse",
    "Five\nO-Kind",
    "Chance",
] as const;
