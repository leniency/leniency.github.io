
// namespace jjinn {

//     export interface BoardDefinition {
//         cells: BoardCellDefinition[];
//         tileSheets: BoardTileSheet[];
//         width: number;
//         height: number;
//         tileWidth: number;
//         tileHeight: number;
//     }

//     export interface BoardCellDefinition {
//         x: number;
//         y: number;
//         tileId: number;
//         sheetId: number;
//     }

//     export interface BoardTileSheet {
//         id: number;
//         path: string;
//         columns: number;
//         rows: number;
//     }

//     export class Board extends ex.Scene {

//         public def: BoardDefinition;
//         private _tileMap: ex.TileMap;
//         private _player: Player;

//         constructor(engine: ex.Engine) {
//             super(engine);

//             let noise = new ex.PerlinGenerator({
//                 seed: 516,
//                 octaves: 5,
//                 frequency: 50,
//                 amplitude: 0.5,
//                 persistance: 0.5
//             });

//             let g = noise.grid(16, 16);


//             let texture = new ex.Texture('assets/basictiles.png');
//             let loader = new ex.Loader([texture]);

//             let ss = new ex.SpriteSheet({
//                 image: texture,
//                 rows: 16,
//                 columns: 8,
//                 spWidth: 16,
//                 spHeight: 16
//             });

//             this._tileMap = new ex.TileMap({
//                 x: -100,
//                 y: -100,
//                 cellWidth: 16,
//                 cellHeight: 16,
//                 cols: 40,
//                 rows: 40
//             });

//             var tilesprite = new ex.TileSprite('root', 0);
//             this._tileMap.registerSpriteSheet('root', ss);

//             for (var i = 0; i < this._tileMap.rows * this._tileMap.cols; i++) {
//                 this._tileMap.getCellByIndex(i).pushSprite(tilesprite);
//             }
//             this.addTileMap(this._tileMap);

//             this._player = new Player();
//             this.add(this._player);

//             this.on("predraw", (e: ex.PreDrawEvent) => {

//             });

//             this.on("initialize", this.initialize);
//             this.on("activate", this.activate);
//         }

//         initialize(e: ex.InitializeEvent): void {
//             console.log("board initialize");

//         }

//         /**
//          * Called each time the scene is entered from Engine.goToScene
//          */
//         public activate(e: ex.ActivateEvent) {
//             console.log("board activate");

//         }
//     }
// }