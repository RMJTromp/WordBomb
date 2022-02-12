import {Socket} from "net";
import {AbstractPacket, LoginPacket, PlayerData} from "./packets/Packets.js";
import { Manager } from "socket.io-client";
// @ts-ignore
import { Manager as Mngr } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import alert from "../utils/Alert.js";
import KeepAlivePacket from "./packets/KeepAlivePacket.js";
import EventEmitter from "../utils/EventEmitter.js";

class Server extends EventEmitter {

    public readonly socket: Socket;

    public static connect(data : PlayerData) {
        return new Server(data);
    }

    private constructor(data : PlayerData) {
        super();
        const manager : Manager = (<any> new Mngr(new URL(window.location.href).origin));
        this.socket = <any> manager.socket("/");

        data.id = (<any>this.socket).id;
        this.sendPacket(new LoginPacket(data));

        {
            // keep alive
            let lastKeepAlive = new Date();
            this.socket.on("keepalive", () => {
                lastKeepAlive = new Date();
            });

            let interval = setInterval(() => {
                this.sendPacket(new KeepAlivePacket());

                if(Date.now() - lastKeepAlive.getTime() >= 30 * 1000) {
                    alert("Timed out. Heeft geen keepalive pakket van de server ontvangen in de laatste 30 seconden.", {
                        dismissible: true,
                        timeout: 5000,
                        category: "danger"
                    });
                    clearInterval(interval);
                    this.leave();
                }
            }, 5000);
        }
    }

    sendPacket(packet : AbstractPacket<any>) {
        this.socket.emit(packet.id, packet.data);
    }

    leave() {
        (<any>this.socket).disconnect();
    }

}

export default Server;