import { Engine } from "@babylonjs/core";
import BaseScene from "./scenes/BaseScene";
import GeosphereDemo from "./scenes/GeosphereDemo";
import QuadSphereDemo from "./scenes/QuadSphereDemo";

export default class Main {
    private _engine: Engine;
    private _scenes: Record<string, BaseScene>;
    private _activeSceneName: string;
    private _activeScene: BaseScene;

    /**
     * The babylonjs engine.
     */
    public get engine(): Engine {
        return this._engine;
    }

    /**
     * The engine rendering canvas.
     */
    public get canvas(): HTMLCanvasElement {
        return this._engine.getRenderingCanvas();
    }

    /**
     * All available scenes.
     */
    public get scenes(): Record<string, BaseScene> {
        return this._scenes || {};
    }

    /**
     * Get the current active scene.
     */
    public get activeScene(): BaseScene {
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
        const canvas = document.getElementById(container ?? "game") as HTMLCanvasElement;
        this._engine = new Engine(canvas, true, { stencil: true });
        this._scenes = {};

        const defaultScene = 'Geosphere (2 subdivisions)'
        this._scenes[defaultScene] = new GeosphereDemo(this, { subdivisions: 2 });
        this._scenes['Geosphere (5 subdivisions)'] = new GeosphereDemo(this, { subdivisions: 5 });
        this._scenes['Quad Sphere'] = new QuadSphereDemo(this, { subdivisions: 5 });
        this.setActiveScene(defaultScene);

        // Create a listener to resize the game along with the window
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this._engine.runRenderLoop(() => {
            this._activeScene?.render();
        });
    }
}