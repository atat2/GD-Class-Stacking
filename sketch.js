var walls, tmp;
var score, goal;
var moveAmount, dashAmount;

var blockGroup, blockObj;
var mainChar, mainCharTop, mainCharSide;
var mcDirection, doWJ, doSlide;
var gravity, jump;

var goalHeight;
var sp;

function setup() {
  createCanvas(1000, 1000);
  score = 0;
  walls = new Group();
  blockGroup = new Group();
  textSize(20);
  moveAmount = 4;
  dashAmount = 100;
  gravity = 5;
  jump = -15;
  goalHeight = 220; //Default 220

  
  //WallsV2
  wall1 = createSprite(0, 300, 40, 2000);
  wall1.shapeColor = color(0, 0, 0);
  wall1.immovable = true;
  walls.add(wall1);

  wall2 = createSprite(200, 0, 2000, 40);
  wall2.shapeColor = color(0, 0, 0);
  wall2.immovable = true;
  walls.add(wall2);

  //Floor
  wall3 = createSprite(400, 1000, 2000, 40);
  wall3.shapeColor = color(0, 0, 0);
  wall3.immovable = true;
  walls.add(wall3);

  //Right Wall
  wall4 = createSprite(1000, 300, 40, 6000);
  wall4.shapeColor = color(0, 0, 0);
  wall4.immovable = true;
  walls.add(wall4);
  //wall3.debug = true;

  //Player
  mainChar = createSprite(400, 950, 20, 20);
  mainChar.immovable = false;
  mainCharTop = createSprite(400, 900, 10, 10);
  mainCharBottom = createSprite(400, 900, 10, 10);
  mainCharSide = createSprite(400, 900, 10, 10);
  //mainCharTop.debug = true;
  mcDirection = 1;
  
  makeBlock();
  
  //Goal
  createNewGoal();
  
}

function draw() {
  background(220);
  drawSprites();
  text("Score: " + score, 25, 40);
  
  blockGroup.collide(walls);
  mainChar.collide(blockGroup);
  mainCharTop.collide(blockGroup);
  mainChar.collide(walls);  
  
  //Gravity
  if(mainChar.touching.bottom){
    mainChar.velocity.y = 1;
  } else {
    mainChar.velocity.y += 1;
  }

  if(mainCharBottom.collide(blockGroup)){
    //print("aaa");
    mainChar.velocity.y = 0.1;
    doWJ = 0;
    if(keyIsDown(87)) {
       mainChar.velocity.y = jump;
    }
  }
  
  mainCharTop.position.x = mainChar.position.x;
  mainCharBottom.position.x = mainChar.position.x;
  mainCharTop.position.y = mainChar.position.y-5;
  mainCharBottom.position.y = mainChar.position.y+7;
  
  mainCharSide.position.x = mainChar.position.x + 7*mcDirection;
  mainCharSide.position.y = mainChar.position.y;

  //Player Movement
  mainChar.velocity.x = 0;
  if(mainChar.touching.left || mainChar.touching.right) {
    mainChar.velocity.x = 0;
  }
  
  //A
  if (keyIsDown(65)) {
    mainChar.velocity.x = -moveAmount;
    mcDirection = -1;
  }

  //D
  if (keyIsDown(68)) {
    mainChar.velocity.x = moveAmount;
    mcDirection = 1;
  }
  
  /*
  //S
  if (keyIsDown(83)) {
    doSlide = 1;
  } else {
    doSlide = 0;
  }
  */
  
  mainCharSide.overlap(blockGroup, wallJump);
  //mainCharSide.overlap(walls, wallJump);

  //Blocks
  if (frameCount % 50 == 0) {
    makeBlock(); 
  }
  blockGravity();
  
  if(mainChar.touching.bottom) {
    doWJ = 0;
  }
  
  mainCharTop.overlap(goal, updateScore);
  mainCharTop.overlap(blockGroup, crushed);
  
  
  //Goal
  if(goal.position.y == goalHeight-20) {
    goal.velocity.y = 1;
  }
  if(goal.position.y == goalHeight+20) {
    goal.velocity.y = -1;
  }
  
  //Effects
  //sp.scale = sp.scale + 1;
  //mainCharTop.overlap(blockGroup, mcEffectCrush);
  
  //Method for debugging
  //debugChar();
}

