var currentEXP;

var currentDamageRate;
var baseDamageRate;

var slimesKilled;
var maxSlimeHealth;
var currentSlimeHealth;
const BaseSlimeHealth = 10;
var slimeEXP;
const BaseSlimeEXP = 1;

var expCounterDisplay = document.getElementById('exp-counter-hdr');
var currentSlimeHPCounterDisplay = document.getElementById('current-slime-hp-hdr')
var damageRateCounterDisplay = document.getElementById('damage-rate-hdr');
var slimeHPCounterDisplay = document.getElementById('slime-hp-hdr');
var slimeEXPCounterDisplay = document.getElementById('slime-exp-hdr');

var dartUnit = new Unit('Dart', 0, 20, 5, document.getElementById('dart-btn'));
var finchUnit = new Unit('Finch', 0, 100, 40, document.getElementById('finch-btn'));
var mercUnit = new Unit('Merc', 0, 600, 200, document.getElementById('merc-btn'));
var mageUnit = new Unit('Mage', 0, 1500, 600, document.getElementById('mage-btn'));
var bomberUnit = new Unit('Bomber', 0, 5000, 2000, document.getElementById('bomber-btn'));

var slimeCanvas;

window.addEventListener('load', function(){
    initData()
    currentSlimeHealth = maxSlimeHealth;
    slimeCanvas = new SlimeCanvas(document.getElementById('attack-canvas'), 10, 0, 1, 1000, 10, 100, 100, 100, 100, 0, 0, 0, 0, document.getElementById('damage-btn'), document.getElementById('radius-btn'), document.getElementById('max-slimes-btn'), document.getElementById('spawn-rate-btn'), 30);
})

setInterval(function(){
    updateDamageStats();
    autoDamageSlime();
}, 10);

function initData() {
    currentEXP = 0;
    slimesKilled = 0;
    updateAllStats();
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
    currentSlimeHealth = maxSlimeHealth;
}

function updateAllStats(){
    updateSlimeStats();
    updateDamageStats();

    updateDisplay();
}

function updateSlimeStats(){
    maxSlimeHealth = BaseSlimeHealth * Math.floor(Math.log2(slimesKilled + 2));
    slimeEXP = BaseSlimeEXP * Math.floor(Math.log2(maxSlimeHealth / BaseSlimeHealth) + 1);
}

function updateDamageStats(){
    baseDamageRate = dartUnit.totalDamageRate + finchUnit.totalDamageRate + mercUnit.totalDamageRate + mageUnit.totalDamageRate + bomberUnit.totalDamageRate;
    currentDamageRate = baseDamageRate;
}

function updateDisplay(){
    expCounterDisplay.innerText = `${currentEXP} EXP`;
    currentSlimeHPCounterDisplay.innerText = `${Math.ceil(currentSlimeHealth)} HP for Current Slime`
    damageRateCounterDisplay.innerText = `${currentDamageRate} Damage/Sec`;
    slimeHPCounterDisplay.innerText = `${maxSlimeHealth} HP/Slime`;
    slimeEXPCounterDisplay.innerText = `${slimeEXP} EXP/Slime`;
}