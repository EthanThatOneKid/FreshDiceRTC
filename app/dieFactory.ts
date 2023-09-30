/// <reference lib="dom" />
/// <reference lib="deno.unstable" />

export const faces: ImageData[] = []
export const frozenFaces: ImageData[] = []

export let ctx: CanvasRenderingContext2D
export let canvas: HTMLCanvasElement

export const initCanvas = (thisCanvas: HTMLCanvasElement) => {
    canvas = thisCanvas
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    buildDieFaces(72, 'snow')
}

let size = 0
// deno-lint-ignore prefer-const
let x = 0
// deno-lint-ignore prefer-const
let y = 0

export const buildDieFaces = ( dieSize: number,  color: string ) => {
    size = dieSize
    ctx.canvas.width = size
    ctx.canvas.height = size
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 7; i++) {
        faces.push (drawDie(false, i, color))
        frozenFaces.push(drawDie(true, i, color))
    }
}

/** A die-face factory that renders dice face images */
export const drawDie = (
    frozen: boolean,
    value: number,
    color: string
): ImageData => {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    ctx.save()
    if (frozen) {
        ctx.strokeStyle = 'silver'
        ctx.fillStyle = 'WhiteSmoke'
    }
    else {
        ctx.strokeStyle = 'black'
        ctx.fillStyle = 'white'
    }
    drawFace()
    drawGlare()
    ctx.fillStyle = (frozen) ? 'silver' : 'black'
    drawDots(value)
    ctx.restore()    
    return ctx.getImageData(x, y, size, size)
}

const drawFace = () => {
    const radius = size / 6
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + size, y, x + size, y + size, radius)
    ctx.arcTo(x + size, y + size, x, y + size, radius)
    ctx.arcTo(x, y + size, x, y, radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.lineWidth = 1
}

const drawGlare = () => {
    const offset = 5
    const bottomLeftX = x + offset
    const bottomLeftY = y + (size - offset)
    const bottomRightX = x + (size - offset)
    const bottomRightY = y + (size - offset)
    const quarter = size * 0.25
    const threeQuarter = quarter * 3
    ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'
    ctx.beginPath()
    ctx.moveTo(bottomLeftX, bottomLeftY)
    ctx.lineTo(bottomRightX, bottomRightY)
    ctx.bezierCurveTo(
        x + quarter, y + threeQuarter,
        x + quarter, y + threeQuarter,
        x + offset, y + offset
    )
    ctx.closePath()
    ctx.fill()
    ctx.save()
}

const drawDots = (dieValue: number) => {
    const quarter = size / 4
    const center = quarter * 2
    const middle = quarter * 2
    const left = quarter
    const top = quarter
    const right = quarter * 3
    const bottom = quarter * 3
    const dotSize = size / 12
    if (dieValue === 1) {
        drawDot(middle, center, dotSize)
    }
    else if (dieValue === 2) {
        drawDot(top, left, dotSize)
        drawDot(bottom, right, dotSize)
    }
    else if (dieValue === 3) {
        drawDot(top, left, dotSize)
        drawDot(middle, center, dotSize)
        drawDot(bottom, right, dotSize)
    }
    else if (dieValue === 4) {
        drawDot(top, left, dotSize)
        drawDot(top, right, dotSize)
        drawDot(bottom, left, dotSize)
        drawDot(bottom, right, dotSize)
    }
    else if (dieValue === 5) {
        drawDot(top, left, dotSize)
        drawDot(top, right, dotSize)
        drawDot(middle, center, dotSize)
        drawDot(bottom, left, dotSize)
        drawDot(bottom, right, dotSize)
    }
    else if (dieValue === 6) {
        drawDot(top, left, dotSize)
        drawDot(top, right, dotSize)
        drawDot(middle, left, dotSize)
        drawDot(middle, right, dotSize)
        drawDot(bottom, left, dotSize)
        drawDot(bottom, right, dotSize)
    }
}

const TwoPi = Math.PI * 2
const drawDot = (
    top: number,
    left: number,
    dotSize: number
) => {
    ctx.beginPath()
    ctx.arc(x + left, y + top, dotSize, 0, TwoPi, true)
    ctx.closePath()
    ctx.fill()
}
