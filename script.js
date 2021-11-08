var currentEXP;

var currentDamageRate;
var baseDamageRate;

var slimesKilled;
var maxSlimeHealth;
var currentSlimeHealth;
const BaseSlimeHealth = 10;
var slimeEXP;
const BaseSlimeEXP = 1;

var attackDamage;
const BaseAttackDamage = 10;

var finchCount;
var finchCost;
const BaseFinchCost = 20;
var totalFinchDamageRate;
var finchDamageRate;
const BaseFinchDamageRate = 1;

var expCounterDisplay = document.getElementById('exp-counter-hdr');
var currentSlimeHPCounterDisplay = document.getElementById('current-slime-hp-hdr')
var damageRateCounterDisplay = document.getElementById('damage-rate-hdr');
var slimeHPCounterDisplay = document.getElementById('slime-hp-hdr');
var slimeEXPCounterDisplay = document.getElementById('slime-exp-hdr');

var attackInfoDisplay = document.getElementById('attack-info-p');

var finchCounterDisplay = document.getElementById('finch-count-p');
var finchCostDisplay = document.getElementById('finch-cost-p');
var finchInfoDisplay = document.getElementById('finch-info-p');

var attackButton = document.getElementById('attack-btn');
var finchButton = document.getElementById('finch-btn');

window.addEventListener('load', function(){
    initData()
})

attackButton.addEventListener('click', function(){
    attackSlime()
});
finchButton.addEventListener('click', function(){
    purchaseFinch()
});

setInterval(function(){
    autoDamageSlime();
}, 10);

function initData() {
    currentEXP = 0;
    slimesKilled = 0;
    finchCount = 0;
    updateAllStats();
}

function attackSlime() {
    currentSlimeHealth -= attackDamage;
}

function autoDamageSlime() {
    currentSlimeHealth -= currentDamageRate / 100;
    if(currentSlimeHealth <= 0){
        killSlime();
    }
    updateDisplay();
}

function killSlime() {
    slimesKilled++;
    currentEXP += slimeEXP;
    updateSlimeStats();
}

function purchaseFinch() {
    if(currentEXP >= finchCost){
        finchCount++;
        currentEXP -= finchCost;
        updateFinchStats();
        updateDamageStats();
    }
}

function updateAllStats(){
    updateSlimeStats();
    updateAttackStats();
    updateFinchStats();
    updateDamageStats();

    updateDisplay();
}

function updateSlimeStats(){
    maxSlimeHealth = BaseSlimeHealth * Math.floor(Math.log2(slimesKilled + 2));
    currentSlimeHealth = maxSlimeHealth;
    slimeEXP = BaseSlimeEXP * Math.floor(Math.sqrt(maxSlimeHealth / BaseSlimeHealth));
}

function updateAttackStats(){
    attackDamage = BaseAttackDamage;
}

function updateFinchStats(){
    finchCost = Math.floor(BaseFinchCost * Math.pow(1.15, finchCount));
    finchDamageRate = BaseFinchDamageRate;
    totalFinchDamageRate = finchCount * finchDamageRate;
}

function updateDamageStats(){
    baseDamageRate = totalFinchDamageRate;
    currentDamageRate = baseDamageRate;
}

function updateDisplay(){
    expCounterDisplay.innerText = `${currentEXP} EXP`;
    currentSlimeHPCounterDisplay.innerText = `${Math.ceil(currentSlimeHealth)} HP for Current Slime`
    damageRateCounterDisplay.innerText = `${currentDamageRate} Damage/Sec`;
    slimeHPCounterDisplay.innerText = `${maxSlimeHealth} HP/Slime`;
    slimeEXPCounterDisplay.innerText = `${slimeEXP} EXP/Slime`;
    
    attackInfoDisplay.innerText = `${attackDamage} Damage/Attack`;
    
    finchCounterDisplay.innerText = `${finchCount} Finches for ${totalFinchDamageRate} Damage/Sec`;
    finchCostDisplay.innerText = `${finchCost} EXP/Finch`;
    finchInfoDisplay.innerText = `${finchDamageRate} Damage/Sec Each`;
}