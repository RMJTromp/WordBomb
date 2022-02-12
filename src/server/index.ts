import 'dotenv/config';
import express from "express";
import { Server } from "socket.io";
import {AbstractPlayer, Player, Spectator} from "./game/Player.js";
import {PlayerData, KeepAlivePacket, StreamPacket, GameStatePacket, PlayerUpdatePacket} from "../client/game/packets/Packets.js";
import AbstractPacket from "../client/game/packets/AbstractPacket.js";

const app = express();

app.use(express.static('src/client'));

const server = app.listen(process.env.PORT || 3000, () => {
    let host = (<any>server.address()).address;
    if(host === "::" || host.length < 1) host = "localhost";
    const port = (<any>server.address()).port;

    console.log(`WordBomb app running on http://${host}${port != 80 ? `:${port}` : ``}/`);
});


const io = new Server(server);

const players : AbstractPlayer[] = [];

setInterval(() => {
    players.forEach(player => {
        player.sendPacket(new KeepAlivePacket());

        if(Date.now() - player.lastKeepAlive.getTime() >= 30 * 1000) {
            player.kick("Timed out. Server heeft geen keepalive pakket ontvangen in de laatste 30 seconden.");
        }
    });
}, 5 * 1000);

const broadcastPacket = (packet : AbstractPacket<any>) => {
    players.forEach(player => player.sendPacket(packet));
};

io.sockets.on("connection", async socket => {
    try {
        const player = await new Promise<AbstractPlayer>((resolve, reject) => {
            socket.once("login", (data : PlayerData) => {
                data.id = socket.id;
                resolve(data.mode === "PLAYER" ? new Player(<any>socket, data) : new Spectator(<any> socket, data));
            });

            setTimeout(() => reject("Failed to login before deadline"), 10 * 1000);
        });

        if(players.length === 0) player.host = true;

        // broadcast that the player joined
        broadcastPacket(new StreamPacket({
            player: player.playerData,
            stream: "JOIN"
        }));
        players.push(player); // add to list AFTER

        // send player current gamestate
        player.sendPacket(new GameStatePacket({
            state: "AWAITING",
            players: players.map(p => p.playerData)
        }))

        socket.on("disconnect", () => {
            // remove player from list
            players.splice(players.indexOf(player), 1);

            // broadcast that the player left
            broadcastPacket(new StreamPacket({
                player: player.playerData,
                stream: "QUIT"
            }));

            if(players.length > 0) {
                const newHost = players[0];
                newHost.host = true;
                broadcastPacket(new PlayerUpdatePacket(newHost.playerData));
            }
        });
    } catch (e) {
        socket.disconnect();
    }
});