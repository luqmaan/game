//server side networking
var util = require("util"),
    io = require("socket.io"),
    requirejs = require("requirejs"),
    Player = require("./Player").Player;

// requirejs.config({
// 	baseUrl: __dirname,
// 	//in case requirejs fubars
// 	nodeRequire:require
// });

// requirejs(['Player'],
// function (Player){

// });

var socket, players;
//might have to make a new player class
//that /mimics/ store state of player _only_
//without spritejs stuff
//also may need a class to update foreground

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

//each player identified by client id (client being each new player)

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
};

function onNewPlayer(foreground, data) {
    var newPlayer = new Player(foreground, data.sprite.x, data.sprite.y);
    newPlayer.id = this.id;
    //emit a created player to other players
    //use broadcast bc just emit would be unicast
    this.broadcast.emit("new player", {
        id: newPlayer.id,
        x: newPlayer.sprite.x,
        y: newPlayer.sprite.y
    });
    //send existing players to new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {
            id: existingPlayer.id,
            x: existingPlayer.sprite.x,
            y: existingPlayer.sprite.y
        });
    }
    players.push(newPlayer());
    util.log(players.length, existingPlayer.sprite.x);

};

function onMovePlayer(data) {

};


function init() {
    players = [];
    socket = io.listen(8000);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    setEventHandlers();
}

init();