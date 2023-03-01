from ball import *

# LOOP
while not EXIT:
    # Input
    keys = pg.key.get_pressed()

    # Exit
    for event in pg.event.get():
        if event.type == pg.QUIT or keys[pg.K_ESCAPE]:
            EXIT = True

    # Draw background (and clear screen)
    app.fill(backgroundColor)

    # Balls
    Ball.collide()
    for ball in balls:
        ball.doBorderCollision()
        ball.move()
        ball.draw()
 
    # Misc
    pg.display.update()
    pg.time.Clock().tick(120)