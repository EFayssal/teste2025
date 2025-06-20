const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log(`Nouveau joueur : ${socket.id}`);

    if (Object.keys(players).length < 2) {
        players[socket.id] = { y: 200 };
        socket.emit("init", { id: socket.id, players });

        socket.broadcast.emit("newPlayer", { id: socket.id });

        socket.on("move", (pos) => {
            if (players[socket.id]) {
                players[socket.id].y = pos;
                io.emit("players", players);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Déconnecté : ${socket.id}`);
            delete players[socket.id];
            io.emit("removePlayer", socket.id);
        });
    } else {
        socket.emit("full");
    }
});

server.listen(3000, () => console.log("Serveur sur http://localhost:3000"));
