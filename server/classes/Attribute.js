/**
 * Represents a single Attribute that belongs to a monster
 * @PARAM {Monster object} owner - The Monster this Attribute is attached to
 * @PARAM {string} name - The name of this Attribute ("VIT", "END", etc.)
 * @PARAM {int} baseValue - The Monster's base value for this Attribute
 */
class Attribute
{
    constructor(owner, name, baseValue){
        this.owner = owner;
        this.name = name;
        this.baseValue = baseValue;
    }
    
    /**
     * Get the base Attribute value
     * @return {int} - The base value
     */
    getBaseValue(){
        return this.baseValue;
    }
    
    /**
     * Get the product of the base attribute value and the Monster's current Form modifier
     * @return {int} - The form value
     */
    getFormValue(){
        return Math.floor(this.baseValue * this.owner.curForm.modifier[this.name])
    }
    
    /**
     * Get the sum of the Form value and any Attribute modifications due to active Effects
     * @return {int} - The final value
     */
    getFinalValue(){
        let formValue = this.getFormValue();
        this.owner.effects.forEach(function(effect){
            if(effect["modifier" + this.name]){
                formValue += effect["modifier" + this.name];
            }
        });
        return formValue;
    }
    
    /**
     * Used for exporting Attribute data to the client
     * @return {int} - The final value
     */
    exportData(){
        return this.getFinalValue();
    }
}

module.exports = Attribute;