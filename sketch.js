var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie;
var posX = 200;

var life = 3;
var score = 0;
var gameState = 1;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var gameOver;

var zombieFrequency = 100;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  clickToPlay = loadImage("assets/clicktoplay.png")

  zombieImg = loadImage("assets/zombie.png")

  bulletImg = loadImage("assets/bullet1.png")

  bgImg = loadImage("assets/pvz.png")

  gameOverImg = loadImage("assets/Game_Over.jpg")

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  xpGain = loadSound("assets/win.mp3")
  dead = loadSound("assets/explosion.mp3")
  lost = loadSound("assets/lose.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-60,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.6
  

  //creating the player sprite
  player = createSprite(displayWidth-1600, displayHeight-300, 50, 50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.debug = true;
  player.setCollider("rectangle",0,0,300,500)

  home = createSprite(displayWidth-1700, displayHeight/2, 10, 2000)
  home.visible = false

  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth-150,40,20,20)
  heart1.visible = false
  heart1.addImage("heart1",heart1Img)
  heart1.scale = 0.4
  
  heart2 = createSprite(displayWidth-100,40,20,20)
  heart2.visible = false
  heart2.addImage("heart2",heart2Img)
  heart2.scale = 0.4
  
  heart3 = createSprite(displayWidth-150,40,20,20)
  heart3.addImage("heart3",heart3Img)
  heart3.scale = 0.4

  bulletGroup = createGroup();
  zombieGroup = createGroup();

  scoreboard = createElement("h1");
}

function draw() {   
  background(0); 
  console.log(zombieFrequency)

  /*if(gameState === 0)
  {
    startingScreen = createSprite(displayWidth-960, displayHeight-600, 150, 150);
    startingScreen.scale = 3;
    startingScreen.addImage(clickToPlay);

    if(mousePressedOver(startingScreen))
    {
      gameState = 1;
    }
  }*/

  if(gameState === 1)
  {
    scoreboard.html("Score: "+score)
    scoreboard.style('color:red'); 
    scoreboard.position(width-1900,0,100,100)
    scoreboard.scale = 3;

    if(life===3){
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if(life===2){
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if(life===1){
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30
    }

    //Creating a zombie frequently
    if(frameCount % zombieFrequency === 0)
    {
      createZombie();
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
 
      player.addImage(shooter_shooting)
      shootBullet();
 
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg)

    }

    if(zombieGroup.isTouching(player))
    {
      handleGameOver();
    }

    if(zombieGroup.isTouching(bulletGroup))
    {     
      dead.play();

      for(var i = 0; i< zombieGroup.length;i++)
      {
        if(zombieGroup[i].isTouching(bulletGroup))
        {
          console.log("SHOT");
          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          score = score + 1;

          //if(score >= 200)
          //{
          //  handleWin();
          //}
          
          if(score % 5 === 0)
          {
            xpGain.play();
          }

          //Making the zombies spawn more frequently after each kill
          if(zombieFrequency > 10)
          {
            zombieFrequency -= 10;
          }
          else if(zombieFrequency = 10)
          {
            zombieFrequency = 10;
          }

          //Making the zombies come closer after each kill
          if(posX < 1100)
          {
            posX += 10;
          }
          else if(posX = 1100)
          {
            posX = 1100;
          }

          //debugging
          console.log(posX)
          console.log(score);
        }
      }
    }

    if(home.isTouching(zombieGroup))
    {
      handleGameOver();
    }
      }

      else if(gameState === 2)
      {
        gameOver = createSprite(displayWidth-960, displayHeight-600, 150, 150);
        gameOver.scale = 1.2;
        gameOver.addImage(gameOverImg);
      }

      if(mousePressedOver(gameOver))
      {
        restart();
      }

  drawSprites();

}

function shootBullet()
{
  bullet = createSprite(player.x, player.y, 50, 20);
  bullet.addImage(bulletImg)
  bullet.scale = 0.1
  bullet.velocityX = 30
  player.depth = bullet.depth
  player.depth = player.depth+2
  bulletGroup.add(bullet)
}

function createZombie()
{
  zombie = createSprite(displayWidth-posX, displayHeight-random(300,1000), 50, 50);
  zombie.addImage(zombieImg);
  zombie.scale = 0.15;  
  zombie.velocityX = -20;
  zombie.debug = true;
  zombie.setCollider("rectangle",0,0,500,1000);
  zombie.lifetime = 400
  zombieGroup.add(zombie);
}

function handleGameOver()
{
  life = life - 1;
  zombieGroup.destroyEach();
  console.log(life);
  lost.play();

  if(life === 0)
  {
    console.log("DEAD")
    gameState = 2;
    player.destroy();
  }
}

function restart()
{
  gameState = 1;
  window.location.reload();
  gameOver.visible = false;
  life = 3;
  zombieFrequency = 100;
  posX = 200;
}

//function handleWin()
//{
//
//}