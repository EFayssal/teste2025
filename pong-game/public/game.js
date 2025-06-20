const socket = io();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let playerId = null;
let players = {};

socket.on("init", (data) => {
    playerId = data.id;
    players = data.players;
});

socket.on("newPlayer", (data) => {
    players[data.id] = { y: 200 };
});

socket.on("removePlayer", (id) => {
    delete players[id];
});

socket.on("players", (serverPlayers) => {
    players = serverPlayers;
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    socket.emit("move", y);
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";

    Object.keys(players).forEach((id, index) => {
        const x = index === 0 ? 20 : canvas.width - 30;
        ctx.fillRect(x, players[id].y, 10, 80);
    });

    requestAnimationFrame(draw);
}

socket.on("full", () => {
    alert("Salle pleine (2 joueurs max)");
});

draw();
