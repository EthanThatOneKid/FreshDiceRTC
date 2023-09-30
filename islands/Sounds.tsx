
import { useEffect  } from "preact/hooks";

import * as PlaySound from '../app/sounds.ts'

export let context: AudioContext

export default function Sounds() {

    useEffect(() => {
        const AudioContext = window.AudioContext
        context = new AudioContext();
        PlaySound.init(context)    
    }, [])

    return ( <audio></audio> );
}
