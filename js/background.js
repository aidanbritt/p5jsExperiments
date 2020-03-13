var bubbles = [];
var bubbleCount = 50;
var cwidth = window.innerWidth;
var cheight = window.innerHeight;


var cycleIndex = 0;
var cycles = 4;
var cycleComplete = false;

var bubbleRed = [64, 245, 66, 222];
var bubbleGreen = [159, 64, 245, 222];
var bubbleBlue = [214, 66, 102, 222];

var backgroundRed = 222;
var backgroundGreen = 222;
var backgroundBlue = 222;

isParallax = false;

function preload() {
}

function setup() {
  var canvas = createCanvas(cwidth, cheight);
  canvas.parent("bg");

  for (var i = 0; i < bubbleCount; i++) {
    bubbles.push(new bubble(random(-40, cwidth + 40), cheight, random(2, 3), random(35, 110)));
  }
}

function deviceTurned(){
  alert('test');
  windowResized();
}

function windowResized() {
  cwidth = window.innerWidth;
  cheight = window.innerHeight;
  resizeCanvas(cwidth, cheight, true);

  bubbles = [];
  for (var i = 0; i < bubbleCount; i++) {
    bubbles.push(new bubble(random(-40, cwidth + 40), cheight, random(2, 3), random(35, 110)));
  }
}

function draw() {
  //start as complete
  cycleComplete = true;
  for (var i = 0; i < bubbleCount; i++) {
    if (bubbles[i].update() == true) {
      cycleComplete = false; //if any aren't complete then set to incomplete
    }
  }

  if (cycleComplete) {
    cycleIndex++;
    for (var i = 0; i < bubbleCount; i++) {
      bubbles[i].shouldMove = true;
    }
  }
}


function bubble(x, y, speed, diameter) {
  this.x = x;
  this.showX = x;
  this.startX = x;
  this.y = y;
  this.showY = y;
  this.h = y;
  this.diameter = diameter;
  this.opacity = 255; //map(this.diameter, 5, 150, 50, 75, true);
  this.speed = speed * map(this.diameter, 5, 150, 0.75, 2.5);
  this.shouldMove = true;

  this.update = function () {

    if (this.shouldMove) {
      this.x = this.startX + sin(this.h / 100) * (100 / speed);
      this.h -= this.speed;
      this.y -= this.speed;
    } else {
      return false;
    }

    if (this.y < 0 - this.diameter - 100) {
      this.y = cheight + this.diameter + 100;
      this.shouldMove = false;
      return false;
    }

    noStroke();
    fill(bubbleRed[cycleIndex % cycles], bubbleGreen[cycleIndex % cycles], bubbleBlue[cycleIndex % cycles], this.opacity);


    this.showX = this.x + parallaxX(this.diameter);
    this.showY = this.y + parallaxY(this.diameter);

    if (cycleIndex % cycles == cycles - 1) {
      ellipse(
        this.showX,
        this.showY,
        this.diameter * 3,
        this.diameter * 3);
    } else {
      ellipse(
        this.showX,
        this.showY,
        this.diameter,
        this.diameter);
    }
    return true;
  };
}

function parallaxX(diam) {
  return isParallax ? map(mouseX * map(diam, 5, 80, 0.5, 1, true), 0, cwidth, -cwidth / 10, cwidth / 10) : 0;
}

function parallaxY(diam) {
  return isParallax ? map(mouseY * map(diam, 5, 80, 0.5, 1, true), 0, cheight, -cheight / 10, cheight / 10) : 0;
}
