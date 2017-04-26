/**
 * The Queue system that drives the battle turns
 * @PARAM {array} alphaMonsters - The alpha player's team of Monster objects
 * @PARAM {array} omegaMonsters - The omega player's team of Monster objects
 * @PARAM {integer} queueLimit - How many turns into the future to preview
 */
class Queue
{
    constructor(alphaMonsters, omegaMonsters, queueLimit = 20){
        this.monsterTeamLimit = 3;
        this.queueLimit = queueLimit;
        this.monsters = alphaMonsters.concat(omegaMonsters);
        this.order = []; //Array of monster ids
        this.previousOrder = [];
        this.turnCount = 0;
        this.baseMeterSpeed = 5;

        this.actionMeters = [0,0,0,0,0,0];
        this.actionIndexes = [];
        this.actionMeterLimit = 10;
        this.activeMonster = null;
        
        this.updatePreview();
        this.update();
    }
    
    //TODO: use the same seed for random monster choices, so that if the queue order changes,
    //the monsters stay the same
    
    //TODO: Create a "fake queue" order that will take altered speeds into account,
    //if the player has a speed altering move selected, but not yet activated
    
    /**
     * Create an order of Monster turns
     */
    updatePreview(){
        this.previousOrder = this.order;
        this.order = [];
        var previewTurnCount = 0;
        var totalMonsters = this.monsters.length;
        var previewMeters = this.actionMeters.slice();
        
        this.monsters.forEach(function(monster){
            monster.previewTotalActions = monster.totalActions;
        });
        
        while(this.order.length < this.queueLimit){
            var previewIndexes = [];
            
            //Check if any meters have already hit the limit
            for(var i = 0; i < totalMonsters; i += 1){
                if(previewMeters[i] >= this.actionMeterLimit){
                    previewIndexes.push(i);
                }
            }
            
            //Advance the meters, and check if any hit the limit
            if(previewIndexes.length < 1){
                for(var i = 0; i < totalMonsters; i += 1){
                    previewMeters[i] += this.getMonsterAGI(this.monsters[i]) + this.baseMeterSpeed;
                    if(previewMeters[i] >= this.actionMeterLimit){
                        previewIndexes.push(i);
                    }
                }
            }

            while(previewIndexes.length > 0){
                var index = 0;
                if(previewIndexes.length > 1){
                    index = this.chooseActiveIndex(previewIndexes, previewMeters, previewTurnCount + this.turnCount, true);
                }
                previewMeters[previewIndexes[index]] -= this.actionMeterLimit;
                this.order.push(this.monsters[previewIndexes[index]]);
                this.monsters[previewIndexes[index]].previewTotalActions += 1;
                previewTurnCount += 1; //This keeps the predicted queue in line with the actual
                previewIndexes.splice(index, 1);
            }
        }
        
        this.trimOrders();
//        this.checkCorrectness();
    }
    
    /**
     * Remove indexes from the Queue order until it is equal to the Queue limit
     */
    trimOrders(){
        while(this.order.length > this.queueLimit){
            this.order.pop();
        }
    }
    
    /**
     * Increase all Monsters' action meters
     */
    advanceActionMeters(){
        for(var i = 0; i < this.actionMeters.length; i += 1){
            this.actionMeters[i] += this.getMonsterAGI(this.monsters[i]) + this.baseMeterSpeed;
            if(this.actionMeters[i] >= this.actionMeterLimit){
                this.actionIndexes.push(i);
            }
        }
    }
    
    /**
     * Get a Monster's final AGI Attribute value
     * @PARAM {Monster object} monster - The Monster to retrieve the Attribute value from
     * @return {int} - The Monster's final AGI value
     */
    getMonsterAGI(monster){
        return monster.attributes.AGI.getFinalValue();
    }
    
    /**
     * Determine the next Monster's turn
     */
    update(){
        var index = 0;
        while(this.actionIndexes.length < 1){
            this.advanceActionMeters();
                console.log("Queue: update()");
        }
        if(this.actionIndexes.length > 1){
            index = this.chooseActiveIndex(this.actionIndexes, this.actionMeters, this.turnCount);
        }
        this.actionMeters[this.actionIndexes[index]] -= this.actionMeterLimit;
        this.activeMonster = this.monsters[this.actionIndexes[index]];
        this.activeMonster.totalActions += 1; //Advance monster's turns/action by 1
        this.turnCount += 1; //Advance total turns/actions by 1
        this.actionIndexes.splice(index, 1);
    }
    
    /**
     * Sorting algorithm for the monster selection process, which is
     * called whenever there are multiple candidates for the current turn activation
     * @PARAM {array} indexes - An array of integers representing the monsters ready to take a turn
     * @PARAM {array} meters - An array of integers representing the monsters ready to take a turn
     * @PARAM {int} seed - The seed for the random number generator
     * @PARAM {bool} isPreview - Whether to use the preview actions or the true actions
     * @return {int} - Index of the chosen monster
     */
    chooseActiveIndex(indexes, meters, seed, isPreview){
        var chosenIndex = 0;
        for(var i = 1; i < indexes.length; i += 1){
            var currentMeterAmount = meters[indexes[chosenIndex]];
            var nextMeterAmount = meters[indexes[i]];

            if(currentMeterAmount > nextMeterAmount){
                continue;
            } else if(currentMeterAmount === nextMeterAmount){
                //the monster with the lowest turns taken gets priority
                
                if(isPreview){
                    var currentActionsTaken = this.monsters[indexes[chosenIndex]].previewTotalActions;
                    var compareActionsTaken = this.monsters[indexes[i]].previewTotalActions;
                } else {
                    var currentActionsTaken = this.monsters[indexes[chosenIndex]].totalActions;
                    var compareActionsTaken = this.monsters[indexes[i]].totalActions;
                }
                if(currentActionsTaken > compareActionsTaken){
                    chosenIndex = i;
                } else if(currentActionsTaken === compareActionsTaken){

                    //TODO: this is flawed in that the random number is always the same
                    //for the current round, which will always result in either the first or last
                    //monster winning every "coin toss". There is no individual monster comparison.
                    //However, this produces repeatable results for the preview queue
                    
                    //TODO: this produces inconsistent preview queue results
//                    var num = this.random(seed); 
//                    if(num === 0){
//                        continue;
//                    } else {
//                        chosenIndex = i;
//                    }
                } else {
                    continue;
                }
            } else {
                chosenIndex = i;
            }
        }
        return chosenIndex;
    }
    
    /**
     * Produces a random number to use for deciding which Monster will be active this turn
     * @PARAM {int} seed - The seed for the random number generator
     * @return {int} - Will either be 1 or 0
     */
    random(seed){
        var x = Math.sin(seed) * 10000;
        return Math.round(x - Math.floor(x));
    }
    
//    checkCorrectness(){
//        var arrayOld = [];
//        this.previousOrder.forEach(function(value){
//            arrayOld.push(value.name.slice(0,2));
//        });
//        arrayOld.shift();
//        
//        var arrayNew = [];
//        this.order.forEach(function(value){
//            arrayNew.push(value.name.slice(0,2));
//        });
//        arrayNew.pop();
//
//        console.log(arrayNew.toString() === arrayOld.toString(), "The old and new arrays match?");
//    }
}

module.exports = Queue;