import { useState, useEffect  } from "preact/hooks";
// app
import { fire, on } from '../client_deps.ts'
import { currentPlayer, thisPlayer } from '../app/players.ts'

type ScoreButtonProps = {
    index: number,
    value: number,
    text: string,
    color: string,
    textColor: string,
}

/** Score Button Component */
export default function ScoreButton(props: ScoreButtonProps) {
    const [reset, Reset] = useState(true);
    const [value, setValue] = useState(props.value)
    const [fillColor, setFillColor] = useState(props.color)
    const [textColor, setTextColor] = useState(props.textColor)

    // This behaves like componentDidMount
    useEffect(() => {

        // register this handler once on mount
        on('ResetGame', () => {
            Reset(!reset) // toggle to force update
        })

        on('UpdateScoreElement', (data: {
            index: number,
            renderAll: boolean, // fillColor + value
            fillColor: string,
            value: string,
            available: boolean // true if can be taken
        }) => {
            // renderAll true means update all - false means just the value
            if (data.index === props.index) {
                if (data.available) {
                    setTextColor('DodgerBlue')
                    setValue(parseInt(data.value))
                } else {
                    setTextColor('white')
                    setFillColor(data.fillColor)
                    setValue(parseInt(data.value))
                }
            }
        })

        // add this view on Mount
        fire('ViewWasAdded', ({ type: 'ScoreButton', index: props.index, name: props.text }))
    }, []);

    function handleClick(e: MouseEvent) {
        // only if it's our turn
        if (thisPlayer.id === currentPlayer.id) {
            fire('ScoreButtonTouched', props.index)
        }
    }
    function handleHover(e: MouseEvent) {
        fire('UpdateTooltip', {index: props.index, hovered: false })
    }
    function handleMouseLeave(e: MouseEvent) {
        fire('UpdateTooltip', {index: props.index, hovered: false })
    }
    const ScoreColor = { color: textColor }
    const background = { backgroundColor: fillColor }
    const classNames = `scoreButton score-${props.index}`

    return (
        <button class={classNames}
            style={background}
            onClick={handleClick}
            onMouseOver={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <span>{props.text}</span><br />
            <span class='scoreValue' style={ScoreColor} >{(value > 0) ? value : ' '}</span>
        </button>
    )
}
