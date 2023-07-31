import { useState, useEffect } from 'preact/hooks';
import init from ".";

export default function App() {
    useEffect(() => {
        init({
            container: "game",
        });
    }, []);

    return (<div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '700px'
    }} className='canvas-flush'>
        <div id="game"></div>
    </div>);
}