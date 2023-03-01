from top import *

class Ball:
    def __init__(self,position,velocity,mass,radius,color):
        self.p = list(position)
        self.v = list(velocity)
        self.m = mass
        self.r = radius
        self.c = color
        

    def doBorderCollision(self):
        # left
        if self.p[0] - self.r < 0:
            self.p[0] = self.r
            self.v[0] = abs(self.v[0])
        # right
        if self.p[0] + self.r > appDim[0]:
            self.p[0] = appDim[0] - self.r
            self.v[0] = -abs(self.v[0])
        # top
        if self.p[1] - self.r < 0:
            self.p[1] = self.r
            self.v[1] = abs(self.v[1])
        # bottom
        if self.p[1] + self.r > appDim[1]:
            self.p[1] = appDim[1] - self.r
            self.v[1] = -abs(self.v[1])

    def collide():
        for a in range(len(balls)):
            for b in range(a + 1, len(balls)):
                abVector = [balls[b].p[0] - balls[a].p[0], balls[b].p[1] - balls[a].p[1]]
                abVectorLength = (abVector[0] ** 2 + abVector[1] ** 2) ** (1/2)
                if abVectorLength <= balls[a].r + balls[b].r:
                    # calculate normal and tangent unit vectors (to ball perimeters at point of collision)
                    abVectorNormalized = [abVector[0] / abVectorLength, abVector[1] / abVectorLength]
                    abVectorTangentNormalized = [-abVectorNormalized[1], abVectorNormalized[0]]

                    # calculate normal and tangent velocity scalars
                    balls[a].vNormal = balls[a].v[0] * abVectorNormalized[0] + balls[a].v[1] * abVectorNormalized[1]
                    balls[a].vTangent = balls[a].v[0] * abVectorTangentNormalized[0] + balls[a].v[1] * abVectorTangentNormalized[1]
                    balls[b].vNormal = balls[b].v[0] * abVectorNormalized[0] + balls[b].v[1] * abVectorNormalized[1]
                    balls[b].vTangent = balls[b].v[0] * abVectorTangentNormalized[0] + balls[b].v[1] * abVectorTangentNormalized[1]

                    # calculate normal velocity scalar after collision (tangent velocity is unchanged)
                    balls[a].vNormalNew = (balls[a].vNormal * (balls[a].m - balls[b].m) + 2 * balls[b].m * balls[b].vNormal) / (balls[a].m + balls[b].m)
                    balls[b].vNormalNew = (balls[b].vNormal * (balls[b].m - balls[a].m) + 2 * balls[a].m * balls[a].vNormal) / (balls[a].m + balls[b].m)

                    # calculate normal and tangent velocity vectors after collision
                    balls[a].vVectorNormal = [balls[a].vNormalNew * abVectorNormalized[0], balls[a].vNormalNew * abVectorNormalized[1]]
                    balls[a].vVectorTangent = [balls[a].vTangent * abVectorTangentNormalized[0], balls[a].vTangent * abVectorTangentNormalized[1]]
                    balls[b].vVectorNormal = [balls[b].vNormalNew * abVectorNormalized[0], balls[b].vNormalNew * abVectorNormalized[1]]
                    balls[b].vVectorTangent = [balls[b].vTangent * abVectorTangentNormalized[0], balls[b].vTangent * abVectorTangentNormalized[1]]

                    # update final velocity vectors
                    balls[a].v = [balls[a].vVectorNormal[0] + balls[a].vVectorTangent[0], balls[a].vVectorNormal[1] + balls[a].vVectorTangent[1]]
                    balls[b].v = [balls[b].vVectorNormal[0] + balls[b].vVectorTangent[0], balls[b].vVectorNormal[1] + balls[b].vVectorTangent[1]]

                    # seperate balls
                    balls[a].p[0] = balls[b].p[0] - (balls[a].r + balls[b].r) * abVectorNormalized[0]
                    balls[a].p[1] = balls[b].p[1] - (balls[a].r + balls[b].r) * abVectorNormalized[1]

    def move(self):
        self.p[0] += self.v[0]
        self.p[1] += self.v[1]

    def draw(self):
        pg.draw.circle(app,self.c,self.p,self.r)

# Initializations
balls = [
    # position, velocity, mass, radius, color
    Ball([160, 120], [0, 0], 1, 100, (255, 100, 100)),
    Ball([appDim[0] / 2, 120], [0, 0], 1, 100, (100, 255, 100)),
    Ball([appDim[0] - 160, 120], [0, 0], 1, 100, (100, 100, 255)),
    Ball([160, appDim[1] - 120], [0, 0], 1, 100, (100, 255, 255)),
    Ball([appDim[0] / 2, appDim[1] - 120], [0, 0], 1, 100, (255, 100, 255)),
    Ball([appDim[0] - 160, appDim[1] - 120], [0, 0], 1, 100, (255, 255, 100)),
]

# randomize attributes
for ball in balls:
    ball.v = [rand.uniform(-2,2), rand.uniform(-2,2)]
    #ball.m = rand.randint(1,100)
    #ball.r = rand.randint(40,200)
    #ball.c = (rand.randint(100,255),rand.randint(100,255),rand.randint(100,255))