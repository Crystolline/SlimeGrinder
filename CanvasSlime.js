class CanvasSlime {
    constructor(health, exp, posX, posY, radius){
        this.health = health;
        this.exp = exp;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }

    attack(damage) {
        this.health -= damage;
    }

    kill() {
        slimesKilled++;
        currentEXP += this.exp;
        updateSlimeStats();
    }

    draw(context){
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
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
        context.fillText(`${this.health}`, this.posX, this.posY, this.radius * 2);
    }
}