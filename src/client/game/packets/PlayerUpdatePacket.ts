import {AbstractPacket, PlayerData} from "./Packets.js";

export default class PlayerUpdatePacket extends AbstractPacket<PlayerData> {

    constructor(data : PlayerData) {
        super("playerupdate", data);
    }

}