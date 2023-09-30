

import * as dice from './dice.ts'
import * as PlaySound from './sounds.ts'

// Binary masks used to evaluate die sequences
const smallLow = 15 // binary mask that represents a lower valued small-straight (1234)
const smallMid = 30 // binary mask that represents a mid valued small-straight (2345)
const smallHigh = 60 // binary mask that represents a high valued small-straight (3456)
const largeLow = 31 // binary mask that represents a low valued large-straight (12345)
const largeHigh = 62 // binary mask that represents a high valued large-straight (23456)
const binaryFaceValue = [0, 1, 2, 4, 8, 16, 32] // (0=0, 1=1, 2=2, 3=4, 4=8, 5=16, 6=32)

//
// Dice Evaluator module ...
// Evaluates a set of 5 die for the existence of simple 'poker' sets / values. 

// ML
// A Decision Tree is a predictive approach in ML to 
// determine what class an object belongs to. 
// As the name suggests, a decision tree is a tree-like 
// flow chart where the class of an object is determined 
// step-by-step using certain known conditions. 
//

/** an array that represents the count of the   
 *  ocuurance of each possible value of die faces */
let countOfDieFaceValue: number[] = [0, 0, 0, 0, 0, 0, 0]

/** holds the sum of all five die face values */
export let sumOfAllDie = 0

/** holds a value that represents the current   
 *  sum of all die-face binary values   
 *  where the face value(spots) 5 = binary value 16   
 *  1=1, 2=2, 3=4, 4=8, 5=16, 6=32   
 *  (used to detect possible poker-straights) */
let straightsMask = 0

// flags ... when set true, indicate a poker value has been detected
export let hasPair = false
export let hasTwoPair = false
export let hasTrips = false
export let hasQuads = false
export let hasFiveOfaKind = false
export let hasTripsOrBetter = false
export let hasFullHouse = false
export let hasSmallStr = false
export let hasLargeStr = false


/** Called from Dice.Roll()    
 *  Evaluates the values of the die-set,   
 *  records the 'count' of Face Values of the 5 die.       
 *  sets dice.isFiveOfaKind if FiveOkind is detected */
export const evaluateDieValues = () => {
    countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0]
    sumOfAllDie = 0 // set in the loop below
    // get the value of each die and increment the
    // counter that represents that value
    const dieSet = dice.die
    for (let i = 0; i < 5; i++) {
        // get the value of this die
        const val = dieSet[i].value
        // add this value to the sum
        sumOfAllDie += val
        if (val > 0) {
            // increment the counter where (array index = value)
            countOfDieFaceValue[val] += 1
        }
    }
    // now, we set our binary-mask based on the current die values
    setTheStraightsMask()
    // set all scoring flags based on the current values of the die-set
    setScoringFlags()
    // if all five die have the same value, set a flag on the dice object 
    dice.setIsFiveOfaKind(testForFiveOfaKind())
}

/** Sets all scoring flags based on the current values of the die-set. */
const setScoringFlags = () => {

    // first we reset all flags
    hasPair = false
    hasTwoPair = false
    hasTrips = false
    hasQuads = false
    hasFiveOfaKind = false
    hasTripsOrBetter = false
    hasFullHouse = false
    hasSmallStr = false
    hasLargeStr = false

    for (let i = 0; i < 7; i++) {
        if (countOfDieFaceValue[i] === 5) {
            hasFiveOfaKind = true
            hasTripsOrBetter = true
        }
        if (countOfDieFaceValue[i] === 4) {
            hasQuads = true
            hasTripsOrBetter = true
        }
        if (countOfDieFaceValue[i] === 3) {
            hasTrips = true
            hasTripsOrBetter = true
        }
        if (countOfDieFaceValue[i] === 2) {
            if (hasPair) {
                hasTwoPair = true
            }
            hasPair = true
        }
    }

    // after evaluating sets of numbers, we use logical AND (&&)   
    // on flags for both 3-O-kind and a pair (a poker full-house)
    hasFullHouse = (hasTrips && hasPair)

    // set a shortened reference to our mask      
    const mask = straightsMask

    // Now, we use binary AND (&) to detect value sequences.   
    // We 'and' the dice binary value with a known binary mask, 
    // and then compare the resulting value to that masks value.

    // first, any large straights?
    hasLargeStr = ((mask & largeLow) === largeLow ||
        (mask & largeHigh) === largeHigh)

    // again, binary masking to discover any small straights    
    hasSmallStr = ((mask & smallLow) === smallLow ||
        (mask & smallMid) === smallMid ||
        (mask & smallHigh) === smallHigh)
}

/** Tests if all 5 die values are the same. */
const testForFiveOfaKind = () => {
    // did we see 5 of the same?
    if (hasFiveOfaKind) {
        // has fiveOkind been sacrificed by any user?
        if (dice.fiveOfaKindWasSacrificed) {
            // Homer Simpsons says 'Dohh'
            PlaySound.Dohh()
        }
        else {
            // Homer Simpsons says 'Woo Hoo'
            PlaySound.Woohoo()
        }
        return true
    }
    return false
}

/** Sets a binary mask for evaluating for straights sequences. */
const setTheStraightsMask = () => {
    // get the current die values
    const die = dice.die
    // reset our mask
    straightsMask = 0
    // for each posible die value ( 1 thru 6 )   
    // if any of the 5 die has this value, 
    // add the binary-weight of this value to our mask
    for (let thisValue = 1; thisValue <= 6; thisValue++) {
        if (die[0].value === thisValue ||
            die[1].value === thisValue ||
            die[2].value === thisValue ||
            die[3].value === thisValue ||
            die[4].value === thisValue) {
            straightsMask += binaryFaceValue[thisValue]
        }
    }
}
