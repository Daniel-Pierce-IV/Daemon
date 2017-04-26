/**
 * Temporary storage of game data relating Monsters
 */
class Bestiary
{
    constructor(){
        this.forms = [
            {
                name: "Dragon",
                description: "Deals powerful attacks, breathes fire, pretty all right defense, fairly quick, attends local Renaissance Faires.",
                attributes: {
                    VIT: 4,
                    STR: 5,
                    END: 3,
                    INT: 2,
                    WIL: 1,
                    AGI: 3,
                },
                abilities: [
                    0,
                    3
                ]
            },
            {
                name: "Treant",
                description: "Slow-poke, very defensive, stills hits fairly hard, tired of hearing that he makes a better door than a window.",
                attributes: {
                    VIT: 5,
                    STR: 2,
                    END: 5,
                    INT: 1,
                    WIL: 4,
                    AGI: 1,
                },
                abilities: [
                    0
                ]
            },
            {
                name: "Leviathan",
                description: "Extremely speedy, low strength and endurance, good sense of humor.",
                attributes: {
                    VIT: 3,
                    STR: 3,
                    END: 2,
                    INT: 2,
                    WIL: 2,
                    AGI: 5,
                },
                abilities: [
                    0,
                    1
                ]
            },
            {
                name: "Phoenix",
                description: "Known for it's healing ability, the life of the party, puntual, not the best in combat, always tryna blaze up.",
                attributes: {
                    VIT: 3,
                    STR: 1,
                    END: 1,
                    INT: 4,
                    WIL: 3,
                    AGI: 4,
                },
                abilities: [
                    2,
                    3
                ]
            },
            {
                name: "Quetzalcoatl",
                description: "A real team-player, aesthetically pleasing wings, low-medium speed and defense, enjoys alone time in deserts.",
                attributes: {
                    VIT: 2,
                    STR: 2,
                    END: 2,
                    INT: 2,
                    WIL: 3,
                    AGI: 3,
                },
                abilities: [
                    3
                ]
            },
            {
                name: "Wraith",
                description: "Spreads negativity, medium strength, low defense and self confidence, 2spooky.",
                attributes: {
                    VIT: 1,
                    STR: 1,
                    END: 4,
                    INT: 3,
                    WIL: 2,
                    AGI: 2,
                },
                abilities: [
                    1,
                    4
                ]
            },
        ];
        
        this.abilities = [
            {
                name: "Strike",
                description: "A physical attack.",
                targetType: "enemy",
//                isPhysical: true,
                uses: 15,
                effects: [0]
            },
            {
                name: "Sucker Punch",
                description: "Bypasses physical defense of the target.",
                targetType: "enemy",
//                isPhysical: true,
                uses: 5,
                effects: [1]
            },
            {
                name: "Heal",
                description: "Restores health to the target.",
                targetType: "ally",
                uses: 10,
                effects: [2]
            },
            {
                name: "Fireball",
                description: "Damage the enemy with flames.",
                targetType: "enemy",
                uses: 10,
                effects: [3]
            },
            {
                name: "Soul Drain",
                description: "Use enemy's soul to heal yourself.",
                targetType: "enemy",
                uses: 10,
                effects: [3]
            },
        ];
        
        this.effects = [
            {
                damage: 25,
                isPhysical: true,
                ignoreDefense: false,
            },
            {
                damage: 15,
                isPhysical: true,
                ignoreDefense: true,
            },
            {
                healing: 40,
                isPhysical: false,
                ignoreDefense: false,
            },
            {
                damage: 20,
                isPhysical: false,
                ignoreDefense: false,
            },
            {
                damage: 15,
                lifeSteal: 0.5,
                isPhysical: false,
                ignoreDefense: false,
            },
        ];
    }
    
    /**
     * Used for exporting default Form data to the client
     * @return {array} - An array of representational Form objects
     */
    exportForms(){
        let forms = [];
        this.forms.forEach(function(form){
            let curForm = {};
            curForm.name = form.name;
            curForm.description = form.description;
            curForm.attributes = form.attributes;
            curForm.abilities = [];
            
            form.abilities.forEach(function(ability){
                curForm.abilities.push(this.abilities[ability]);
            }, this);
            
            forms.push(curForm);
        }, this);
        
        return forms;
    }
}

//TODO: instantiate this AFTER importing
module.exports = new Bestiary;