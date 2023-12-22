
import { useState, useEffect  } from "preact/hooks";

// app
import { on, fire } from '../client_deps.ts'
import * as signaler from '../client_deps.ts'
import { DiceGame } from '../app/diceGame.ts'
import { setCurrentPlayer, currentPlayer, thisPlayer } from '../app/players.ts'
import { btnState } from '../app/rollButton.ts'
import Sounds from '../islands/Sounds.tsx'

// components
import Scores from "./Scores.tsx";
import Die from "./Die.tsx";
import Popup from './Popup.tsx';
import InfoLabel from './InfoLabel.tsx'
import Player from './Player.tsx'

const t = Date.now().toString()
export const myID = 'P-' + t.substring(t.length-3)

// show any popup messages from peers
signaler.onEvent('ShowPopup', (data: {title:string, msg:string}) => {
    fire('ShowPopup', data)
})

signaler.onEvent('UpdateUI', (content: string) => {
    console.info('UpdateUI: ', content);
});

//******** This is where it all starts *********//
DiceGame.init()                                 //
//**********************************************//

thisPlayer.id = myID    
thisPlayer.playerName = myID  
setCurrentPlayer(thisPlayer)
  
/** View Controller Component */
export default function ViewController() {
    const [values, setValues] = useState([0, 0, 0, 0, 0]);
    const [frozen, setFrozen] = useState([false, false, false, false, false]);
    const [btnText, setBtnText] = useState(btnState.text)
    const [disabled, setDisabled] = useState(btnState.disabled)
    
    // This behaves like componentDidMount
    useEffect(() => {
        
        // initialize signal service communications
        signaler.initialize(myID, myID)
        
        //
        // we'll register the following event callback once, on mount
        //
        
        on('ScoreElementResetTurn', () => {
            setFrozen([false, false, false, false, false]);
            setValues([0, 0, 0, 0, 0]);
            setDisabled(false)
        });
        
        on('UpdateRollButton', (data: { 
            text: string, 
            color: string, 
            disabled: boolean 
        }) => {
            setBtnText(data.text)
            setDisabled(data.disabled)
        })
        
        // this will register this user locally and with any peer
        fire('SetID', {id: myID, name: myID})
 
        // initial `DidMount` refresh
        setFrozen([false, false, false, false, false])
    }, []);


    const buttonClr = {
        backgroundColor: currentPlayer.color,
    };

    // Roll Button clicked event handler 
    const handleClicked = (e: MouseEvent) => {
        // only if it's our turn
        if (thisPlayer.id === currentPlayer.id) {
            fire('RollButtonTouched', {})
        }
    };

    return (
        <div>
            <div class="rollContainer">
                <Player index={0} color={'brown'} text={''}/>
                <button
                    style={buttonClr}
                    class="rollButtonStyle rollBtnPosition"
                    onClick={handleClicked}
                    disabled={disabled}
                >
                    {btnText}
                </button>
                <Player index={1} color={'green'} text={''}/>
            </div>
            <div class='diceContainer dice'>
                {values.map(function (value, index) {
                    return <Die index={index} value={value} frozen={frozen[0]} />
                })}
            </div>
            <Scores />
            <Popup/>
            <InfoLabel text={'test'} />
            <Sounds/>
        </div>
    );
}
