import { useState, useEffect  } from "preact/hooks";
// app
import { on } from "../client_deps.ts"

type PopupProps = {
    title: string,
    msg: string,
}

export default function Popup() {
    const [show, setShow] = useState(false)
    const [msg, setMsg] = useState('Message')
    const [title, setTitle] = useState('Title')


    // set up event callbacks
    useEffect(() => { // behaves like componentDidMount
        // register this handler once on mount
        on('ShowPopup', (data: PopupProps) => {
            setTitle(data.title)
            setMsg(data.msg)
            setShow(true)
        })
        // data = winMsg + ' ' + winner.score
        on('PopupResetGame', (data: PopupProps) => {
            setTitle(data.title)
            setMsg(data.msg)
            setShow(true)
        })

    }, []);

    return (
        <div>
            <div style={{ display: show ? "block" : "none" }} class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <span onClick={() => {
                            console.log('clicked')
                            setShow(false)
                        }} class="close">&times;</span>
                        <h2>{title}</h2>
                    </div>
                    <div class="modal-body">
                        <pre>{msg}</pre>
                    </div>
                    <div class="modal-footer">
                        <h3>Press the close button to continue!  </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
