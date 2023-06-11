import { useState, useEffect } from 'preact/hooks';
import Main from "./Main";

const main = new Main();

export default function App() {
    const [scenes, setScenes] = useState([]);

    useEffect(() => {
        main.init("game");
        setScenes(Object.keys(main.scenes));
    }, [setScenes]);

    return (<div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '700px'
    }} className='canvas-flush'>
        <canvas id="game"></canvas>
    </div>);
}