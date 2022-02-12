import { AbstractPacket } from "./Packets.js";

class KeepAlivePacket extends AbstractPacket<undefined> {

    constructor() {
        super("keepalive");
    }

}

export default KeepAlivePacket;