import * as ex from "excalibur";
import { loader } from "./resources";
import { NoiseMap } from "./scenes/NoiseMap";


export default class Main {
    private _engine: ex.Engine;
    private _scenes: Record<string, ex.Scene>;
    private _activeSceneName: string;
    private _activeScene: ex.Scene;

    /**
     * The excalibur engine.
     */
    public get engine(): ex.Engine {
        return this._engine;
    }

    /**
     * All available scenes.
     */
    public get scenes(): Record<string, ex.Scene> {
        return this._scenes || {};
    }

    /**
     * Get the current active scene.
     */
    public get activeScene(): ex.Scene {
        return this._activeScene;
    }

    /**
     * Set the current active scene.
     * @param name The name of the scene to set.
     */
    public setActiveScene(name: string) {
        this._activeSceneName = name;
        this._activeScene = this._scenes[name];
    }

    public init(container?: string) {
        console.debug('Engine:Init');

        this._engine = new ex.Engine({
            canvasElementId: container ?? "game",
            displayMode: ex.DisplayMode.FitContainerAndFill,
            backgroundColor: ex.Color.fromRGB(30, 30, 30)
        });

        this.engine.add("NoiseMap", new NoiseMap());

        // Game events to handle
        this.engine.on('hidden', () => {
            console.log('Engine::Pause');
            this.engine.stop();
        });

        this.engine.on('visible', () => {
            console.log('Engine::Start');
            this.engine.start();
        });

        this.engine.start(loader)
            .then(() => {
                console.log('Engine::Started');
                this.engine.goToScene("NoiseMap");
            });
    }
}
