var MonsterTeamState = {
    init: function(){
        game.stage.disableVisibilityChange = true; 
    },
    
    create: function(){  
        //Array of monster ids
        this.monsterIds = Client.player.monsterIds;
        this.selectionIndex = 0;
        
        //Locations on the left part of the screen,
        //spaced vertically equidistant
        this.monsterSlotPoints = [
            [game.width/6, game.height/4-15],
            [game.width/6, game.height/4*2],
            [game.width/6, game.height/4*3+15],
        ];
        
        this.panels = {};
        
        this.buildMonsterTeamPanel();
        this.buildDataPanel();
        this.buildInfoPanel();
        this.buildAttributePanel();
        this.buildKeybinds();
    },
    
    update: function(){
        
    },
    
    buildMonsterTeamPanel: function(){
        this.monsterSpriteGroup = game.add.group();
        
        this.monsterSlotPoints.forEach(function(point, index){
            let monsterId = this.monsterIds[index];
            if(typeof this.monsterIds[index] === "number"){
                var monster = game.add.sprite(point[0], point[1], this.monsterSpritesheet(monsterId), 0);
            } else {
                var monster = game.add.sprite(point[0], point[1], "unknown-monster");
            }
            
            monster.anchor.setTo(0.5);
            monster.inputEnabled = true;
            monster.events.onInputDown.add(this.moveFormSelectors, this);
            this.monsterSpriteGroup.add(monster);
        }, this);
        
        //The left and right arrows that allow a player to change their team composition
        var selectorGroup = game.add.group();
        selectorGroup.inputEnableChildren = true;
        var curMonster = this.monsterSpriteGroup.children[this.selectionIndex];
        
        x = curMonster.x - curMonster.width/2;
        var derp = game.add.sprite(x, 0, "chevron-yellow");
        derp.anchor.setTo(1, 0.5);
        
        derp.events.onInputDown.add(this.decreaseCurMonsterSelection, this);
        selectorGroup.add(derp);
        
        selectorGroup.y = curMonster.y;
        
        x = curMonster.x + curMonster.width/2;
        derp = game.add.sprite(x, 0, "chevron-yellow");
        derp.anchor.setTo(1, 0.5);
        derp.scale.x = -1; //Horizontal-flip
        derp.events.onInputDown.add(this.increaseCurMonsterSelection, this);
        
        selectorGroup.add(derp);
//        selectorGroup.visible = false;
        this.selectorGroup = selectorGroup;
    },
    
    buildDataPanel: function(){
        var dataGroup = game.add.group();
        dataGroup.x = game.width/3;
        dataGroup.create(0, 0, "white-panel");
        dataGroup.children[0].height = game.height/4;
        dataGroup.children[0].width = game.width/3*2;
        
        var text = game.add.text(20, 0, "", {font: "35px Permanent Marker", fill: "#000"});
        dataGroup.add(text);
        
        let formId = this.monsterIds[this.selectionIndex];
        if(this.monsterIds[this.selectionIndex] !== null){
            text.setText(Client.forms[formId].name);
        }
        
        this.panels.dataGroup = dataGroup;
    },
    
    buildInfoPanel: function(){
        var panel = game.add.sprite(game.width/3, game.height/4, "green-panel");
        panel.height = game.height/4*3;
        panel.width = game.width/3;
    },
    
    buildAttributePanel: function (){
        var panel = game.add.sprite(game.width/3*2, game.height/4, "blue-panel");
        panel.height = game.height/4*3;
        panel.width = game.width/3;
    },
    
    buildKeybinds: function(){
//        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
//        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
//        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
//        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
//        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.backspaceKey = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

//        this.upKey.onUp.add(this.handleUpInput, this);
//        this.downKey.onUp.add(this.handleDownInput, this);
//        this.leftKey.onUp.add(this.handleLeftInput, this);
//        this.rightKey.onUp.add(this.handleRightInput, this);
//        this.enterKey.onUp.add(this.handleEnterInput, this);
        this.backspaceKey.onUp.add(this.handleBackspaceInput, this);
    },
    
    moveFormSelectors: function(sprite){
        if(this.selectorGroup.y !== sprite.y){
            this.selectorGroup.visible = true;
            this.selectorGroup.y = sprite.y;
            this.selectionIndex = this.monsterSpriteGroup.children.indexOf(sprite);
            this.refreshPanels();
        } else {
            this.toggleFormSelectors();
        }
    },
    
    toggleFormSelectors: function(){
        this.selectorGroup.visible = !this.selectorGroup.visible;
    },
    
    decreaseCurMonsterSelection: function(){
        var index = this.selectionIndex;
        if(typeof this.monsterIds[index] === "number"){
            this.monsterIds[index] -= 1;
            if(this.monsterIds[index] < 0){
                this.monsterIds[index] = this.getMonsterForms().length - 1;
            }
        } else {
            this.monsterIds[index] = this.getMonsterForms().length - 1;
        }
        this.refreshPanels();
    },
    
    increaseCurMonsterSelection: function(){
        var index = this.selectionIndex;
        if(typeof this.monsterIds[index] === "number"){
            this.monsterIds[index] += 1;
            if(this.monsterIds[index] >= this.getMonsterForms().length){
                this.monsterIds[index] = 0;
            }
        } else {
            this.monsterIds[index] = 0;
        }
        this.refreshPanels();
    },
    
    refreshPanels: function(){
        this.updateMonsterSpriteGroup();
        this.updateDataGroup();
    },
    
    updateMonsterSpriteGroup: function(){
        this.monsterIds.forEach(function(monsterId, index){
            if(typeof monsterId === "number"){
                this.monsterSpriteGroup.children[index].loadTexture(this.monsterSpritesheet(monsterId), 0);
            } else {
                this.monsterSpriteGroup.children[index].loadTexture("unknown-monster");
            }
        }, this);
    },
    
    updateDataGroup: function(){
        let formId = this.monsterIds[this.selectionIndex];
        if(formId !== null){
            this.panels.dataGroup.children[1].setText(this.getMonsterForm(formId).name);
        }
    },
    
//    handleUpInput: function(){
//        var select = this.selectionPosition;
//        if(select > 2){
//            select -= 3;
//        } else {
//            select += 3;
//        }
//        this.highlightCurrentPortait(select, this.selectionPosition);
//        this.selectionPosition = select;
//        this.updateText();
//    },
    
//    handleDownInput: function(){
//        var select = this.selectionPosition;
//        if(select < 3){
//            select += 3;
//        } else {
//            select -= 3;
//        }
//        this.highlightCurrentPortait(select, this.selectionPosition);
//        this.selectionPosition = select;
//        this.updateText();
//    },
    
//    handleLeftInput: function(){
//        var select = this.selectionPosition;
//        if(select === 0 || select === 3){
//            select += 2;
//        } else {
//            select -= 1;
//        }
//        this.highlightCurrentPortait(select, this.selectionPosition);
//        this.selectionPosition = select;
//        this.updateText();
//    },
    
//    handleRightInput: function(){
//        var select = this.selectionPosition;
//        if(select === 2 || select === 5){
//            select -= 2;
//        } else {
//            select += 1;
//        }
//        this.highlightCurrentPortait(select, this.selectionPosition);
//        this.selectionPosition = select;
//        this.updateText();
//    },
    
//    handleEnterInput: function(){
//        var select = this.selectionPosition;
//        var teamLimit = 3;
//        
//        if(this.playerSelections.length < teamLimit){
//            //If the cursor is within the bounds of the portrait positions
//            if(select >= 0 && select < this.portraitGroup.length){
//                this.playerSelections.push(select);
//                this.updateSelectedMonsters();
//                this.updateText();
//            }
//        }
//        if(this.playerSelections.length === teamLimit && this.countdown === false){
//            this.startFightCountdown();
//        }
//    },
    
    handleBackspaceInput: function(){
        DAEMON.state.MAIN();
    },
    
    monsterSpritesheet: function(monsterId){
        return Client.forms[monsterId].name.toLowerCase() + "-spritesheet";
    },
    
    getMonsterForm: function(formId){
        return Client.forms[formId];
    },
    
    getMonsterForms: function(){
        return Client.forms;
    },
    
//    updateSelectedMonsters: function(){
//        //Clear all selections
//        for(var frame of this.selectionGroup.children){
//            frame.children = [];
//        }
    
//        //Re-populate the selection frames with the player's chosen monsters
//        for(var index in this.playerSelections){
//            var sprite = game.add.sprite(0, 0, DAEMON.bestiary[this.playerSelections[index]].portrait)
//            sprite.anchor.setTo(0.5);
//            sprite.scale.setTo(2.25)
//            this.selectionGroup.children[index].addChild(sprite)
//        }
//    },
    
//    updateInfoPane: function(){
//        var monster = DAEMON.bestiary[this.selectionPosition];
//        this.infoPanel.children[0].loadTexture(monster.name.toLowerCase() + "-spritesheet",0);
//    },
    
//    updateText: function(){
//        var monsters = this.playerSelections.length;
//        switch(monsters){
//            case 1:
//                this.text.setText("Select your second monster");
//                break;
//            case 2:
//                this.text.setText("Select your final monster");
//                break;
//            case 3:
//                this.text.setText("Matchmaking starting in: 5");
//                break;
//            default:
//                break;
//        }
    
//        var monster = DAEMON.bestiary[this.selectionPosition];
//        this.infoPanel.children[1].setText(monster.name);
//        this.infoPanel.children[2].setText(monster.description);
//        this.updateInfoPane();
//    },
};