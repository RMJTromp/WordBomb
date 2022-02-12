import Point from "./Point.js";

interface MousePoint {
    readonly x: number
    readonly y: number
}

const point = new Point(0, 0);
window.onmousemove = (e) => {
    point.x = e.x;
    point.y = e.y;
}

const Mouse = new Proxy<MousePoint>(point, {
    set(target: Point, prop: string | symbol, value: any, receiver: any): boolean {
        throw new Error("Can not modify immutable objects");
    }
});

export default Mouse;