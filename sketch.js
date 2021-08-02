var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  canvasX= displayWidth - 100;
  canvasY= displayHeight - 100;

  createCanvas(canvasX,canvasY);

  //createCanvas(600, 200);

  //var message = "This is a message";
 //console.log(message)
  
  trex = createSprite(canvasX/2 - 600, canvasY/2-100, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(canvasX/2, canvasY/2-20, canvasX, 20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /5;
  ground.scale= displayWidth/150
  ground.velocityX = -(6 + 3* score/100)
  camera.position.x= ground.x


  gameOver = createSprite(displayWidth/2, displayHeight/10);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2, 40 + displayHeight/10);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  invisibleGround.scale= displayWidth/150
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, camera.position.x + 400,50);
  gameOver.x= camera.position.x;
  restart.x= camera.position.x;
  trex.velocityX=1
  
  if(gameState === PLAY){
    gameOver.visible = false;
  restart.visible = false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3* score/100)
    camera.position.x= trex.x;
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/5;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     if(mousePressedOver(restart)) {
      reset();
    }
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      trex.velocityX= 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function reset(){
  gameState= PLAY;
  gameOver.visible= false;
  restart.visible= false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);

  if(localStorage["HighestScore"]<score){
    localStorage["HighestStorage"]= score
  }
  
  console.log(localStorage["HighestScore"])
  score= 0;
  
}


function spawnObstacles(){
    
    //generate random obstacles
    if(camera.position.x%60 === 0){
      var obstacle= createSprite(displayWidth, displayWidth/4,10,40)
      obstacle.velocityX = -(6+ 3*score /100);


    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = (displayWidth/(-1*obstacle.velocityX));;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x % 60 === 0) {
    var cloud = createSprite(displayWidth, displayWidth/2-200, 40, 10);
    cloud.y = Math.round(random(80,displayWidth/2 -400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = Math.round(displayWidth/3);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

