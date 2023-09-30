import { useState, useEffect  } from "preact/hooks";

// app 
import { fire, on } from '../client_deps.ts'

/** Dice-set component */
export default function LeftScores(props:{text: string}) {
    const [text, setText] = useState(props.text);
    
    // set up event callbacks
    useEffect(() => { // behaves like componentDidMount
        
        on('UpdateLeftscore', (data: { color: string, text: string }) => {
            setText(data.text)
        })
        
        // init text on mount
        setText('Left total = 0')
    }, []);
    
    function handleClick(){
        fire('ShowPopup', {title:'You Won', msg: 'You had 256'})
    }
    return (
        <div onClick={handleClick}class="leftScoresLabel ">
                <span>{text}</span>
        </div>
    );
}