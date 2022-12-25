class Body {
    constructor(name,color,radius,mass,position,velocity) {
        this.n = name;
        this.c = color;
        this.r = radius;
        this.m = mass;
        this.p = position;
        this.v = velocity;
    }
    static {
        this.abVector = [];
        this.abVectorLength;
        this.abVectorNormalized = [];
        this.gravitationalForce;
    }
    static doGravity() {
        for (var a = 0; a < bodies.length; a++) for (var b = a + 1; b < bodies.length; b++) {
            // calculate force
            this.abVector = [bodies[b].p[0] - bodies[a].p[0], bodies[b].p[1] - bodies[a].p[1]];
            this.abVectorLength = (this.abVector[0] ** 2 + this.abVector[1] ** 2) ** (1/2);
            this.abVectorNormalized[0] = this.abVector[0] / this.abVectorLength;
            this.abVectorNormalized[1] = this.abVector[1] / this.abVectorLength;
            this.gravitationalForce = gravitationalConstant * bodies[a].m * bodies[b].m / (this.abVector[0] ** 2 + this.abVector[1] ** 2);
    
            // update velocities
            bodies[a].v[0] += (this.abVectorNormalized[0] * this.gravitationalForce / bodies[a].m) * deltaTime;
            bodies[a].v[1] += (this.abVectorNormalized[1] * this.gravitationalForce / bodies[a].m) * deltaTime;
            bodies[b].v[0] -= (this.abVectorNormalized[0] * this.gravitationalForce / bodies[b].m) * deltaTime;
            bodies[b].v[1] -= (this.abVectorNormalized[1] * this.gravitationalForce / bodies[b].m) * deltaTime;                
        }
    }
    move() {
        this.p[0] += this.v[0] * deltaTime;
        this.p[1] += this.v[1] * deltaTime;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(
            (this.p[0] - camera.p[0] - canvas.width / 2) / camera.zoomLevel + canvas.width / 2,
            (this.p[1] - camera.p[1] - canvas.height / 2) / camera.zoomLevel + canvas.height / 2, 
            this.r / camera.zoomLevel, 0, 2 * Math.PI
        );
        ctx.fillStyle = this.c;
        ctx.fill();
    }
}

var bodies = [
//  new Body(name, color, radius, mass, [xPosition, yPosition], [xVelocity, yVelocity]),
    new Body("Red Planet", "#dd8888", 2000, 250000, [0,0], [0,0]),
    new Body("Green Planet", "#88dd88", 400, 5000, [-12000,0], [0,-4]),
    new Body("Blue Planet", "#8888dd", 700, 10000, [0,-7000], [6.5,0]),
    new Body("Yellow Planet", "#dddd88", 200, 7000, [0,2500], [-11,0]),
    new Body("Dark Twin", "#888888", 300, 10000, [1500,10000], [-6,-6.5]),
    new Body("Light Twin", "#dddddd", 1000, 50000, [0,10000], [-6,0]),
];