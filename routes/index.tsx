import { Head } from '$fresh/runtime.ts'

// components
import ViewController from "../islands/ViewController.tsx";
import Canvas from '../islands/Canvas.tsx'

/** Game Component */
export default function DiceGame() {
  return (
    <div>
      <Head>
        <title>Fresh-Dice.</title>
        {/* Suppress browser request for favicon.ico */}
        <link id="favicon" rel="shortcut icon" type="image/x-icon" href="data:image/x-icon;," />
        <link rel="stylesheet" href="./style.css" />
        <link rel="stylesheet" href="./layout.css" />
      </Head>
      <div class="container">
        <ViewController/>
      </div>
      <Canvas/>
    </div>
  );
}
