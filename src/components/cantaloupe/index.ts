import * as m from 'melonjs';

class PlayScreen extends m.Stage {



    /**
     * Action to perform on state change
     */
    onResetEvent(): void {
        const light = new m.Light2d(
            m.game.viewport.width / 2,
            m.game.viewport.height / 2,
            150, 150, '#fff', 0.3
        );
        light.blendMode = "overlay";

        // darker ambient light
        this.ambientLight.parseCSS("#1117");

        // spot light
        this.lights.set("whiteLight", light);



        // clear the background
        m.game.world.addChild(new m.ColorLayer("background", "#333333", 0), 0);

        // Add some text saying "Hi!"
        m.game.world.addChild(new m.Text(50, 50, {
            font: "Arial",
            size: 16,
            fillStyle: "#FFFFFF",
            textBaseline: "middle",
            textAlign: "center",
            text: "Hello World !"
        }));

        m.input.registerPointerEvent(
            'pointermove',
            m.game.viewport,
            e => {
                light.centerOn(e.gameX, e.gameY);
            });
    }

    update(dt: number): boolean {


        return true;
    }
}


export interface GameOptions {
    container: string;
}

export default function init(options: GameOptions) {
    m.device.onReady(() => {
        if (!m.video.init(800, 600, {
            parent: options.container,
            scaleMethod: "flex",
            renderer: m.video.WEBGL
        })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        m.state.set(m.state.PLAY, new PlayScreen());
        m.state.change(m.state.PLAY, true);
    });
}