import {AbstractPacket, PlayerData} from "./Packets.js";

interface StreamData {
    stream: "JOIN"|"QUIT",
    player: PlayerData
}

class StreamPacket extends AbstractPacket<StreamData> {

    constructor(data : StreamData) {
        super("stream", data);
    }

    get stream() {
        return this.data.stream;
    }

    get player() {
        return this.data.player;
    }

}

export {StreamData, StreamPacket};