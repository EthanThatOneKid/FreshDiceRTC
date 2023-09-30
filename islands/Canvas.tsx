import { useRef, useEffect  } from "preact/hooks";
import { initCanvas } from '../app/dieFactory.ts'

export default function Canvas() {
    const canvasElement = useRef(null);
    
    useEffect(() => { // behaves like componentDidMount
        if (canvasElement.current) { // required to silence type checker
            initCanvas(canvasElement.current as HTMLCanvasElement)
        }
    },[]);  
    
    return <canvas ref={canvasElement}
        height={72}
        width={72}
    />;
}

