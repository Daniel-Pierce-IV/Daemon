//const classEffect = require("./Effect");
const classImmediateEffect = require("./Effect");

/**
 * Represents a single ability the belongs to a Form
 * @PARAM {object} owner - The Monster this Ability is attached to
 * @PARAM {int} abilityId - The ID to use for the construction of the Ability
 */
class Ability
{
    constructor(owner, abilityId){
        let reference = global.Bestiary.abilities[abilityId];
        this.owner = owner;
        this.id = abilityId;
        this.name = reference.name;
        this.targetType = reference.targetType;
        this.isPhysical = reference.isPhysical;
        this.effects = this.initializeEffects(reference.effects);
        this.maxUses = reference.uses;
        this.curUses = 0;
    }
    
    /**
     * Cycle through all Effects of this Ability, and apply them to the target Monster
     * @PARAM {Monster} - The Monster that will receive the Ability's Effects
     */
    applyEffects(target){
//        let previousEffect;
        this.effects.forEach(function(effect, index){
            console.log("Effect #" + index);
//            previousEffect = effect.applyToMonster();
            effect.applyToMonster();
        }, this);
        this.curUses += 1;
    }
    
    /**
     * Get the the number of uses remaining for this Ability
     * @return {int} - Total number of uses remaining
     */
    usesRemaining(){
        return this.maxUses - this.curUses;
    }
    
    /**
     * Get the types of Monsters this Ability can target
     * @return {string} - The targetable type
     */
    getTargetType(){
        return this.targetType;
    }
    
    /**
     * Instantiate this Ability's Effects
     * @PARAM {array} - An array of Effect IDs, represented as integers
     * @return {array} - An array of Effect objects
     */
    initializeEffects(effectIds){
        let effects = [];
        effectIds.forEach(function(effectId){
            effects.push(new classImmediateEffect(effectId));
        }, this);
        return effects;
    }
    
    /**
     * Used for exporting Ability data to the client
     * @return {object} - A representation of the current state
     */
    exportData(){
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            targetType: this.targetType,
            isPhysical: this.isPhysical,
            maxUses: this.maxUses,
            curUses: this.curUses,
        }
    }
}

module.exports = Ability;