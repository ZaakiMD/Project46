var car, carImg, road, backgroundImg;

var cones, screws, manhole, restart;

var manholeImg, coneImg, screwImg, restartImg;

var gameOver, Img;

var manholeGroup, screwGroup, coneGroup;

var score;

var leftBoundary, rightBoundary, ran;

//Game States
var PLAY = 1;
var END = 0;
var gameState = 1;

function preload(){
    //load Images
    carImg = loadImage("assets/car.png");
    backgroundImg= loadImage("assets/road.png");
    manholeImg = loadImage("assets/manhole.png");
    Img = loadImage("assets/gameOver.png");
    coneImg = loadImage("assets/cone.png");
    screwImg = loadImage("assets/screw.png");
    restartImg = loadImage("assets/restart.png");
}

function setup() {
    //created canvas of window width and height
    createCanvas(windowWidth, windowHeight);
    
    road = createSprite(windowWidth/2, windowHeight/2);
    road.addImage(backgroundImg);

    car = createSprite(windowWidth/2, windowHeight/2);
    car.addImage(carImg);   
    car.scale = 0.18;
    //setting collider for car
    car.setCollider("rectangle", 0, 0, 300, 700, 0);
    car.debug = true;

    gameOver = createSprite(windowWidth/2, windowHeight/2);
    gameOver.addImage(Img);
    
    leftBoundary = createSprite(windowWidth/2.7, windowHeight/3,100,1300);
    //making the boundary invisible
    leftBoundary.visible = false;

    rightBoundary = createSprite(windowWidth/1.58, windowHeight/3,100,900);
    //making the boundary invisible
    rightBoundary.visible = false;

    restart = createSprite(windowWidth/2, windowHeight/3);
    restart.addImage(restartImg);
    
    score = 0;

    //creating groups for obstacles
    manholeGroup = createGroup();
    screwGroup = createGroup();
    coneGroup = createGroup();

}

function draw() {
    background(100);

    //displaying score
    textSize(10);
    fill(255);
    text("Score: "+ score,2,15);

    car.collide(leftBoundary);
    car.collide(rightBoundary);
    
    if(gameState === PLAY){
        
        //making gameover and restart invisible as we dont need them in playstate
        restart.visible = false;
        gameOver.visible = false;
        car.visible = true;

        road.velocityY = 4;
        
        //scoring
        score = score + Math.round(getFrameRate()/60);

        //movements of car
        if(keyDown("left_arrow")){
            car.x = car.x-3; 
        }
        
        if(keyDown("right_arrow")){
            car.x = car.x+3; 
        }
 
        //making the road look as if it is an infinite road
        if(road.y > windowHeight-300){
            road.y = height/2;
        }
        
        //calling function to spawn obstacles
        spawnObstacles();

        //making the game move to endstate if any of the obstacle are touched
        if(screwGroup.isTouching(car)){
            gameState = END;
        }
        else if(coneGroup.isTouching(car)){
            gameState = END;
        }
        else if(manholeGroup.isTouching(car)){
            gameState = END;
        }
        
    }
    else if(gameState === END) {
        
        //making the road stop when the game is over
        road.velocityY = 0
        //making car invisible as the game is over
        car.visible = false;
        
        //setting the lifetime of obstacles to -1
        screwGroup.setLifetimeEach(-1);
        manholeGroup.setLifetimeEach(-1);
        coneGroup.setLifetimeEach(-1);
        
        //setting obstacles'velocity to 0 to make it stop moving
        screwGroup.setVelocityYEach(0);
        manholeGroup.setVelocityYEach(0);
        coneGroup.setVelocityYEach(0);

        //making the gameover image and restart image visible so that the player knows that the game is over
        restart.visible = true;
        gameOver.visible = true;
        
        //reseting the game as the restart image is pressed
        if(mousePressedOver(restart)){
            reset();
        }
    
    }
    
    drawSprites();
}

function spawnManholes(){    
    //creating one of the obstacles
    manhole = createSprite(350, 50);
    manhole.addImage(manholeImg);
    manhole.scale = 0.06;
    //making it spawn at different x positions
    manhole.x = Math.round(random(windowWidth/2.5, windowWidth/1.67));
    //increasing depth
    car.depth = manhole.depth;
    car.depth +=1;
    manhole.velocityY = 4;
    manhole.lifetime = 800;
    //adaptivity
    manhole.velocityY = (6 + score/100);
    //adding to group
    manholeGroup.add(manhole);
}

function spawnCones(){   
    //refer function spawnManholes to see what is happening as you have used the same code type for this
    cones = createSprite(350, 50);
    cones.addImage(coneImg);
    cones.scale = 0.06;
    cones.x = Math.round(random(windowWidth/2.5, windowWidth/1.67));
    car.depth = cones.depth;
    car.depth +=1;
    cones.velocityY = 4;
    cones.lifetime = 800;
    cones.velocityY = (6 + score/100);
    coneGroup.add(cones);
}

function spawnScrews(){
    //refer function spawnManholes to see what is happening as you have used the same code type for this
    screws = createSprite(350, 50);
    screws.addImage(screwImg);
    screws.scale = 0.06;
    screws.x = Math.round(random(windowWidth/2.5, windowWidth/1.67));
    car.depth = screws.depth;
    car.depth +=1;
    screws.velocityY = 4;
    screws.lifetime = 800;
    screws.velocityY = (6 + score/100);
    screwGroup.add(screws);
}

function spawnObstacles(){
    //randomely spawning different obstacles
    if(frameCount % 100 === 0){

        ran = Math.round(random(1, 3));
        switch(ran){
            case 1: spawnManholes();
                    break;
            case 2: spawnCones();
                    break;
            case 3: spawnScrews();
                    break;
            default: break;
        }

    }

}

function reset(){
    gameState = PLAY;
    
    //destroying the obstacles as the restart is pressed
    coneGroup.destroyEach();
    manholeGroup.destroyEach();
    screwGroup.destroyEach();
    
    //setting score to 0 again
    score = 0;
  }