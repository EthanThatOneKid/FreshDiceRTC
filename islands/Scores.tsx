// context
import { SCORE_TEXT } from '../app/scoreElement.ts'

// components
import ScoreButton from "./ScoreButton.tsx";
import LeftScores from './LeftScores.tsx'

/** Dice-set component */
export default function Scores() {
    return (
        <div class="scoreContainer">
            {SCORE_TEXT.map(function(text, index){
                    return <ScoreButton index={index} value={0}
                    text={text} color={'black'} textColor={'DodgerBlue'} ></ScoreButton>
            })}
            <LeftScores text={'test'}/>
        </div>
    );
}