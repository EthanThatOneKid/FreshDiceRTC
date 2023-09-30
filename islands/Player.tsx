import { useState, useEffect  } from "preact/hooks";

// context
import { on } from "../client_deps.ts"

type PlayerProps = {
    index: number,
    color: string,
    text: string,
}

/** Die Component */
export default function Player(props: PlayerProps) {
    const [text, setText] = useState(props.text)
    let color = props.color
    
    // set up event callbacks
    useEffect(() => { // behaves like componentDidMount
        // register this handler once on mount
        on('UpdatePlayer', (data: PlayerProps) => {
            if (data.index === props.index)
           setText(data.text)
           color = data.color
        })
    }, []);
    const thisStyle = 'color:' + color
    return <div class={'player'+ props.index} style={thisStyle}>{text}</div>;
}