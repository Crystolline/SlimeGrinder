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
var attackRadius;
const BaseAttackRadius = 0;

var expCounterDisplay = document.getElementById('exp-counter-hdr');
var currentSlimeHPCounterDisplay = document.getElementById('current-slime-hp-hdr')
var damageRateCounterDisplay = document.getElementById('damage-rate-hdr');
var slimeHPCounterDisplay = document.getElementById('slime-hp-hdr');
var slimeEXPCounterDisplay = document.getElementById('slime-exp-hdr');

var attackInfoDisplay = document.getElementById('attack-info-p');

var dartUnit = new Unit('Dart', 0, 20, 5, document.getElementById('dart-btn'));
var finchUnit = new Unit('Finch', 0, 100, 40, document.getElementById('finch-btn'));
var mercUnit = new Unit('Merc', 0, 600, 200, document.getElementById('merc-btn'));
var mageUnit = new Unit('Mage', 0, 1500, 600, document.getElementById('mage-btn'));
var bomberUnit = new Unit('Bomber', 0, 5000, 2000, document.getElementById('bomber-btn'));

var attackCanvas = document.getElementById('attack-canvas');
attackCanvas.onselectstart = function () {
    return false;
}

var slimeRadius;
const baseSlimeRadius = 30;

var canvasSlimes = [];
var timeToNextSpawn;
const baseTimeToNextSpawn = 1000;
var spawnQueued = false;
var maxSlimesOnCanvas;
const baseMaxSlimesOnCanvas = 1;

window.addEventListener('load', function(){
    initData()
    currentSlimeHealth = maxSlimeHealth;
    spawnCanvasSlime();
})

attackCanvas.addEventListener('click', function(event){
    var rect = attackCanvas.getBoundingClientRect();
    var clickPosX = event.clientX - rect.left;
    var clickPosY = event.clientY - rect.top;
    for(let i = canvasSlimes.length - 1; i >= 0; i--) {
        if(Math.pow(clickPosX - canvasSlimes[i].posX, 2) + Math.pow(clickPosY - canvasSlimes[i].posY, 2) <= Math.pow(canvasSlimes[i].radius + attackRadius, 2)){
            canvasSlimes[i].attack();
            if(canvasSlimes[i].health <= 0){
                canvasSlimes[i].kill();
                canvasSlimes.splice(i, 1);
                if(spawnQueued){
                    spawnCanvasSlime();
                }
            }
            drawSlimes();
        }
    }
})

function spawnCanvasSlime(){
    if(canvasSlimes.length < maxSlimesOnCanvas) {
        let newPosX = Math.floor(Math.random() * (attackCanvas.width - 2 * slimeRadius - 2) + slimeRadius + 1);
        let newPosY = Math.floor(Math.random() * (attackCanvas.height - 2 * slimeRadius - 2) + slimeRadius + 1);
        canvasSlimes.push(new CanvasSlime(maxSlimeHealth, slimeEXP, newPosX, newPosY, slimeRadius));
        drawSlimes();
        spawnQueued = false;
        timeToNextSpawn = baseTimeToNextSpawn;
        setTimeout(spawnCanvasSlime, timeToNextSpawn);
    } else {
        spawnQueued = true;
    }
}

function drawSlimes(){
    var context = attackCanvas.getContext('2d');
    context.clearRect(0, 0, attackCanvas.width, attackCanvas.height);
    canvasSlimes.forEach(element => {
        element.draw(context);
    });
}

setInterval(function(){
    updateDamageStats();
    autoDamageSlime();
}, 10);

function initData() {
    currentEXP = 0;
    slimesKilled = 0;
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
    currentSlimeHealth = maxSlimeHealth;
}

function updateAllStats(){
    updateSlimeStats();
    updateAttackStats();
    updateDamageStats();

    updateDisplay();
}

function updateSlimeStats(){
    maxSlimeHealth = BaseSlimeHealth * Math.floor(Math.log2(slimesKilled + 2));
    slimeEXP = BaseSlimeEXP * Math.floor(Math.sqrt(maxSlimeHealth / BaseSlimeHealth));
    slimeRadius = baseSlimeRadius;
    maxSlimesOnCanvas = baseMaxSlimesOnCanvas;
}

function updateAttackStats(){
    attackDamage = BaseAttackDamage;
    attackRadius = BaseAttackRadius;
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
    
    attackInfoDisplay.innerText = `${attackDamage} Damage/Attack`;
}