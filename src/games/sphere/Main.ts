import { Engine } from "@babylonjs/core";
import BaseScene from "./scenes/BaseScene";
import First from "./scenes/First";

export default class Main {
    private _engine: Engine;
    private _scenes: BaseScene[];
    private _activeSceneIndex: number;

    public get engine(): Engine {
        return this._engine;
    }

    public get canvas(): HTMLCanvasElement {
        return this._engine.getRenderingCanvas();
    }

    public get scenes(): BaseScene[] {
        return this._scenes;
    }

    public get activeScene(): BaseScene {
        if (this._activeSceneIndex != null) {
            return this._scenes[this._activeSceneIndex];
        }
        return null;
    }

    constructor(container?: string) {
        const canvas = document.getElementById(container ?? "game") as HTMLCanvasElement;
        this._engine = new Engine(canvas, true, { stencil: true });
        this._scenes = [];

        // Create a listener to resize the game along with the window
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

      //  this._initEngine(container ?? "container");
        this._scenes = [];
        this._scenes.push(new First(this));
        this._activeSceneIndex = 0;

        this._engine.runRenderLoop(() => {
            this.activeScene?.render();
        });
    }

    _initEngine(container: string) {
        // Grab the canvas and initialize the engine
        const canvas = document.getElementById(container) as HTMLCanvasElement;
        this._engine = new Engine(canvas, true, { stencil: true });
        this._scenes = [];

        // Create a listener to resize the game along with the window
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}