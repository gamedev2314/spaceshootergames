let spaceship;
let asteroids = [];
let bullets = [];
let score = 0;
let asteroidKills = 0;
let gameOver = false;
let retryButton;

function setup() {
  createCanvas(600, 400);
  spaceship = new Spaceship();
  retryButton = createButton('Retry');
  retryButton.position(width / 2 - 30, height / 2 + 40);
  retryButton.mousePressed(restartGame);
  retryButton.hide();
}

function draw() {
  background(0);

  if (gameOver) {
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Game Over\nScore: " + score, width / 2, height / 2);
    retryButton.show();
    return;
  } else {
    retryButton.hide();
  }

  spaceship.update();
  spaceship.display();

  if (frameCount % 60 === 0) {
    asteroids.push(new Asteroid());
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].display();

    if (asteroids[i].hits(spaceship)) {
      gameOver = true;
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (asteroids[i].hits(bullets[j])) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        asteroidKills++;
        score += 10;
        break;
      }
    }

    if (asteroids[i] && asteroids[i].offscreen()) {
      asteroids.splice(i, 1);
    }
  }

  score++;
  textSize(18);
  fill(255);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  textAlign(RIGHT);
  text("Asteroids Blown Up: " + asteroidKills, width - 20, 30);

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    if (bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    spaceship.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    spaceship.setDir(1, 0);
  }
  if (keyCode === 32) {
    bullets.push(new Bullet(spaceship.x, spaceship.y - spaceship.size / 2));
  }
}

function keyReleased() {
  spaceship.setDir(0, 0);
}

function restartGame() {
  gameOver = false;
  asteroids = [];
  bullets = [];
  score = 0;
  asteroidKills = 0;
  spaceship = new Spaceship();
}

class Spaceship {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
    this.size = 30;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  update() {
    this.x += this.xSpeed * 5;
    this.x = constrain(this.x, 0, width - this.size);
  }

  setDir(x, y) {
    this.xSpeed = x;
    this.ySpeed = y;
  }

  display() {
    fill(255);
    noStroke();

    // Main body
    triangle(this.x, this.y - 20, this.x - 15, this.y + 20, this.x + 15, this.y + 20);
    // Cockpit
    fill(0, 200, 255);
    ellipse(this.x, this.y - 5, 10, 10);
    // Side wings
    fill(255);
    triangle(this.x - 15, this.y + 20, this.x - 25, this.y + 10, this.x - 5, this.y + 10);
    triangle(this.x + 15, this.y + 20, this.x + 25, this.y + 10, this.x + 5, this.y + 10);
  }
}

class Asteroid {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.size = random(20, 40);
    this.speed = random(2, 4);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(150);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  hits(spaceshipOrBullet) {
    let d = dist(this.x, this.y, spaceshipOrBullet.x, spaceshipOrBullet.y);
    return d < this.size / 2 + spaceshipOrBullet.size / 2;
  }

  offscreen() {
    return this.y > height;
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.speed = 5;
  }

  update() {
    this.y -= this.speed;
  }

  display() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  offscreen() {
    return this.y < 0;
  }
}

