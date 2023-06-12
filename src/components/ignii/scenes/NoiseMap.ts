import * as ex from 'excalibur';
import { loader, Resources } from '../resources';
import { Player } from "../actors/Player";
import { config } from "../config";
import { MapHighlight } from './MapHighlight';
import { makeRectangle } from 'fractal-noise';
import { createNoise2D } from 'simplex-noise';

export class NoiseMap extends ex.Scene {

    map: ex.TileMap;
    index: number;
    highlight: MapHighlight;

    public onInitialize(engine: ex.Engine) {

        engine.start(loader).then(() => {
            //this._loaded = true
        });

        let player = new Player(20 * config.cellSize, 20 & config.cellSize);
        this.add(player);

        this.highlight = new MapHighlight();
        this.add(this.highlight);

        this.camera.clearAllStrategies();
        this.camera.strategy.radiusAroundActor(player, 50);

        //engine.input.pointers.primary.on("down", this.onClick.bind(this));
        //engine.input.pointers.primary.on("move", this.onMove.bind(this));
    }

    //private onClick(evt: ex.Input.PointerDownEvent): void {
    //    let cell = this.map.getCellByPoint(evt.worldPos.x, evt.worldPos.y);
    //    console.log(cell.index);
    //}
    //
    //private onMove(evt: ex.Input.PointerMoveEvent): void {
    //    let cell = this.map.getCellByPoint(evt.worldPos.x, evt.worldPos.y);
    //    this.index = null;
    //    if (cell != null) {
    //        this.index = cell.index;
    //    }
    //
    //    this.highlight.pos.x = (Math.floor((evt.worldPos.x) / config.cellSize) * config.cellSize) / 2;
    //    this.highlight.pos.y = (Math.floor((evt.worldPos.y) / config.cellSize) * config.cellSize) / 2;
    //}

    public onActivate() {

        //Use just simple box collisions.
        ex.Physics.enabled = true;
        ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Arcade;

        // ----------------------------------

        let options = {
            cellSize: config.cellSize,
            rows: 8,
            cols: 8,
        };

        this.map = new ex.TileMap({
            tileHeight: options.cellSize,
            tileWidth: options.cellSize,
            rows: options.rows,
            columns: options.cols,
        });

        const spriteSheet = ex.SpriteSheet.fromImageSource({
            image: Resources.Tiles,
            grid: {
                rows: 15,
                columns: 8,
                spriteHeight: 16,
                spriteWidth: 16
            },
            spacing: {
                margin: {
                    x: 1,
                    y: 1
                }
            }
        });

        const noiseGrid = makeRectangle(options.rows, options.cols, createNoise2D(), {
            amplitude: 0.5,
            persistence: 0.5,
            frequency: 5,
            octaves: 5,

        });

        for (let i = 0; i < this.map.rows; i++) {
            for (let j = 0; j < this.map.columns; j++) {
                let index = i * this.map.rows + j;

                const n = noiseGrid[i][j];
                let tile = this.map.getTileByIndex(index);
                if (n > 0.5) {
                    tile.addGraphic(spriteSheet.getSprite(3, 1));
                } else if (n < 0.45) {
                    tile.addGraphic(spriteSheet.getSprite(5, 1));
                    tile.solid = true;
                } else {
                    tile.addGraphic(spriteSheet.getSprite(2, 1));
                }
            }
        }

        this.add(this.map);
    }
}
