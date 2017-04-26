var MainState = {
    init: function(){
        this.stage.disableVisibilityChange = true;
    },

    create: function(){
//        this.background = game.add.sprite(0, 0, 'main-background');
        game.stage.backgroundColor = "#222";
        //Scale background image to same size as the browser viewport
//        var scaleX = game.width / this.background.width;
//        var scaleY = game.height / this.background.height;
//        this.background.scale.setTo(scaleX, scaleY);
        
        //Create the Title for the Main Menu
        var text = game.add.text(game.width/2, game.height/10, "Daemon", {font: "100px Permanent Marker", fill: "#ccc"});
        text.anchor.setTo(0.5);
        
        //Add the menu options
        this.menu = game.add.group();
        this.menu.y = 20;
        this.menu.inputEnableChildren = true;
        
//        text = game.add.text(game.width/2, game.height/3, "Matchmaking", {font: "40px Raleway", fill: "#ccc"});
//        text.anchor.setTo(0.5);
//        text.inputEnabled = true;
//        text.events.onInputDown.add(DAEMON.state.MATCHMAKING, this);
//        this.menu.add(text);
        
        text = game.add.text(game.width/2, game.height/3, "Matchmaking", {font: "40px Raleway", fill: "#ccc"});
        text.anchor.setTo(0.5);
        text.events.onInputDown.add(this.checkIfBattleReady, this);
        this.menu.add(text);
        
        text = game.add.text(game.width/2, game.height/2, "Monsters", {font: "40px Raleway", fill: "#ccc"});
        text.anchor.setTo(0.5);
        text.events.onInputDown.add(DAEMON.state.MONSTERS, this);
        this.menu.add(text);
        
        text = game.add.text(game.width/2, game.height/3*2, "Options", {font: "40px Raleway", fill: "#ccc"});
        text.anchor.setTo(0.5);
//        text.events.onInputDown.add(DAEMON.state.OPTIONS, this);
        this.menu.add(text);
        
        game.input.addMoveCallback(this.menuUpdate, this);
        
        this.modal = new gameModal(game);
        this.createModal();
        
        var totalPlayersText = game.add.text(20, game.height - 40, "Players Online:", {font: "30px Raleway", fill: "#ccc"});
        
        Client.socket.on("total players update", function(totalPlayers){
            totalPlayersText.setText("Players Online: " + totalPlayers);
        });
        
    },
    
    update: function(){
        
    },
    
    menuUpdate: function(){
        this.menu.forEach(function(child){
            if(child.input.pointerOver()){
                child.fill = "#990";
            } else {
                child.fill = "#ccc";
            }
        });
    },
    
    checkIfBattleReady: function(){
        var isReady = true;
//        for(var value of DAEMON.player.monsterIds){
//            if(typeof value !== "number"){
//                isReady = false;
//            }
//        }
        if(isReady){
            DAEMON.state.MATCHMAKING();
        } else {
            this.showModal();
        }
    },
    
    createModal: function(){
        this.modal.createModal({
            type:"Get more monsters",
            includeBackground: true,
            modalCloseOnInput: true,
            itemsArr: [
                {
                    type: "text",
                    content: "Ensure you have a full party of monsters \n before attempting to battle!",
                    fontFamily: "Raleway",
                    fontSize: 32,
                    color: "0xFEFF49",
                    offsetY: -50,
                    stroke: "0x000000",
                    strokeThickness: 5,
                    callback: this.menuUpdate
                }
            ]
        });
    },
    
    showModal: function(){
        this.modal.showModal("Get more monsters");
        this.menuUpdate();
    }
};