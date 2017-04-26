const classAbility = require("./Ability");

/**
 * Represents a single Form the belongs to a monster
 * @PARAM {Monster object} owner - The Monster this Form is attached to
 * @PARAM {int} formId - The ID of the Form to instantiate
 */
class Form
{
    constructor(owner, formId){
        let reference = global.Bestiary.forms[formId];
        this.id = formId;
        this.name = reference.name;
        this.owner = owner;
        this.modifier = reference.attributes;
        this.abilities = this.initializeAbilities(reference.abilities);
    }
    
    /**
     * Instantiate the Abilities associated with this Form
     * @return {array} - Array of Ability objects
     */
    initializeAbilities(abilityIds){
        let abilities = [];
        abilityIds.forEach(function(abilityId){
            abilities.push(new classAbility(this.owner, abilityId));
        }, this);
        return abilities;
    }
    
    /**
     * Used for exporting Form data to the client
     * @return {object} - Representation of this Form's current state
     */
    exportData(){
        let abilities = [];
        this.abilities.forEach(function(ability){
            abilities.push(ability.exportData());
        }, this);
        
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            abilities: abilities,
        };
    }
}

module.exports = Form;