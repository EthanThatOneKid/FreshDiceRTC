import { useState, useEffect  } from "preact/hooks";

// context
import { on } from "../client_deps.ts"


type LabelProps = { text: string }

/** Die Component */
export default function InfoLabel(props: LabelProps) {
    const [text, setText] = useState(props.text)
    
    // set up event callbacks
    useEffect(() => { // behaves like componentDidMount
        // register this handler once on mount
        on('UpdateInfo', (thisText: string) => {
           setText(thisText)
        })

    }, []);
    return <div class={'info'}>{text}</div>;
}