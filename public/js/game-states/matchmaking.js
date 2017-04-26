var MatchmakingState = {
    init: function(){
        this.time = 300;
        this.searchTimer = this.time;
    },
    preload: function(){
        
    },
    create: function(){
        //Keyboard "Backspace" transitions game state to the Main Menu
        var backKey = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        backKey.onDown.addOnce(DAEMON.state.MAIN);
        
        this.text = game.add.text(20, 20, "Searching", {font: "50px Permanent Marker", fill: "#ccc"});
//        this.text.anchor.setTo(0.5);
        
        this.setUpSocketInteraction();
    },
    update: function(){
        this.searchTimer -= 1;
        if(this.searchTimer <= 0){
            this.searchTimer = this.time;
            this.text.setText("Searching");
        } else if((this.searchTimer % 60) === 0){
            this.text.setText(this.text._text + ".");
        }
    },
    setUpSocketInteraction(){
        Client.socket.on("opponent found", function(gameId){
            console.log("Opponent Found!");
            Client.player.gameId = gameId;
            Client.socket.emit("join room", Client.player);
        });
        
        Client.socket.on("start battle", function(data){
            console.log("Start battle!");
            Client.queue = data.game.queueOrder;
            if(Client.player.socketId === data.game.alphaPlayer.socketId){
                Client.player.monsters = data.game.alphaPlayer.monsters;
                Client.opponent.monsters = data.game.omegaPlayer.monsters;
                Client.opponent.socketId = data.game.omegaPlayer.socketId;
            } else {
                Client.player.monsters = data.game.omegaPlayer.monsters;
                Client.opponent.monsters = data.game.alphaPlayer.monsters;
                Client.opponent.socketId = data.game.alphaPlayer.socketId;
            }
            console.log(Client, "Matchmaking:")
            DAEMON.state.BATTLE();
        });
        
        Client.socket.emit("looking for opponent");
    }
};