const classMonster = require("./Monster");
const classQueue = require("./Queue");

/**
 * Manages all battle logic
 */
class BattleManager
{
    constructor(alphaPlayer, omegaPlayer, gameId){
        this.alphaPlayer = alphaPlayer;
        this.omegaPlayer = omegaPlayer;
        
        this.alphaPlayer.monsters = [];
        this.initializeMonsters(alphaPlayer);
        
        this.omegaPlayer.monsters = [];
        this.initializeMonsters(omegaPlayer);
        
        this.gameId = gameId;
        this.queue = new classQueue(this.alphaPlayer.monsters, this.omegaPlayer.monsters);
        
        this.turnTimeLimit = 30; //seconds
        console.log("Ready for glorious battle!"); 
    }
    
    /**
     * Instantiate Monster objects for the player's team
     * @PARAM {object} - The player who's team will have Monsters added to it
     */
    initializeMonsters(player){
        player.monsterIds.forEach(function(monsterId, index){
            player.monsters.push(new classMonster(player, monsterId, index));
        }, this);
    }
    
    beginInitialPhase(){
        let isAlphasTurn = true;
        let alphaMessage = "initial phase active";
        let omegaMessage = "initial phase passive";
        
        if(this.omegaMonsters.indexOf(this.queue.activeMonster) >= 0){
            isAlphasTurn = false;
            alphaMessage = "initial phase passive";
            omegaMessage = "initial phase active";
        }
        
        //Send message to both clients about whos turn it is
        io.to(this.alphaPlayer.socketId).emit(alphaMessage, this.queue.order);
        io.to(this.omegaPlayer.socketId).emit(omegaMessage, this.queue.order);
        
        
        //TODO: Receive confirmation responses from both players
        
        this.beginMainPhase();
    }
    
    beginMainPhase(){
        console.log("Main Phase: " + this.queue.activeMonster.name);
        
        //TODO: Send the start turn message to active player
        
        //TODO: When the player acknowledges receipt of the message with a response message,
        //start the timer
        
        //TODO: Receive player action message,
        //stop the timer
        
        //TODO: Calculate action result
        
        //TODO: Message both players about the outcome
        
        this.beginEndingPhase();
    }
    
    beginEndingPhase(){
        console.log("Ending Phase: " + this.queue.activeMonster.name);
        
        //TODO: Check for victory condition. If victory, exit gameplay loop
        
        //TODO: Update active monster effects
        
        //TODO: Update the queue
        
        //TODO: Pass the turn to the next monster
        
        this.broadcastAction();
    }
    
    /**
     * Inform the monster of which ability to use, and the target to use it on
     * @PARAM {int} - The index of the Ability to use
     * @PARAM {Monster} - The Monster target of the Ability
     */
    monsterAction(abilityIndex, target){
        this.queue.activeMonster.curForm.abilities[abilityIndex].applyEffects(target);
        this.beginEndingPhase();
    }
    
    /**
     * Inform the monster of which form to shift into
     * @PARAM {int} - The id of the Form
     */
    monsterShift(formIndex){
        this.queue.activeMonster.changeForm(formIndex);
        this.beginEndingPhase();
    }
    
    startTurnTimer(){
        
    }
    
    stopTurnTimer(){
        
    }
    
    /**
     * Used for exporting gameplay data to the client
     * @return {object} - All data about the both teams of Monsters, and the Queue
     */
    exportTurnData(){
        //TODO: exporting all data to both players is a gameplay flaw.
        //this could allow a player to gain the upper hand tactically by 
        //checking out the opposing player's monster's forms and abilities
        
        let monsters = [];
        this.alphaPlayer.monsters.forEach(function(monster){
            monsters.push(monster.exportData());
        });
        
        let alpha = {
            socketId: this.alphaPlayer.socketId,
            monsters: monsters
        }
        
        monsters = [];
        
        this.omegaPlayer.monsters.forEach(function(monster){
            monsters.push(monster.exportData());
        });
        
        let omega = {
            socketId: this.omegaPlayer.socketId,
            monsters: monsters
        }
        
        let order = [];
        
        this.queue.order.forEach(function(monster){
            order.push(monster.exportBasicData());
        });
        
        let data = {
            queueOrder: order,
            alphaPlayer: alpha,
            omegaPlayer: omega,
        }
        
        return data;
    }
}

module.exports = BattleManager;