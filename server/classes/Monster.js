const classAttribute = require("./Attribute");
const classForm = require("./Form");

/**
 * Represents a Monster that belongs to a player
 * @PARAM {object} owner - The player that owns this monster
 * @PARAM {int} formId - The current Form of the Monster
 * @PARAM {int} monsterIndex - The position of the monster in the player's team
 */
class Monster
{
    constructor(owner, formId, monsterIndex){
        let reference = global.Bestiary.forms[formId];
        this.owningPlayer = owner;
        this.id = owner.monsters.length;
        this.name = reference.name;
        
        //Base attributes for the Monster (all ones(1), until training is implemented)
        this.attributes = {
            VIT: new classAttribute(this, "VIT", 1),
            STR: new classAttribute(this, "STR", 1),
            END: new classAttribute(this, "END", 1),
            INT: new classAttribute(this, "INT", 1),
            WIL: new classAttribute(this, "WIL", 1),
            AGI: new classAttribute(this, "AGI", 1),
        }
        
        //All forms available to the monster
        this.forms = this.initializeForms(owner.monsterFormIds[monsterIndex]); 
        
        //The Monster's current Form
        this.curForm = this.forms[formId]; 
        
        //Array of Effects currently applied to Monster,
        //that have a duration greater than 0
        this.effects = [];
        
        //TODO: a special type of attribute will need to be made for this
        this.maxHP = this.attributes.VIT.getFinalValue() * 10;
        this.curHP = this.maxHP;
        
        //Queue helper properties
        this.actionMeter = 0; //Currently filled amount of the monster's action meter
        this.totalActions = 0; //Total actions taken in the current battle
        this.previewTotalActions = 0; //needed to keep the preview queue consistent
    }
    
    /**
     * Instantiate the Forms associated with this Monster
     * @PARAM {array} formIds - An array of Form Ids
     * @return {array} - Array of Form objects
     */
    initializeForms(formIds){
        let forms = [];
        formIds.forEach(function(formId){
            forms.push(new classForm(this, formId));
        }, this);
        return forms;
    }
    
    /**
     * Set the current Form to the Form specified
     * @PARAM {int} formIndex - Index of the Form to shift into
     */
    changeForm(formIndex){
        this.curForm = this.forms[formIndex];
    }
    
    /**
     * Ensure Attribute values remain within an arbitrary range
     * @PARAM {int} value - The Attribute value to clamp
     * @return {int} - The clamped value
     */
    attributeClamp(value){
        if(value < 0){
            return 0;
        }
        return value;
    }
    
    //TODO: Update the Effects applied to the Monster
    updateEffects(){
        
    }
    
    /**
     * Decrease the Monster's current HP by the calculated amount,
     * which takes the type of effect and the monster's defense into account
     * @PARAM {int} amount - The base damage of the Effect to deal to the Monster
     * @PARAM {bool} isPhysical - True uses END for defense against the Effect. False uses WIL.
     * @PARAM {bool} isUnblockable - True will allow for full, undefended damage to the Monster
     * @return {int} - The total damage taken by the Monster
     */
    damageHP(amount, isPhysical = false, isUnblockable = false){
        let curHP = this.curHP;
        
        if(isUnblockable === false){
            if(isPhysical){
                amount -= this.attributeClamp(this.attribute.END.getFinalValue);
            } else {
                amount -= this.attributeClamp(this.attribute.WIL.getFinalValue);
            }
        }
        
        if(amount < 0){
            amount = 0;
        }
        
        curHP -= amount;
        
        if(curHP < 0){
            curHP = 0;
        }
        
        this.curHP = curHP;
        return amount;
    }
    
    /**
     * Increase the Monster's current HP by a certain amount
     * @PARAM {int} amount - The base value of the Effect to heal the Monster by
     * @return {int} - The total health restored to the Monster
     */
    restoreHP(amount){
        let curHP = this.curHP;
        let maxHP = this.maxHP;
        let restorableHP = maxHP - curHP;
            
        //Only restore missing HP, disregard over-heal amount
        if(restorableHP < amount){
            amount = restorableHP;
        }

        this.curHP += amount;
        return amount;
    }
    
    /**
     * Used for exporting Monster data to the client
     * @return {object} - Representation of this Monster's current state
     */
    exportData(){
        let forms = [];
        this.forms.forEach(function(form){
            forms.push(form.exportData());
        });
        
        return {
            id: this.id,
            name: this.name,
            VIT: this.attributes.VIT.exportData(),
            STR: this.attributes.STR.exportData(),
            END: this.attributes.END.exportData(),
            INT: this.attributes.INT.exportData(),
            WIL: this.attributes.WIL.exportData(),
            AGI: this.attributes.AGI.exportData(),
            maxHP: this.maxHP,
            curHP: this.curHP,
            curForm: this.curForm.exportData(),
            forms: forms,
        }
    }
    
    /**
     * Used for exporting minimal Monster data to the client, for use with the Queue
     * @return {object} - Representation of this Monster's ID and owner
     */
    exportBasicData(){
        return {
            socketId: this.owningPlayer.socketId,
            monsterId: this.id
        }
    }
}

module.exports = Monster;