function updateScore() {
  score = score + 1;
  goal.remove();
  mainChar.position.x = 400;
  mainChar.position.y = 950;
  blockGroup.removeSprites();
  createNewGoal();
}

function createNewGoal() {
  goal = createSprite(round(random(1, 10))*80 + 60, goalHeight, 25, 25)
  goal.setCollider("circle", 0, 0, 25);
  goal.draw = function () {
    ellipse(0, 0, 50);
  };
  goal.velocity.y = 2;
}

function crushed(a) {
  score = 0;
  mainChar.position.x = 400;
  mainChar.position.y = 950;
  blockGroup.removeSprites();
}

function keyPressed() {
  //W
  if(keyCode == 87) {
      if(mainChar.touching.bottom) {
        mainChar.velocity.y = jump;
      }
      if(doWJ) {
        mainChar.velocity.y = jump;
        mainChar.velocity.x = moveAmount * -mcDirection;
        doWJ = 0;
      }
  }
  
  //Spacebar
  if(keyCode == 32 && mainChar.touching.bottom == false) {
    if(doWJ == 0 && mainCharBottom.touching.bottom == false) {
      mainChar.velocity.x = dashAmount * mcDirection;
      doWJ = 1;
      mcEffects();
    }
  }
  //if(keyCode == 32 && doSlide) {
  //  mainChar.velocity.x = dashAmount/2 * mcDirection;
  //  print("debug: slide");
  //}
}

function makeBlock() {
  blockObj = createSprite(round(random(0, 11))*80+60, 80, 80, 80);
  blockGroup.add(blockObj);
}

function blockGravity() {
  blockObj.velocity.y = gravity;
  blockGroup.collide(blockGroup, (a, b)=> {
    a.immovable = true;
    a.velocity.y = 0;
    b.velocity.y = 0;
    b.immovable = true; 
  })
}

function wallJump() {
  if(mainChar.touching.bottom == false && doWJ) {
    mainChar.velocity.y = 0;
  }
}

function mcEffects() {
  
  /*
  //Cloud Dash Particle
  var p, p2, p3;
  p = createSprite(mainChar.position.x, mainChar.position.y, 10, 10);
  p.draw = function () {
    ellipse(0, 0, 20);
  };
  p.life = 10;
  p.velocity.x = -mcDirection * 1;
  p.velocity.y = -0.25;
  
  p2 = createSprite(mainChar.position.x, mainChar.position.y, 10, 10);
  p2.draw = function () {
    ellipse(0, 0, 20);
  };
  p2.life = 10;
  p2.velocity.x = -mcDirection * 1;
  p2.velocity.y = 0;
  
  p3 = createSprite(mainChar.position.x, mainChar.position.y, 10, 10);
  p3.draw = function () {
    ellipse(0, 0, 20);
  };
  p3.life = 10;
  p3.velocity.x = -mcDirection * 1;
  p3.velocity.y = 0.25;
  */
  
  //Dash Square
  var ds1, ds2, ds3;
  ds1 = createSprite(mainChar.position.x, mainChar.position.y, 15, 15);
  ds1.life = 3;
  ds2 = createSprite(mainChar.position.x+(50*mcDirection), mainChar.position.y, 15, 15);
  ds2.life = 8;
  ds3 = createSprite(mainChar.position.x+(80*mcDirection), mainChar.position.y, 15, 15);
  ds3.life = 10;
  
}

/*
function mcEffectCrush() {
  //Smashed Particle
  sp = createSprite(b.position.x, b.position.y, 10, 10);
  sp.draw = function () {
    ellipse(0, 0, 20);
  };
  sp.life = 10;
}
*/

function debugChar() {
  textSize(10);
  var mx = mainChar.position.x;
  var my = mainChar.position.y;
  text("Debug:", mx, my-100);
  text("Direction: " + mcDirection, mx, my-90);
  text("doWJ: " + doWJ, mx, my-80);
  text("doSlide: " + doSlide, mx, my-70);
  text("score: " + score, mx, my-60);
  
  //text("mcB Touch: " + (mainCharBottom.touching.bottom == true), mx, my-60);
  mainChar.debug = true;
  //mainCharTop.debug = true;
  //mainCharBottom.debug = true;
  //mainCharSide.debug = true;
  
  mainCharTop.overlap(blockGroup, (a,b)=>{b.debug = true;});
}