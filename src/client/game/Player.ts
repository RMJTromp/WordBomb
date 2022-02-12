import {PlayerData} from "./packets/Packets.js";

abstract class AbstractPlayer {

    protected data : PlayerData;

    protected constructor(data : PlayerData) {
        this.data = data;
    }

    get playerData() : PlayerData {
        return this.data;
    }

    get id() {
        return this.data.id;
    }

    get username() {
        return this.data.username;
    }

    get avatar() {
        return this.data.avatar;
    }

    get mode() {
        return this.data.mode;
    }

    get host() {
        return this.data.host ?? false;
    }

}

class Player extends AbstractPlayer {

    constructor(data: PlayerData) {
        super(data);
    }

}

class Spectator extends AbstractPlayer {

    constructor(data: PlayerData) {
        super(data);
    }

}

export {AbstractPlayer, Player, Spectator};