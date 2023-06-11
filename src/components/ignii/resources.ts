import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { config } from "./config";

let Resources = {
    Tiles: new ImageSource('./assets/ignii/basictiles.png')
}

let Sprites = {
    Ground1: SpriteSheet.fromImageSource({
        image: Resources.Tiles,
        grid: {
            rows: 15,
            columns: 8,
            spriteWidth: config.cellSize,
            spriteHeight: config.cellSize
        }
    })
};

let loader = new Loader([
    Resources.Tiles
]);

export {
    Resources,
    loader,
    Sprites
}
