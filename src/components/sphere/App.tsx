import { useState, useEffect } from 'preact/hooks';
import Main from "./Main";

const main = new Main();

export default function App() {
    const [scenes, setScenes] = useState([]);

    useEffect(() => {
        main.init("game");
        setScenes(Object.keys(main.scenes));
    }, [setScenes]);

    return (<>
        <canvas id="game" className="canvas-flush"></canvas>
        <ul>
            {scenes.map((s) =>
                <li key={s}>
                    <a onClick={e => main.setActiveScene(s)} style={{ cursor: 'pointer' }}>{s}</a>
                </li>
            )}
        </ul>
    </>);
}