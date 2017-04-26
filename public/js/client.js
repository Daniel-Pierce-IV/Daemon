var Client = {
    socket: null,
    player: null,
    opponent: {},
};

Client.socket = io.connect();

//The representation of the Player and their Monster team
Client.player = {
    username: "Player 1",
    gameId: "", //The concatenation of 2 player's Socket IDs
    monsterIds: [1, 2, 3], //The type of Monster at an index
    monsterFormIds: [ //The Forms available to a particular Monster, same index as monsterIds
        [0,1,2,3,4,5],
        [0,1,2,3,4,5],
        [0,1,2,3,4,5],
    ]
};

//Assign the Socket ID of the connect to the player
Client.socket.on('connect', function(data){
    Client.player.socketId = Client.socket.io.engine.id;
});

//Information reference on Forms and their Abilities
Client.socket.on("monster data", function(data){
    Client.forms = data;
});
