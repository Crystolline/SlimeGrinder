class SlimeCanvas {
    constructor(canvas, baseDamage, baseRadius, baseMaxSlimes, baseSpawnRate, radiusMultiplier, baseDamageUpgradeCost, baseRadiusUpgradeCost, baseMaxSlimesUpgradeCost, baseSpawnRateUpgradeCost, damageUpgrades, radiusUpgrades, maxSlimesUpgrades, spawnRateUpgrades, damageButton, radiusButton, maxSlimesButton, spawnRateButton, slimeRadius){
        this.canvas = canvas;
        canvas.onselectstart = function () {
            return false;
        }

        this.baseDamage = baseDamage;
        this.baseRadius = baseRadius;
        this.baseMaxSlimes = baseMaxSlimes;
        this.baseSpawnRate = baseSpawnRate;
        this.slimeRadius = slimeRadius;
        this.radiusMultiplier = radiusMultiplier;

        this.baseDamageUpgradeCost = baseDamageUpgradeCost;
        this.baseRadiusUpgradeCost = baseRadiusUpgradeCost;
        this.baseMaxSlimesUpgradeCost = baseMaxSlimesUpgradeCost;
        this.baseSpawnRateUpgradeCost = baseSpawnRateUpgradeCost;

        this.damageUpgrades = damageUpgrades;
        this.radiusUpgrades = radiusUpgrades;
        this.maxSlimesUpgrades = maxSlimesUpgrades;
        this.spawnRateUpgrades = spawnRateUpgrades;

        this.damageButton = damageButton;
        this.radiusButton = radiusButton;
        this.maxSlimesButton = maxSlimesButton;
        this.spawnRateButton = spawnRateButton;

        this.canvasSlimes = [];
        this.damage = this.baseDamage * Math.pow(2, this.damageUpgrades);
        this.radius = this.baseRadius + this.radiusMultiplier * this.radiusUpgrades;
        this.maxSlimes = this.baseMaxSlimes + this.maxSlimesUpgrades;
        this.spawnRate = this.baseSpawnRate * Math.pow(.5, this.spawnRateUpgrades);
        this.timeToNextSpawn = this.spawnRate;
        this.spawnQueued = false;

        this.damageUpgradeCost = this.baseDamageUpgradeCost * Math.pow(4, this.damageUpgrades);
        this.radiusUpgradeCost = this.baseRadiusUpgradeCost * Math.pow(4, this.radiusUpgrades);
        this.maxSlimesUpgradeCost = this.baseMaxSlimesUpgradeCost * Math.pow(4, this.maxSlimesUpgrades);
        this.spawnRateUpgradeCost = this.baseSpawnRateUpgradeCost * Math.pow(4, this.spawnRateUpgrades);

        this.canvas.addEventListener('click', (event) => this.AttackSlimes(event));

        this.damageButton.addEventListener('click', () => this.UpgradeDamage());
        this.radiusButton.addEventListener('click', () => this.UpgradeRadius());
        this.maxSlimesButton.addEventListener('click', () => this.UpgradeMaxSlimes());
        this.spawnRateButton.addEventListener('click', () => this.UpgradeSpawnRate());
        this.spawnCanvasSlime();
        this.UpdateUpdateButtons();
    }

    AttackSlimes(event){
        var rect = this.canvas.getBoundingClientRect();
        var clickPosX = event.clientX - rect.left;
        var clickPosY = event.clientY - rect.top;
        for(let i = this.canvasSlimes.length - 1; i >= 0; i--) {
            if(Math.pow(clickPosX - this.canvasSlimes[i].posX, 2) + Math.pow(clickPosY - this.canvasSlimes[i].posY, 2) <= Math.pow(this.canvasSlimes[i].radius + this.radius, 2)){
                this.canvasSlimes[i].attack(this.damage);
                if(this.canvasSlimes[i].health <= 0){
                    this.canvasSlimes[i].kill();
                    this.canvasSlimes.splice(i, 1);
                    if(this.spawnQueued){
                        this.spawnCanvasSlime();
                    }
                    else if(this.timeToNextSpawn - ((new Date()).getTime() - this.timeoutStartTime) > this.spawnRate * Math.pow(5, this.canvasSlimes.length - 1)){
                        clearTimeout(this.timeout);
                        this.timeToNextSpawn = this.spawnRate * Math.pow(5, this.canvasSlimes.length - 1);
                        this.timeout = setTimeout(this.spawnCanvasSlime.bind(this), this.timeToNextSpawn);
                    }
                }
                this.drawSlimes();
            }
        }
    }

    spawnCanvasSlime(){
        if(this.canvasSlimes.length < this.maxSlimes) {
            let newPosX = Math.floor(Math.random() * (this.canvas.width - 2 * this.slimeRadius - 2) + this.slimeRadius + 1);
            let newPosY = Math.floor(Math.random() * (this.canvas.height - 2 * this.slimeRadius - 2) + this.slimeRadius + 1);
            this.canvasSlimes.push(new CanvasSlime(maxSlimeHealth, slimeEXP, newPosX, newPosY, this.slimeRadius));
            this.drawSlimes();
            this.spawnQueued = false;
            this.timeToNextSpawn = this.spawnRate * Math.pow(5, this.canvasSlimes.length - 1);
            this.timeoutStartTime = (new Date()).getTime();
            this.timeout = setTimeout(this.spawnCanvasSlime.bind(this), this.timeToNextSpawn);
        } else {
            this.spawnQueued = true;
        }
    }

    drawSlimes(){
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasSlimes.forEach(element => {
            element.draw(context);
        });
    }

    UpgradeDamage(){
        if(currentEXP >= this.damageUpgradeCost){
            currentEXP -= this.damageUpgradeCost;
            this.damageUpgrades++;
            this.damageUpgradeCost = this.baseDamageUpgradeCost * Math.pow(4, this.damageUpgrades);
            this.damage = this.baseDamage * Math.pow(2, this.damageUpgrades);
            this.UpdateUpdateButtons();
        }
    }

    UpgradeRadius(){
        if(currentEXP >= this.radiusUpgradeCost){
            currentEXP -= this.radiusUpgradeCost;
            this.radiusUpgrades++;
            this.radiusUpgradeCost = this.baseRadiusUpgradeCost * Math.pow(4, this.radiusUpgrades);
            this.radius = this.baseRadius + this.radiusMultiplier * this.radiusUpgrades;
            this.UpdateUpdateButtons();
        }
    }

    UpgradeMaxSlimes(){
        if(currentEXP >= this.maxSlimesUpgradeCost){
            currentEXP -= this.maxSlimesUpgradeCost;
            this.maxSlimesUpgrades++;
            this.maxSlimesUpgradeCost = this.baseMaxSlimesUpgradeCost * Math.pow(4, this.maxSlimesUpgrades);
            this.maxSlimes = this.baseMaxSlimes + this.maxSlimesUpgrades;
            if(this.spawnQueued){
                this.spawnCanvasSlime();
            }
            this.UpdateUpdateButtons();
        }
    }

    UpgradeSpawnRate(){
        if(currentEXP >= this.spawnRateUpgradeCost){
            currentEXP -= this.spawnRateUpgradeCost;
            this.spawnRateUpgrades++;
            this.spawnRateUpgradeCost = this.baseSpawnRateUpgradeCost * Math.pow(4, this.spawnRateUpgrades);
            this.spawnRate = this.baseSpawnRate * Math.pow(.5, this.spawnRateUpgrades);
            if(this.timeToNextSpawn - ((new Date()).getTime() - this.timeoutStartTime) > this.spawnRate * Math.pow(5, this.canvasSlimes.length - 1)){
                clearTimeout(this.timeout);
                this.timeToNextSpawn = this.spawnRate * Math.pow(5, this.canvasSlimes.length - 1);
                this.timeout = setTimeout(this.spawnCanvasSlime.bind(this), this.timeToNextSpawn);
            }
            this.UpdateUpdateButtons();
        }
    }

    UpdateUpdateButtons(){
        this.damageButton.innerText = `${this.damage} damage / attack — ${this.damageUpgradeCost} EXP for *2 damage`;
        this.radiusButton.innerText = `${this.radius} pixel attack radius — ${this.radiusUpgradeCost} EXP for +10 pixels`;
        this.maxSlimesButton.innerText = `${this.maxSlimes} max slimes — ${this.maxSlimesUpgradeCost} EXP for +1 max slime`;
        this.spawnRateButton.innerText = `${this.spawnRate / 1000} second(s) to spawn 1st slime — ${this.spawnRateUpgradeCost} EXP for *2 spawn rate`;
    }
}