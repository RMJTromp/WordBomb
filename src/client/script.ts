import WordBomb from "./game/WordBomb.js";
import alert from "./utils/Alert.js";
// @ts-ignore
import { Manager as Mngr } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {GameStateData} from "./game/packets/GameStatePacket.js";
import $ from "./selector.js";
import {StreamData} from "./game/packets/StreamPacket.js";
import {PlayerData} from "./game/packets/LoginPacket.js";

const isIncognito = () => {
    return new Promise((resolve) => {
        const fs = (<any>window).RequestFileSystem || (<any>window).webkitRequestFileSystem;

        if (!fs) resolve(false);
        else fs((<any>window).TEMPORARY, 100, () => resolve(false), () => resolve(true));
    });
}

function randString(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
let avatar = (() => {
    try {
        const avatar = window.localStorage.getItem("avatar");
        if(avatar !== null) {
            const url = new URL(avatar);
            if(url.hostname === "avatars.dicebear.com") return avatar;
        }
    } catch (e) {
        console.error(e);
    }

    return `https://avatars.dicebear.com/api/miniavs/${randString(32)}.svg`;
})();
const avatarImg : HTMLImageElement = $("div.avatar > img");
const regenButton : HTMLButtonElement = $("div.avatar > button");
{
    avatarImg.src = avatar;
    avatarImg.onload = () => {
        setTimeout(() => {
            regenButton.disabled = false;
        }, 500);
    }
    regenButton.onclick = () => {
        regenButton.disabled = true;
        avatar = `https://avatars.dicebear.com/api/miniavs/${randString(32)}.svg`;
        avatarImg.src = avatar;
    }
}

const nameInput : HTMLInputElement = $("div.container > input");
{
    {
        const username = window.localStorage.getItem("username");
        if(username !== null && /^[\w ]{3,16}$/.test(username)) {
            nameInput.value = username;
        }
    }

    nameInput.onkeydown = (e) => {
        if(e.key.length > 1 || e.altKey || e.ctrlKey) return;

        if(!/^[\w ]$/.test(e.key)) {
            e.preventDefault();
        }
    }

    nameInput.onpaste = (e) => {
        const content = e.clipboardData.getData("Text");
        if(!/^[\w ]+$/.test(content)) {
            e.preventDefault();
        }
    }
}

{
    const spectateButton : HTMLButtonElement = $("div.container > div.buttons > button:nth-last-of-type(2)");
    const playButton : HTMLButtonElement = $("div.container > div.buttons > button:nth-last-of-type(1)");

    playButton.onclick = () => {
        playButton.disabled = true;
        spectateButton.disabled = true;
        regenButton.disabled = true;
        nameInput.disabled = true;

        try {
            const username = nameInput.value.replace(/\s{2,}/g, "").trim();
            if(!/^[\w ]{3,16}$/.test(username)) throw new Error("Ongeldige gebruikersnaam opgegeven");

            try {
                localStorage.setItem("avatar", avatar);
                localStorage.setItem("username", username);
            } catch (e) {
                console.error(e);
            }

            const modal : HTMLDivElement = $("div.modal");
            const canvas : HTMLCanvasElement = $("<canvas>");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            window.onresize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            const wordBomb = new WordBomb(canvas);
            wordBomb.connect({
                id: null,
                username,
                avatar,
                mode: "PLAYER"
            });

            wordBomb.server.socket.once("gamestate", (data : GameStateData) => {
                if(data.state === "AWAITING") {
                    modal.remove();

                    const getPlayerCard = (player : PlayerData) => {
                        const item : HTMLLIElement = $("<li>", {id:player.id});
                        const p : HTMLParagraphElement = $("<p>", {text: player.username});
                        if(player.host ?? false) p.append($("<i>", {class: "crown"}));
                        const img = new Image(48, 48);
                        img.src = player.avatar;
                        item.prepend(img, p);
                        list.append(item);

                        return item;
                    }

                    const wrapper : HTMLDivElement = $("<div>", {class: "wrapper"});
                    const container : HTMLDivElement = $("<div>", {class: "container"});
                    const list : HTMLUListElement = $("<ul>", {class:"playerlist"});
                    data.players.forEach(player => list.append(getPlayerCard(player)));
                    container.append(list);
                    wrapper.append(container);
                    document.body.append(wrapper);

                    wordBomb.server.socket.on("stream", (data : StreamData) => {
                        if(data.stream === "JOIN") {
                            list.append(getPlayerCard(data.player));
                        } else if(data.stream === "QUIT") {
                            $(`li#${data.player.id}`)?.remove();
                        }
                    });

                    wordBomb.server.socket.on("playerupdate", (player : PlayerData) => {
                        const playerCard = $(`li#${player.id}`);
                        if(playerCard) {
                            const p : HTMLParagraphElement = $("<p>", {text: player.username});
                            if(player.host ?? false) p.append($("<i>", {class: "crown"}));
                            const img = new Image(48, 48);
                            img.src = player.avatar;

                            playerCard.innerHTML = "";
                            playerCard.prepend(img, p);
                        }
                    });
                }
            });
        } catch (e) {
            playButton.disabled = false;
            spectateButton.disabled = false;
            regenButton.disabled = false;
            nameInput.disabled = false;

            alert(e.message, {
                category: "danger",
                timeout: 5000,
                dismissible: true
            });
        }
    }
}

// const canvas = document.createElement("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// document.body.append(canvas);
//
// window.onresize = () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }
//
// const wordBomb = new WordBomb(canvas);
// wordBomb.startLoop();