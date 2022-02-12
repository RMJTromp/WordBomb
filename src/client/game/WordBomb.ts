import Bomb from "./Bomb.js";
import Server from "./Server.js";
import {PlayerData} from "./packets/LoginPacket.js";

class WordBomb {

    public readonly canvas: HTMLCanvasElement;
    public readonly ctx : CanvasRenderingContext2D;
    private readonly bomb = new Bomb(this);
    public server : Server;

    constructor(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        canvas.oncontextmenu = (e) => e.preventDefault();
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bomb.draw();
    }

    get width() : number {
        return this.canvas.width;
    }

    get height() : number {
        return this.canvas.height;
    }

    private startLoop(tick : number = 20) {
        setInterval(() => {
            this.draw();
        }, tick);
    }

    public connect(data : PlayerData) {
        this.server = Server.connect(data);
        this.startLoop();
    }

}

export default WordBomb;