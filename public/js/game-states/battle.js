var BattleState = {
    create: function(){
        this.playerMonsterGroup = game.add.group();
        this.playerMonsterGroup.inputEnableChildren = true;
        
        this.opponentMonsterGroup = game.add.group();
        this.opponentMonsterGroup.inputEnableChildren = true;

        this.menus = {
            command: {
                isActive: false,
                abilityOptions: game.add.group(),
                toggle: function(){
                    BattleState.hideMonsterSelectors();
                    if(this.menus.areAllClosed()){
                        this.isActive = true;
                    } else if(this.isActive){
                        this.isActive = false;
                    } else {
                        this.menus.closeAll();
                        this.isActive = true;
                    }
//                    this.abilityOptions.visible = this.isActive;
                    console.log("Command isActive = " + this.isActive);
                    this.update();
                },
                
                update: function(){
                    this.abilityOptions.visible = this.isActive;
                    this.abilityOptions.y = 0;
                    
                    if(this.abilityOptions.visible){
                        let form = Client.player.monsters[Client.queue[0].monsterId].curForm;
                        this.abilityOptions.removeAll(true);

                        form.abilities.forEach(function(ability, index){
                            let abilitySprite = game.add.sprite(game.width/2, game.height/5*(index + 1), "white-panel");
                            abilitySprite.width = game.width/3;
                            abilitySprite.height = game.height/6;
                            abilitySprite.anchor.setTo(0.5);

                            abilitySprite.inputEnabled = true;
                            abilitySprite.events.onInputDown.add(BattleState.selectTarget, BattleState);

                            this.abilityOptions.add(abilitySprite);
                        }, this);
                    }
                }
            },
            
            shift: {
                isActive: false,
                toggle: function(){
                    BattleState.hideMonsterSelectors();
                    if(this.menus.areAllClosed()){
                        this.isActive = true;
                    } else if(this.isActive){
                        this.isActive = false;
                    } else {
                        this.menus.closeAll();
                        this.isActive = true;
                    }
                    console.log("Shift isActive = " + this.isActive);
                }
            },
            
            forfeit: {
                isActive: false,
                toggle: function(){
                    BattleState.hideMonsterSelectors();
                    if(this.menus.areAllClosed()){
                        this.isActive = true;
                    } else if(this.isActive){
                        this.isActive = false;
                    } else {
                        this.menus.closeAll();
                        this.isActive = true;
                    }
                    console.log("Forfeit isActive = " + this.isActive);
                }
            },
            
            //deactivate all menus
            closeAll: function(){
                this.command.isActive = false;
                this.shift.isActive = false;
                this.forfeit.isActive = false;
                BattleState.hideMonsterSelectors();
            },
            
            //Check if all menus are currently inactive
            areAllClosed: function(){
                let allClosed = true;
                if(this.command.isActive || this.shift.isActive || this.forfeit.isActive){
                    allClosed = false;
                }
                return allClosed;
            },
            
            init: function(){
                this.command.menus = this;
                this.shift.menus = this;
                this.forfeit.menus = this;
            }
        };
        
        this.menus.init();
        
        this.buildActionsPanel();
        this.buildBattlefieldPanel();
        this.buildMonsterSelectors();
        this.buildQueuePanel();
        
        this.commandMenuActive = false;
        this.shiftMenuActive = false;
        this.forfeitMenuActive = false;
        
        this.toggleInterface();
        
//        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
//        this.enterKey.onUp.add(this.updateQueuePanel, this);
        
//        game.input.addMoveCallback(this.actionPanelUpdate, this);
    },
    
    update: function(){
        
    },
    
    actionPanelUpdate: function(){
        this.actionsPanelGroup.children.forEach(function(child){
            if(child.input.pointerOver()){
                child.fill = "#990";
            } else {
                child.fill = "#000";
            }
        });
    },
    
    //This is re-built according to the abilities available to the active monster
    buildActionsPanel: function(){
        var actionsPanelGroup = game.add.group();
        actionsPanelGroup.inputEnableChildren = true;
        var buttonHeight = game.height/5;
        var buttonWidth = game.width/6;
        
        var panel = game.add.sprite(0, game.height/4, "white-panel");
        panel.anchor.setTo(0, 0.5);
        panel.height = buttonHeight;
        panel.width = buttonWidth;
        panel.addChild(game.add.text(10, 10, "Command", {font: "30px Raleway", fill: "#000"}));
        panel.inputEnabled = true;
        panel.events.onInputDown.add(this.menus.command.toggle, this.menus.command);
        actionsPanelGroup.addChild(panel);
        
        panel = game.add.sprite(0, game.height/4*2, "white-panel");
        panel.anchor.setTo(0, 0.5);
        panel.height = buttonHeight;
        panel.width = buttonWidth;
        panel.addChild(game.add.text(10, 10, "Shift", {font: "30px Raleway", fill: "#000"}));
        panel.inputEnabled = true;
        panel.events.onInputDown.add(this.menus.shift.toggle, this.menus.shift);
        actionsPanelGroup.addChild(panel);
        
        panel = game.add.sprite(0, game.height/4*3, "white-panel");
        panel.anchor.setTo(0, 0.5);
        panel.height = buttonHeight;
        panel.width = buttonWidth;
        panel.addChild(game.add.text(10, 10, "Forfeit", {font: "30px Raleway", fill: "#000"}));
        panel.inputEnabled = true;
        panel.events.onInputDown.add(this.menus.forfeit.toggle, this.menus.forfeit);
        actionsPanelGroup.addChild(panel);
        
//        var text = game.add.text(10, game.height/2, "Attack!", {font: "30px Raleway", fill: "#000"});
//        text.anchor.setTo(0.5);
//        text.inputEnabled = true;
//        text.events.onInputDown.add(this.selectMonsterToDamage, this);
        
        //TODO: fix the z-index problems with the above panel. 
        this.actionsPanelGroup = actionsPanelGroup;
//        this.actionsPanelGroup.add(text);
    },
    
    buildBattlefieldPanel: function(){
        var sprite;
        
        //Populate the enemy group
        var enemyY = game.height/3;
        var enemyPositions = [
            [game.width/3, enemyY],
            [game.width/2, enemyY],
            [game.width/3*2, enemyY]
        ];
        
        //Populate the ally group
        var allyY = game.height/3*2;
        var allyPositions = [
            [game.width/3, allyY],
            [game.width/2, allyY],
            [game.width/3*2, allyY]
        ];
        
        var teamSize = 3;
        for(var i = 0; i < teamSize; i += 1){
            this.opponentMonsterGroup.create(enemyPositions[i][0], enemyPositions[i][1], this.getMonsterSpritesheet(Client.opponent.monsters[i].name), 0);
//            this.opponentMonsterGroup.create(enemyPositions[i][0], enemyPositions[i][1], DAEMON.bestiary[enemyId].spritesheet, 0);
            this.opponentMonsterGroup.children[i].anchor.setTo(0.5);
            this.opponentMonsterGroup.children[i].inputEnabled = true;
            this.opponentMonsterGroup.children[i].events.onInputDown.add(this.damageThisTarget, this);
            
            this.playerMonsterGroup.create(allyPositions[i][0], allyPositions[i][1], this.getMonsterSpritesheet(Client.player.monsters[i].name), 1);
//            this.playerMonsterGroup.create(allyPositions[i][0], allyPositions[i][1], DAEMON.bestiary[allyId].spritesheet, 1);
            this.playerMonsterGroup.children[i].anchor.setTo(0.5);
        }
        
        this.enemyStatusGroup = game.add.group();
        for(var i = 0; i < 3; i += 1){
            var group = game.add.group();
            group.x = (game.width / 6) * (2 + i);
            
            var sprite;
            sprite = game.add.sprite(0, 0, "health-bar-white");
            sprite.anchor.setTo(0.5);
            group.add(sprite);

            sprite = game.add.sprite(0, 0, "health-bar-green");
            sprite.anchor.setTo(0.5);
            group.add(sprite);
            this.enemyStatusGroup.add(group);
        }
        
        this.allyStatusGroup = game.add.group();
        this.allyStatusGroup.y = game.height;
        for(var i = 0; i < 3; i += 1){
            var group = game.add.group();
            group.x = (game.width / 6) * (2 + i);
            
            var sprite;
            sprite = game.add.sprite(0, 0, "health-bar-white");
            sprite.anchor.setTo(0.5);
            group.add(sprite);

            sprite = game.add.sprite(0, 0, "health-bar-green");
            sprite.anchor.setTo(0.5);
            group.add(sprite);
            this.allyStatusGroup.add(group);
        }
    },
    
    buildQueuePanel: function(){
        var width = game.width/6;
        var height = game.height/6;
        var margin = 5;
        
        this.queuePanelGroup = game.add.group();
        this.queuePanelGroup.x = game.width/6*5;
        
        var sprite = game.add.sprite(0, 0, "blue-panel");
        sprite.height = game.height;
        sprite.width = width;
        this.queuePanelGroup.add(sprite);
        
        let queue = this.getQueue();
        for(var i = 0; i < this.getQueue().length; i += 1){
//            sprite = game.add.sprite(width/2, (height*i)+(height/2), DAEMON.bestiary[this.queue.order[i].id].portrait);
            if(Client.player.socketId === queue[i].socketId){
                sprite = game.add.sprite(width/2, (height*i)+(height/2), this.getMonsterPortrait(Client.player.monsters[queue[i].monsterId].name));
            } else {
                sprite = game.add.sprite(width/2, (height*i)+(height/2), this.getMonsterPortrait(Client.opponent.monsters[queue[i].monsterId].name));
            }
            sprite.width = width / 2;
            sprite.height = height - (margin * 2);
            sprite.anchor.setTo(0.5);
            this.queuePanelGroup.add(sprite);
        }
        
//        this.text = game.add.text(game.width/2, 30, DAEMON.bestiary[this.queue.activeMonster.id].name);
    },

    updateQueuePanel: function(){
        //TODO fix this for loop. im subtracting 1 from the length
        for(var i = 1; i < this.queuePanelGroup.children.length - 1; i += 1){
            this.queuePanelGroup.children[i].loadTexture(DAEMON.bestiary[this.queue.order[i].id].portrait);
        }
        this.text.setText(DAEMON.bestiary[this.queue.activeMonster.id].name);
        
        this.updateActiveMonsterPanel();
        this.activateMonster();
    },
    
    updateBattlefieldPanel: function(){
        
    },
    
    selectMonsterToDamage: function(){
        //if it is the player's turn
        this.canSelectTarget = true;
    },
    
    //This is a callback on clicking an enemy after selecting an attack.
    //@child is the sprite the player clicked/pressed
    damageThisTarget: function(child){
        
        if(this.canSelectTarget){
            //The enemy monsters array and their sprite represention's array
            //has the same number of elements, and those elements both share
            //the same indexes
            var monster = this.enemyMonsters[child.parent.children.indexOf(child)]
            console.log(monster.name + " was damaged!");
//            monster.takeDamage(100, true);
            
            //pass the turn and update the queue
            this.updateQueuePanel();
            this.canSelectTarget = false;
        }
    },
    
    getQueue: function(){
        return Client.queue;
    },
    
    getActiveMonster: function(){
        return Client.queue[0];
    },
    
    getActiveMonsterId: function(){
        return Client.queue[0].monsterId;
    },
    
//    getPlayerMonster(monsterId){
//        
//    }
    
    getMonsterPortrait: function(monsterName){
        return monsterName.toLowerCase() + "-portrait";
    },
    
    getMonsterSpritesheet: function(monsterName){
        return monsterName.toLowerCase() + "-spritesheet";
    },
            
    childIndex: function(child){
        return child.parent.children.indexOf(child);
    },
    
    selectTarget: function(child){
        let ability = Client.player.monsters[
            this.getActiveMonsterId()
        ].curForm.abilities[this.childIndex(child)];
        
        let targetType = ability.targetType;
        
        this.updateSelectors(targetType);
        
//        let opponentSelectors = game.add.group();
    },
    
    hideMonsterSelectors: function(){
        this.playerSelectorGroup.visible = false;
        this.opponentSelectorGroup.visible = false;
    },
    
    
    buildMonsterSelectors: function(){
        let playerSelectorGroup = game.add.group();
        playerSelectorGroup.visible = false;
        playerSelectorGroup.x = this.playerMonsterGroup.position.x;
        playerSelectorGroup.y = this.playerMonsterGroup.position.y + 100; //Set the selectors to be lower than the monster sprites
        
        Client.player.monsters.forEach(function(monster, index){
            let monSprite = this.playerMonsterGroup.children[index];
            let selector = game.add.sprite(monSprite.x, monSprite.y, "chevron-yellow");
            selector.anchor.setTo(0.5);
            playerSelectorGroup.add(selector);
        }, this);
        this.playerSelectorGroup = playerSelectorGroup;
        
        let opponentSelectorGroup = game.add.group();
        opponentSelectorGroup.visible = false;
        opponentSelectorGroup.x = this.opponentMonsterGroup.position.x;
        opponentSelectorGroup.y = this.opponentMonsterGroup.position.y - 100;
        
        Client.opponent.monsters.forEach(function(monster, index){
            let monSprite = this.opponentMonsterGroup.children[index];
            let selector = game.add.sprite(monSprite.x, monSprite.y, "chevron-yellow");
            selector.anchor.setTo(0.5);
            opponentSelectorGroup.add(selector);
        }, this);
        this.opponentSelectorGroup = opponentSelectorGroup;
        this.opponentSelectorGroup.children[1].visible = false;
    },
    
    updateSelectors: function(targetType){
        this.playerSelectorGroup.visible = true;
        this.opponentSelectorGroup.visible = true;
        
        Client.player.monsters.forEach(function(monster, index){
            this.playerSelectorGroup.children[index].visible = true;
            if(Client.player.monsters[index].curHP <= 0 || targetType === "enemy"){
                //TODO: this is the wrong way to handle dead-monster-non-targetting
                this.playerSelectorGroup.children[index].visible = false; 
            }
            
            this.opponentSelectorGroup.children[index].visible = true;
            if(Client.opponent.monsters[index].curHP <= 0 || targetType === "ally"){
                //TODO: this is the wrong way to handle dead-monster-non-targetting
                this.opponentSelectorGroup.children[index].visible = false; 
            }
        }, this);
    },
    
    //Check to see if this player is active this turn
    isPlayersTurn: function(){
        return Client.player.socketId === Client.queue[0].socketId;
    },
    
    toggleInterface: function(){
        this.actionsPanelGroup.visible = this.isPlayersTurn();
    }
};
