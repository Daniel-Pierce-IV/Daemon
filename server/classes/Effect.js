/**
 * Represents a single Effect
 */
class Effect
{
    constructor(){}
    
    applyToMonster(){}
}

class ImmediateEffect extends Effect
{
    constructor(effectId){
        super(effectId);
        let reference = Bestiary.effects[effectId];
        this.damage = reference.damage;
        this.healing = reference.healing;
        this.lifeSteal = reference.lifeSteal; //represented as a float
        this.isPhysical = reference.isPhysical;
    }
    
    /**
     * Check all properties, and apply logic to the target Monsters
     * @PARAM {Monster} - The owning Monster of this Effect
     * @PARAM {Monster} - The target Monster to receive this Effect
     */
    applyToMonster(owner, target){
        let damageDealt;
        let healingDealt;
        if(this.damage){
            let statModifier = this.getStatModifier;
            damageDealt = target.damage(this.damage * statModifier);
        }
        if(this.lifeSteal){
            healingDealt = owner.heal(Math.floor(this.lifeSteal * damageDealt));
        }
        if(this.healing){
            healingDealt = owner.heal(this.healing);
        }
    }
    
    /**
     * Get the stat modifier for damage calculation
     * @PARAM {Monster} - The owning Monster of this Effect
     */
    getStatModifier(owner){
        return owner.dealDamage(this.isPhysical);
    }
    
//    modifyEffectMagnitude(statModifier){
//        return 
//    }
}

//class DurationEffect extends ImmediateEffect
//{
//    constructor(reference){
//        super(reference);
//        this.baseStatToModify = reference.baseStatToModify; //(string of attribute) "VIT"
//        this.baseStatModifier = reference.baseStatModifier; //(int) 5 or (float) 1.75
//        this.duration = reference.duration; //(number of turns, as int) 1
//    }
//}
//
//class ActivationEffect extends DurationEffect
//{
//    constructor(reference){
//        super(reference);
//        this.triggerType = "damage";
//        this.trigerOnTargetType = "self and allies";
//    }
//}
//
//class PermanentEffect extends Effect
//{
//    constructor(){
//        super();
//    }
//}

//module.exports = Effect;
module.exports = ImmediateEffect;