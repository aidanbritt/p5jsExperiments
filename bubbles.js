var bubbles = [];
var bubbleCount = 10;
var cwidth = screen.width;
var cheight = screen.height

var settingsList = [];

var showSettings = false;
var settingsHeight = 300;
var settingsWidth = 150;
var bX,bX2,bY,bY2 = 0;

var settingsButton;

var plxBtn;
var clickModeButton;

function preload() {
  //font = loadFont('assets/SourceSansPro-Regular.otf');
}

function setup() {
  createCanvas(cwidth, cheight);

  //textFont(font);
  textSize(13.333);
  textAlign(LEFT, TOP);

  document.getElementsByTagName("html")[0].style.overflow = "hidden";
  
  bubbleCount = cwidth * cheight / 1600;

  // Starts in the middle
  for (var i = 0; i < bubbleCount; i++) {
    bubbles.push(new bubble(random(-40, cwidth + 40), random(0, cheight), random(1, 3), random(5, 100)));
  }
  settingsButton = createButton('settings');
  settingsButton.style('background', 'rgba(0,0,0,.25)');
  settingsButton.style('color', '#fff');
  settingsButton.style('border', 'none');
  settingsButton.position((settingsWidth / 2) - (settingsButton.width / 2), 5);
  settingsButton.mousePressed(settings);

  bX = settingsButton.position().x;
  bY = settingsButton.position().y;
  bX2 = settingsButton.position().x + settingsButton.width;
  bY2 = settingsButton.position().y + settingsButton.height;

  plxBtn = new setting("Parallax", 0, 0, 1, ["Off", "On"]);
  clkBtn = new setting("Click-Mode", 0, 0, 2, ["Off", "Create", "Pop"]);
  //sclBtn = new setting("Scale", 2, 1, 10, [".5x", "1x", "1.5x", "2x", "2.5x", "3x", "3.5x", "4x", "4.5x", "5x"]);
  sclSld = new settingSlide("Scale",10,0,50);
  //opcBtn = new setting("Opacity", 3, 1, 5, ["Lowest", "Low", "Default", "Medium", "High"]);
  opcSld = new settingSlide("Opacity",10,0,50);
  rSld = new settingSlide("Bubble R", 255, 0, 255);
  gSld = new settingSlide("Bubble G", 255, 0, 255);
  bSld = new settingSlide("Bubble B", 255, 0, 255);

  rBSld = new settingSlide("Bgd R", 100, 0, 255);
  gBSld = new settingSlide("Bgd G", 150, 0, 255);
  bBSld = new settingSlide("Bgd B", 250, 0, 255);
}

function draw() {
  background(rBSld.input.value(), gBSld.input.value(), bBSld.input.value());
  for (var i = 0; i < bubbleCount; i++) {
    bubbles[i].update();
  }
  if (showSettings) {
    stroke(255, 128);
    fill(0, 64);
    rect(0, 0, settingsWidth, (settingsList.length - 1) * 35);

    for (var s = 0; s < settingsList.length; s++) {
      if (settingsList[s].isSlider) {
        fill(255);
        text(settingsList[s].name + ":", 10, 35 + (25 * s));
      }
    }
  }
}

function settingSlide(name, defValue, minValue, maxValue) {
  this.isSlider = true;

  this.name = name;
  this.minValue = minValue;
  this.maxValue = maxValue;
  this.value = defValue;

  this.input = createSlider(minValue, maxValue, defValue);
  this.input.position(settingsWidth / 2, 35 + (25 * settingsList.length));
  this.input.style('width', (settingsWidth / 2 - 10) + 'px');

  this.input.hide();

  settingsList[settingsList.length] = this;
}

function setting(name, defValue, minValue, maxValue, labels) {
  this.name = name;
  this.minValue = minValue;
  this.maxValue = maxValue;
  this.value = defValue;
  this.labels = labels;

  this.input = createButton(this.name + ": " + this.labels[this.value - this.minValue]);
  this.input.style('background', 'rgba(0,0,0,0)');
  this.input.style('color', '#fff');
  this.input.style('border', 'none');

  this.input.position((settingsWidth / 2) - (this.input.width / 2), 35 + (25 * settingsList.length));
  this.input.mousePressed(settingClick);
  this.input.hide();

  settingsList[settingsList.length] = this;
}

function settingClick() {
  var index = Math.floor((mouseY - 35) / 25)
  if (index < settingsList.length && mouseY > 0) {
    var cSetting = settingsList[index];
    cSetting.value++;

    if (cSetting.value > cSetting.maxValue) {
      cSetting.value = cSetting.minValue;
    }
    cSetting.input.html(cSetting.name + ": " + cSetting.labels[cSetting.value - cSetting.minValue]);
  }
}

function bubble(x, y, speed, diameter) {
  this.show = true;

  this.x = x;
  this.showX = x;
  this.startX = x;
  this.y = y;
  this.showY = y;
  this.h = y;
  this.diameter = diameter;
  this.opacity = map(this.diameter, 5, 150, 50, 75, true);
  this.speed = speed * map(this.diameter, 5, 150, 0.75, 2.5);

  this.update = function() {
    if (!this.show) {
      return;
    }

    this.x = this.startX + sin(this.h / 100) * (100 / speed);
    this.h -= this.speed;
    this.y -= this.speed;

    if (this.y < 0 - this.diameter - 100) {
      this.y = cheight + this.diameter + 100;
    }

    noStroke();
    fill(rSld.input.value(), gSld.input.value(), bSld.input.value(), this.opacity * (opcSld.input.value()/10));


    this.showX = this.x + parallaxX(this.diameter);
    this.showY = this.y + parallaxY(this.diameter);

    ellipse(
      this.showX,
      this.showY,
      this.diameter * sclSld.input.value() / 10,
      this.diameter * sclSld.input.value() / 10);
  };
}

function parallaxX(diam) {
  return plxBtn.value ? map(mouseX * map(diam, 5, 80, 0.5, 1, true), 0, cwidth, -cwidth / 10, cwidth / 10) : 0;
}

function parallaxY(diam) {
  return plxBtn.value ? map(mouseY * map(diam, 5, 80, 0.5, 1, true), 0, cheight, -cheight / 10, cheight / 10) : 0;
}

function settings() {
  showSettings = !showSettings;

  for (var s = 0; s < settingsList.length; s++) {
    if (showSettings) {

      settingsList[s].input.show();
    } else {
      settingsList[s].input.hide();
    }
  }
}

// When the user clicks the mouse
function mousePressed() {
  if (showSettings == true) {
    //make sure they aren't clicking within the settings dropdown
    if (mouseX < settingsWidth && mouseY < settingsHeight)
      return;
  } else {
    //Make sure they aren't clicking the settings button
    if (mouseX >= bX && mouseX <= bX2 && mouseY >= bY && mouseY <= bY2)
      return;
  }

  //Apply click
  switch (clkBtn.value) {
    default:
      break;

    case 1:
      var size = random(5, 100);
      bubbles.push(new bubble(
        mouseX - parallaxX(mouseX),
        mouseY - parallaxY(mouseY),
        random(1, 3), size));
      bubbleCount++;
      break;

    case 2:
      for (var i = 0; i < bubbleCount; i++) {
        var d = dist(mouseX, mouseY, bubbles[i].showX, bubbles[i].showY);
        if (d < ((bubbles[i].diameter/2) * (sclSld.input.value()/10)) && bubbles[i].show) {
          bubbles[i].show = false;
        }
      }
      break;
  }
}
