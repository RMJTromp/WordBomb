import WordBomb from "./WordBomb.js";
import Point from "../utils/Point.js";

class Bomb extends Point {

    private readonly game : WordBomb;
    private readonly image: HTMLImageElement;

    constructor(wordBomb : WordBomb) {
        super(0, 0);
        this.game = wordBomb;

        this.image = new Image();
        this.image.src = "/assets/img/bomb.png";
    }

    get height() {
        return this.image.height / 6;
    }

    get width() {
        return this.image.width / 6;
    }

    draw() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height / 2 - this.height / 2;
        this.game.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width, this.height);
    }

}

export default Bomb;