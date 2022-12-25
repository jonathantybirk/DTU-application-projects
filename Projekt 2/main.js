// Loop
function loop(now) {
    // Screen refresh
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Camera
    camera.update();

    // Stars
    stars.draw()

    // Bodies
    Body.doGravity();
    for (body of bodies) body.move();
    for (body of bodies) body.draw();

    // Rocket
    Rocket.doGravity();
    Rocket.enforceBorder();
    Rocket.land();
    Rocket.control();
    Rocket.move();
    Rocket.draw();

    // Map
    map.draw();

    // UI
    UI.convert();
    UI.update();
    UI.draw();

    // Loop
    liberateFramerate(now);
    window.requestAnimationFrame(loop);
}

// Initialization
log();
window.requestAnimationFrame(loop);