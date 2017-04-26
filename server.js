//Create a new Express application
const express = require("express");
const app = express();

//Connect to the MySQL Database
//const mysql = require('mysql');
//const connection = mysql.createConnection({
//  host: 'localhost',
//  user: 'root',
//  password: 'legacy',
//  database: 'game'
//});

//connection.connect();

//connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//  if (error) throw error;
//  console.log('The solution is: ', results[0].solution);
//});

//connection.end();

//Create an HTTP server with Node's HTTP module
//and pass it the Express application
const server = require('http').Server(app);

//Listen on port 8000, and announce it in the server terminal)
server.listen(8000, function(){
    console.log('listening on *:8000');
});

// Instantiate Socket.io and have it listen on the Express/HTTP server
const io = require('socket.io')(server);

//Push access to all files within the "public" directory
app.use(express.static('public'));

//Respond to "/" requests with this directory's html page
app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

//Game Classes
global.Bestiary = require("./server/classes/Bestiary"); //For fast reference
const classBattleManager = require("./server/classes/BattleManager");


//Monitor players looking for an opponent to battle
var lobby = {
    totalPlayers: 0, //How many players are playing the game
    players: [], //The players currently searching for a battle
    
    /**
     * Adds a player to the lobby
     * @PARAM {string} playerId - The player's unique ID
     */
    addPlayerId: function(playerId){
        this.players.push(playerId);
    },
    
    /**
     * Remove a player from the lobby
     * @PARAM {string} playerId - The player's unique ID
     */
    removePlayerId: function(playerId){
        if(this.players.indexOf(playerId) >= 0){
            this.players.splice(this.players.indexOf(playerId), 1);
        }
    },
    
    /**
     * Remove and return the first indexed player from the lobby
     * @return {string} - The player's unique ID
     */
    removeFirstPlayerId: function(){
        return this.players.shift();
    },
};

//A reference to all currently active battles
var matches = [];

/**
 * Get the total number of players in a specific game room
 * @PARAM {string} roomId - The room's unique ID
 * @return {int} - The number of players in the room
 */
function totalPlayersInRoom(roomId){
    return io.sockets.adapter.rooms[roomId].length;
}


io.on('connection', function(socket){
    console.log("User connected. Socket ID: " + socket.id);
    lobby.totalPlayers += 1;
    
    //Send latest form/ability data to client
    io.to(socket.id).emit("monster data", global.Bestiary.exportForms());
    
    //When a player begins searching for a match, if someone is 
    //already searching, pair them. Otherwise, add them to the lobby
    socket.on('looking for opponent', function(){
        if(lobby.players.length > 0){
            let opponentId = lobby.removeFirstPlayerId();
            let gameId = socket.id + opponentId;
            io.to(socket.id).to(opponentId).emit("opponent found", gameId);
        } else {
            lobby.addPlayerId(socket.id);
        }
    });
    
    socket.on("join room", function(player){
        let gameId = player.gameId;
        socket.join(gameId);
        
        //TODO: Set timeout for re-attempting matchmaking, if one connection takes too long
        
        let playersInRoom = totalPlayersInRoom(gameId);
        
        if(playersInRoom === 1){
            matches[gameId] = {
                playerAlpha: player,
                playerOmega: null,
                battleManager: null,
            };
            matches[gameId].playerAlpha.socketId = socket.id;
        } else if(playersInRoom === 2){
            matches[gameId].playerOmega = player;
            matches[gameId].playerOmega.socketId = socket.id;
            
            matches[gameId].battleManager = new classBattleManager(matches[gameId].playerAlpha, player, gameId);
            
            io.to(gameId).emit("start battle", { 
                game: matches[gameId].battleManager.exportTurnData(),
                socketId: socket.id
            });
        }
    });
    
    //Remove the player from the lobby on disconnect
    socket.on('disconnect', function(msg){
        lobby.totalPlayers -= 1;
        lobby.removePlayerId(socket.id);
        console.log("User disconnected. Socket ID: " + socket.id);
    });
});

//Update the client main-menu's text field for displaying the total number of players
var onlinePlayersUpdateInterval = setInterval(function(){
    io.emit("total players update", lobby.totalPlayers);
}, 1000);
