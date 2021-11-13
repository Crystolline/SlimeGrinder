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

var dartCount;
var dartCost;
const BaseDartCost = 20;
var totalDartDamageRate;
var dartDamageRate;
const BaseDartDamageRate = 5;

var finchCount;
var finchCost;
const BaseFinchCost = 100;
var totalFinchDamageRate;
var finchDamageRate;
const BaseFinchDamageRate = 40;

var mercCount;
var mercCost;
const BaseMercCost = 600;
var totalMercDamageRate;
var mercDamageRate;
const BaseMercDamageRate = 200;

var mageCount;
var mageCost;
const BaseMageCost = 1500;
var totalMageDamageRate;
var mageDamageRate;
const BaseMageDamageRate = 600;

var bomberCount;
var bomberCost;
const BaseBomberCost = 5000;
var totalBomberDamageRate;
var bomberDamageRate;
const BaseBomberDamageRate = 2000;

var expCounterDisplay = document.getElementById('exp-counter-hdr');
var currentSlimeHPCounterDisplay = document.getElementById('current-slime-hp-hdr')
var damageRateCounterDisplay = document.getElementById('damage-rate-hdr');
var slimeHPCounterDisplay = document.getElementById('slime-hp-hdr');
var slimeEXPCounterDisplay = document.getElementById('slime-exp-hdr');

var attackInfoDisplay = document.getElementById('attack-info-p');

var dartCounterDisplay = document.getElementById('dart-count-p');
var dartCostDisplay = document.getElementById('dart-cost-p');
var dartInfoDisplay = document.getElementById('dart-info-p');

var finchCounterDisplay = document.getElementById('finch-count-p');
var finchCostDisplay = document.getElementById('finch-cost-p');
var finchInfoDisplay = document.getElementById('finch-info-p');

var mercCounterDisplay = document.getElementById('merc-count-p');
var mercCostDisplay = document.getElementById('merc-cost-p');
var mercInfoDisplay = document.getElementById('merc-info-p');

var mageCounterDisplay = document.getElementById('mage-count-p');
var mageCostDisplay = document.getElementById('mage-cost-p');
var mageInfoDisplay = document.getElementById('mage-info-p');

var bomberCounterDisplay = document.getElementById('bomber-count-p');
var bomberCostDisplay = document.getElementById('bomber-cost-p');
var bomberInfoDisplay = document.getElementById('bomber-info-p');

var dartButton = document.getElementById('dart-btn');
var finchButton = document.getElementById('finch-btn');
var mercButton = document.getElementById('merc-btn');
var mageButton = document.getElementById('mage-btn');
var bomberButton = document.getElementById('bomber-btn');

var attackCanvas = document.getElementById('attack-canvas');
attackCanvas.onselectstart = function () {
    return false;
}

var slimeRadius;
const baseSlimeRadius = 30;

class CanvasSlime {
    constructor(health, exp, posX, posY, radius){
        this.health = health;
        this.exp = exp;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }

    attack() {
        this.health -= attackDamage;
    }

    kill() {
        slimesKilled++;
        currentEXP += this.exp;
        updateSlimeStats();
    }
}

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
        context.beginPath();
        context.arc(element.posX, element.posY, element.radius, 0, 2 * Math.PI);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#003300';
        context.stroke();
        context.closePath();
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '24pt serif'
        context.fillStyle = 'white';
        context.fillText(`${element.health}`, element.posX, element.posY, element.radius * 2);
    });
}

dartButton.addEventListener('click', function(){
    purchaseDart()
});
finchButton.addEventListener('click', function(){
    purchaseFinch()
});
mercButton.addEventListener('click', function(){
    purchaseMerc()
});
mageButton.addEventListener('click', function(){
    purchaseMage()
});
bomberButton.addEventListener('click', function(){
    purchaseBomber()
});

setInterval(function(){
    autoDamageSlime();
}, 10);

