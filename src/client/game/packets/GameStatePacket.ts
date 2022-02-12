import {AbstractPacket, PlayerData} from "./Packets.js";

interface GameStateData {
    state: "AWAITING"|"RUNNING"|"ENDED",
    players: PlayerData[]
}

class GameStatePacket extends AbstractPacket<GameStateData> {

    constructor(data : GameStateData) {
        super("gamestate", data);
    }

    get state() {
        return this.data.state;
    }

    get players() {
        return this.data.players;
    }

}

export { GameStateData, GameStatePacket };