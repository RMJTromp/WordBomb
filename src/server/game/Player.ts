import {Socket} from "net";
import {PlayerData} from "../../client/game/packets/Packets.js";
import AbstractPacket from "../../client/game/packets/AbstractPacket.js";
import { AbstractPlayer as ClientAbstractPlayer } from "../../client/game/Player.js";

abstract class AbstractPlayer extends ClientAbstractPlayer {

    public readonly socket : Socket;
    public lastKeepAlive : Date;

    protected constructor(socket :  Socket, data : PlayerData) {
        super(data);
        this.socket = socket;
        this.lastKeepAlive = new Date();

        this.socket.on("keepalive", () => {
            this.lastKeepAlive = new Date();
        });
    }

    public sendPacket(packet : AbstractPacket<any>) {
        if(!(<any>this.socket).connected) return;
        this.socket.emit(packet.id, packet.data);
    }

    public kick(reason? : string) {
        if(!(<any>this.socket).connected) return;
        (<any>this.socket).disconnect(reason);
    }

    set host(value : boolean) {
        this.data.host = value;
    }

}

class Player extends AbstractPlayer {

    constructor(socket: Socket, data: PlayerData) {
        super(socket, data);
    }

}

class Spectator extends AbstractPlayer {

    constructor(socket: Socket, data: PlayerData) {
        super(socket, data);
    }

}

export {AbstractPlayer, Player, Spectator};