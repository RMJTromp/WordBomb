import { AbstractPacket } from "./Packets.js";

interface PlayerData {
    id: string,
    username: string,
    avatar: string,
    mode: "PLAYER"|"SPECTATOR",
    host?: boolean
}

class LoginPacket extends AbstractPacket<PlayerData> {

    constructor(data : PlayerData) {
        super("login", data);
    }

}

export { LoginPacket, PlayerData };