function initData() {
    currentEXP = 0;
    slimesKilled = 0;
    dartCount = 0;
    finchCount = 0;
    mercCount = 0;
    mageCount = 0;
    bomberCount = 0;
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

function purchaseDart() {
    if(currentEXP >= dartCost){
        dartCount++;
        currentEXP -= dartCost;
        updateDartStats();
        updateDamageStats();
    }
}

function purchaseFinch() {
    if(currentEXP >= finchCost){
        finchCount++;
        currentEXP -= finchCost;
        updateFinchStats();
        updateDamageStats();
    }
}

function purchaseMerc() {
    if(currentEXP >= mercCost){
        mercCount++;
        currentEXP -= mercCost;
        updateMercStats();
        updateDamageStats();
    }
}

function purchaseMage() {
    if(currentEXP >= mageCost){
        mageCount++;
        currentEXP -= mageCost;
        updateMageStats();
        updateDamageStats();
    }
}

function purchaseBomber() {
    if(currentEXP >= bomberCost){
        bomberCount++;
        currentEXP -= bomberCost;
        updateBomberStats();
        updateDamageStats();
    }
}

function updateAllStats(){
    updateSlimeStats();
    updateAttackStats();
    updateDartStats();
    updateFinchStats();
    updateMercStats();
    updateMageStats();
    updateBomberStats();
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

function updateDartStats(){
    dartCost = Math.floor(BaseDartCost * Math.pow(1.15, dartCount));
    dartDamageRate = BaseDartDamageRate;
    totalDartDamageRate = dartCount * dartDamageRate;
}

function updateFinchStats(){
    finchCost = Math.floor(BaseFinchCost * Math.pow(1.15, finchCount));
    finchDamageRate = BaseFinchDamageRate;
    totalFinchDamageRate = finchCount * finchDamageRate;
}

function updateMercStats(){
    mercCost = Math.floor(BaseMercCost * Math.pow(1.15, mercCount));
    mercDamageRate = BaseMercDamageRate;
    totalMercDamageRate = mercCount * mercDamageRate;
}

function updateMageStats(){
    mageCost = Math.floor(BaseMageCost * Math.pow(1.15, mageCount));
    mageDamageRate = BaseMageDamageRate;
    totalMageDamageRate = mageCount * mageDamageRate;
}

function updateBomberStats(){
    bomberCost = Math.floor(BaseBomberCost * Math.pow(1.15, bomberCount));
    bomberDamageRate = BaseBomberDamageRate;
    totalBomberDamageRate = bomberCount * bomberDamageRate;
}

function updateDamageStats(){
    baseDamageRate = totalDartDamageRate + totalFinchDamageRate + totalMercDamageRate + totalMageDamageRate + totalBomberDamageRate;
    currentDamageRate = baseDamageRate;
}

function updateDisplay(){
    expCounterDisplay.innerText = `${currentEXP} EXP`;
    currentSlimeHPCounterDisplay.innerText = `${Math.ceil(currentSlimeHealth)} HP for Current Slime`
    damageRateCounterDisplay.innerText = `${currentDamageRate} Damage/Sec`;
    slimeHPCounterDisplay.innerText = `${maxSlimeHealth} HP/Slime`;
    slimeEXPCounterDisplay.innerText = `${slimeEXP} EXP/Slime`;
    
    attackInfoDisplay.innerText = `${attackDamage} Damage/Attack`;
    
    dartCounterDisplay.innerText = `${dartCount} Darts for ${totalDartDamageRate} Damage/Sec`;
    dartCostDisplay.innerText = `${dartCost} EXP/Dart`;
    dartInfoDisplay.innerText = `${dartDamageRate} Damage/Sec Each`;
    
    finchCounterDisplay.innerText = `${finchCount} Finches for ${totalFinchDamageRate} Damage/Sec`;
    finchCostDisplay.innerText = `${finchCost} EXP/Finch`;
    finchInfoDisplay.innerText = `${finchDamageRate} Damage/Sec Each`;
    
    mercCounterDisplay.innerText = `${mercCount} Mercs for ${totalMercDamageRate} Damage/Sec`;
    mercCostDisplay.innerText = `${mercCost} EXP/Merc`;
    mercInfoDisplay.innerText = `${mercDamageRate} Damage/Sec Each`;
    
    mageCounterDisplay.innerText = `${mageCount} Mages for ${totalMageDamageRate} Damage/Sec`;
    mageCostDisplay.innerText = `${mageCost} EXP/Mage`;
    mageInfoDisplay.innerText = `${mageDamageRate} Damage/Sec Each`;
    
    bomberCounterDisplay.innerText = `${bomberCount} Bombers for ${totalBomberDamageRate} Damage/Sec`;
    bomberCostDisplay.innerText = `${bomberCost} EXP/Bomber`;
    bomberInfoDisplay.innerText = `${bomberDamageRate} Damage/Sec Each`;
}