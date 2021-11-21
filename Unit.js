class Unit {
    constructor(name, count, baseCost, baseDamageRate, button){
        this.name = name;
        this.count = count;
        this.baseCost = baseCost;
        this.baseDamageRate = baseDamageRate;
        this.button = button;

        this.button.addEventListener('click', () => this.purchaseUnit());

        this.updateStats();
    }
    
    purchaseUnit(){
        if(currentEXP >= this.cost){
            this.count++;
            currentEXP -= this.cost;
            this.updateStats();
        }
    }

    updateStats(){
        this.cost = Math.floor(this.baseCost * Math.pow(1.15, this.count));
        this.damageRate = this.baseDamageRate;
        this.totalDamageRate = this.count * this.damageRate;
        this.updateDisplay();
    }

    updateDisplay(){
        this.button.innerText = `${this.name}: ${this.count} – ${this.cost} EXP/${this.name}`;
        this.button.title = 
            `${this.cost} EXP/${this.name} 
${this.damageRate} Damage/Sec Each 
${this.totalDamageRate} Damage/Sec Overall`
    }
}
