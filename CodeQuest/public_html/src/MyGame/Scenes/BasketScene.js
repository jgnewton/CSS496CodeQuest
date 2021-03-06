/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * File: BasketScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BasketScene() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";
    this.kForest = "assets/Forest2.png";
    this.kEarth = "assets/Earth.png";
    this.kMW = "assets/MW2.jpg";
    this.scoreMarks = "assets/checksandx.png"
    this.kArrow = "assets/MenuSelectArrow.png";
    this.helpTable = "assets/BasketHelp.png";
    this.kbats ="assets/bats.png";
    this.friend = "assets/squirralR.png";
    
    this.boat = "assets/BasketGame/boat.png";
    this.fish = "assets/BasketGame/fish.png";
    this.ocean = "assets/BasketGame/ocean.png";
    this.oceanBG = "assets/BasketGame/oceanbackground.png";
    this.seagull = "assets/BasketGame/seagull.png";
    this.boatcharacter = "assets/BasketGame/boatcharacter.png";
    this.chipmunk = "assets/squirrel.png";
    
    // The camera to view the scene
    this.mCamera = null;

    //this.mMsg = null;
    this.mShapeMsg = null;

    this.mAllObjs = null;
    this.mBounds = null;
    this.mCollisionInfos = [];
    this.mHero = null;
    
    this.mCurrentObj = 0;
    this.mTarget = null;
    
    
    // Setting up ray selection logic
    this.minselect=0;
    this.maxselect=4;
    
    //this.selection=0;
     
    this.genTimer=0;
    
    //width of world within camera view
    this.WCWidth=300;
    
    this.VPWidth=800;
    this.VPHeight=600;
    
    //height derived from width
    this.WCHeight=this.VPHeight/this.VPWidth*this.WCWidth;
    
    //center x coordinate of camera
    this.WCCenterX=0;
    //y coord
    this.WCCenterY=0;
    
    this.maxType=4;
    
    //this.WCCenterX - (this.WCWidth / 2) + 5
    // this.WCCenterY - (this.WCHeight / 2) + 5
    //this.nextMarkX=-140;
    //this.nextMarkY=109.5;
    
    this.markOffset = 10;
    this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + this.markOffset;
    this.nextMarkY = this.WCCenterY - (this.WCHeight / 2) + this.markOffset;
    this.scoreMarksArray = [];
       
    this.ground = null;
    
    // elements is an array that holds all the text elements for the data ttype
    // that the player can select from
    this.elements = [];
    this.selectedElement = null;
    this.selectIndex = 0;
    this.helpTableObject = null;
    this.helpTableVisible = false;
    this.GenerateOn=true;
       
    // the number of Xs the player has
    this.numIncorrect = 0;
    this.numCorrect = 0;
    // the number of Xs required to lose the game
    this.gameOverNumber = 10;
    
    //success
    this.succeedNumber = 100;
    // when gameOver is true, we display the player's score and prompt them
    // to play again or return to main menu
    this.gameOver = false;
    this.gameOverText = null;
    this.gameOverText2 = null;
    this.gameOverText3 = null;
    this.gameOverText4 = null;
    
    this.Accuracy = null;
    this.Shots = null;
    this.Hits = null;
    
    this.revealMsg = null;

    this.revealTime = 0;
    this.groundLevel = null;
    
    this.mFruit = null;
    this.mBat = null;
    this.mAnswer = null;
    
    
    // --------------------Starting Problem Set
    this.problemType=0;
    
    this.Operators=[];
    this.posY1 = 0;
    this.posX =0;
    this.offSet =0;
    this.position=0;
    
    this.maxPosition=2;
    
    this.basketText = null;
    
    this.THRESHOLD=3;
    this.MAX_TYPE=4;
    
    this.successCount = 0;
    this.friendObject = null;
    this.friendVisible = false;
    this.helpTimer = 0;
    
    this.numMistakes=0;
    
    this.musicOn=true;
    
    
}
gEngine.Core.inheritPrototype(BasketScene, Scene);


BasketScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kForest);
    gEngine.Textures.loadTexture(this.kEarth);
    gEngine.Textures.loadTexture(this.kMW); 
    gEngine.Textures.loadTexture(this.scoreMarks); 
    gEngine.Textures.loadTexture(this.kArrow); 
    gEngine.Textures.loadTexture(this.helpTable);
    gEngine.Textures.loadTexture(this.kbats); 
    gEngine.Textures.loadTexture(this.friend);
    
    gEngine.Textures.loadTexture(this.boat);
    gEngine.Textures.loadTexture(this.fish);
    gEngine.Textures.loadTexture(this.ocean);
    gEngine.Textures.loadTexture(this.oceanBG);
    gEngine.Textures.loadTexture(this.seagull);
    
    gEngine.Textures.loadTexture(this.boatcharacter);
    gEngine.Textures.loadTexture(this.chipmunk);
    
    //sounds
    this.fishsong = "assets/Sounds/FishThemeSong.mp3";
    this.music=this.fishsong;
    this.goodcatch = "assets/Sounds/catchgood.mp3";
    this.badcatch = "assets/Sounds/catchbad.mp3";
    this.falling = "assets/Sounds/fishfall.mp3";
    gEngine.AudioClips.loadAudio(this.fishsong);
    gEngine.AudioClips.loadAudio(this.music);
    gEngine.AudioClips.loadAudio(this.goodcatch);
    gEngine.AudioClips.loadAudio(this.badcatch);
    gEngine.AudioClips.loadAudio(this.falling);
};

BasketScene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth);
    gEngine.Textures.unloadTexture(this.kMW); 
    gEngine.Textures.unloadTexture(this.scoreMarks); 
    gEngine.Textures.unloadTexture(this.kArrow); 
    gEngine.Textures.unloadTexture(this.helpTable);
    gEngine.Textures.unloadTexture(this.kbats); 
    gEngine.Textures.unloadTexture(this.friend);
    
    gEngine.Textures.unloadTexture(this.boat);
    gEngine.Textures.unloadTexture(this.fish);
    gEngine.Textures.unloadTexture(this.ocean);
    gEngine.Textures.unloadTexture(this.oceanBG);
    gEngine.Textures.unloadTexture(this.seagull);
    gEngine.Textures.unloadTexture(this.boatcharacter);
    
    gEngine.Textures.unloadTexture(this.chipmunk);
    
    var MG = new MyGame();
    gEngine.Core.startScene(MG); 
};

BasketScene.prototype.initialize = function () {
    setControlText("Baskets");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(this.WCCenterX, this.WCCenterY), // position of the camera
        this.WCWidth,                     // width of camera
        [0, 0, this.VPWidth, this.VPHeight]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
        
    
    //object Set
    this.mAllObjs = new GameObjectSet();   
    
    // background init
    this.mBackground = new TextureRenderable(this.oceanBG);
    this.mBackground.getXform().setPosition(0, 0);
    this.mBackground.getXform().setRotationInDegree(0); // In Degree
    this.mBackground.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.mBackground);
    //this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    /*
    var bxf=this.mBackground.getXform();
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    */
    
    
    //configure ground (currently a solid color green)
    // in the future it should be a texture renderable
    
    /*
    this.ground = new Renderable(gEngine.DefaultResources.getConstColorShader());
    this.ground.setColor([0, 1, 0, 1]);
    // bottom of the viewport = -WCHeight / 2
    this.groundHeight = this.WCHeight / 4.5;   
    this.ground.getXform().setPosition(0, -this.WCHeight / 2 + this.groundHeight / 2);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, this.groundHeight);
    */
   
    this.ground = new TextureRenderable(this.ocean);
    this.groundHeight = this.WCHeight / 4.5;   
    this.ground.getXform().setPosition(0, 0);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.ground);
    
    //create hero and add to set
    this.mHero = new Hero(this.boatcharacter);
    this.mHero.mDye.getXform().setPosition(this.WCCenterX, this.WCCenterY-60);
    this.mHero.mDye.setElementPixelPositions(0, 413, 512 - 326, 512);
    this.mHero.mDye.getXform().setSize(32, 36);
    //this.mHero.
    this.mAllObjs.addToSet(this.mHero);
    
    
    
    this.groundLevel = this.WCCenterY - (this.WCHeight/2) + this.groundHeight;
    
    this.helpTableObject = new TextureRenderable(this.helpTable);
    this.helpTableObject.getXform().setSize(250, 100);
    
    this.gameOverText = new MenuElement("Game Over", -15, 30, 10);
    this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -25, 0, 10);
    this.gameOverText3 = new MenuElement("Press X to return to overworld", -70, -30, 10);
    //this.gameOverText4 = new MenuElement("Press Space to play again", -45, -60, 10);
    
    this.Accuracy=0;
    this.Hits=0;
    this.Shots=0;
    
    this.accuracyText = new MenuElement("Accuracy: "+ this.Accuracy.toPrecision(3) + "%", 0,-100,5);
    
   // this.fruit1 = new Fruit(this.kArrow, 0, 0);
    //this.mAllObjs.addToSet(this.fruit1);
    
    //# of fruits, and problem type range
    //this.generateFruit(5,0,1);
       
    //this.startLevel();
    
    this.timer =0;
    this.SPAWN_INTERVAL=120;
         
    this.selectionArrow = new TextureRenderable(this.kArrow);
    this.selectionArrow.getXform().setSize(3, 3);
    
    
    this.basketText = new FontRenderable("Test");
    this.basketText.setColor([0, 0, 0, 1]);
    this.basketText.getXform().setPosition(this.posX, this.posY1);
    this.basketText.setTextHeight(10);
    this.mAllObjs.addToSet(this.basketText);
    
    this.setOperators();
    
    this.friendObject = new SpriteRenderable(this.chipmunk);
    this.friendObject.setElementPixelPositions(0, 421, 1024 - 523, 1024);
    this.friendObject.getXform().setSize(12, 15);
    //this.friendObject.getXform().setPosition(-100,  this.WCCenterY-60);
    
     this.showAnswer = new FontRenderable("");
     
        this.displayText=new FontRenderable("New problem set!");
        this.displayText.setColor([1, 0, 0, 1]);
        this.displayText.getXform().setPosition(70, -50);
        this.displayText.setTextHeight(8.5);
        
        this.rendy = new Renderable();
        this.rendy.getXform().setSize(80, 80);
        this.rendy.setColor([.8, .8, .1, .6]);
        this.rendy.getXform().setPosition(90, -80);
        
        this.displayTime =0;
        
        if(this.musicOn){
         gEngine.AudioClips.stopBackgroundAudio();
         gEngine.AudioClips.playBackgroundAudio(this.fishsong);
        }
     
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BasketScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    //this.mBackground.draw(this.mCamera);
    
    if(this.gameOver)
    {
        this.gameOverText.draw(this.mCamera);
        this.gameOverText2.draw(this.mCamera);
        this.gameOverText3.draw(this.mCamera);
        //this.gameOverText4.draw(this.mCamera);
    } else {
        
        
        this.mAllObjs.draw(this.mCamera);
                this.basketText.draw(this.mCamera);
                
       if(this.displayTime>0){
            this.rendy.draw(this.mCamera);
            this.displayText.draw(this.mCamera);      
        }
                
        for(var i = 0; i < this.Operators.length; i++){
            this.Operators[i].draw(this.mCamera);
        }
        
        
        this.selectionArrow.draw(this.mCamera);

        if (this.helpTableVisible)
        {
           this.helpTableObject.draw(this.mCamera);
        }
        
        for(var i = 0; i < this.scoreMarksArray.length; i++){
            this.scoreMarksArray[i].draw(this.mCamera);
        }   
        if(this.friendVisible){
            //draw Friend
            if(this.helpTimer < 120){
                this.friendObject.draw(this.mCamera);
                this.showAnswer.draw(this.mCamera);
            }
        }
    
    }

    this.accuracyText.draw(this.mCamera);
    
    if(this.revealMsg!=null){
        if(this.revealTime>0){
           this.revealMsg.draw(this.mCamera);
        }
    }
    

};

BasketScene.prototype.update = function () {
    this.checkMusic();
    this.processInput();
    this.updateObjects();
    if(!this.gameOver){
        this.updateObjects();

        //update selection arrow position
       // var pos = this.selectedElement.mFontRenderable.getXform().getPosition();
    
        if(this.timer<=0){
        this.timer=this.SPAWN_INTERVAL;
        if(!this.hasBat){
            this.generateBat();
        }
        }else{
            this.timer--;

        }
    }
    
    if(this.mBat != null && this.gameOver == false){
        if (this.mBat.timer >= this.mBat.DROP_DELAY){
            this.mFruit = this.mBat.dropFruit();
            gEngine.AudioClips.playACue(this.falling);
            this.mAllObjs.addToSet(this.mFruit);
            this.mBat.DROP_DELAY=99999;
            this.mBat.flyAway(); 
        }
    }
    
   this.basketText.getXform().setPosition(this.mHero.getXform().getXPos(),this.mHero.getXform().getYPos() + 9);
   
   if(this.helpTimer <= 120){
       this.helpTimer++;
       
       var x =this.mHero.getXform().getXPos();
       
       var textx=x-20;
       var friendx= x-30;
       
       if(textx<this.WCCenterX-this.WCWidth/2 +10){
        var textx=x+20;    
       }
       
       if(friendx<this.WCCenterX-this.WCWidth/2 +10){
        var friendx=x+30;    
       }
       
       if(textx>this.WCCenterX+this.WCWidth/2 -60){
            var textx=x-140;    
       }
       
       if(friendx>this.WCCenterX+this.WCWidth/2 -60){
            var friendx=x-75;    
       }
       
       
       
       
       
       this.friendObject.getXform().setPosition(friendx,  this.WCCenterY-60);
        this.showAnswer.getXform().setPosition(textx, this.WCCenterY-40);
   }
    
    this.displayTime--;
 };

BasketScene.prototype.updateObjects = function(){
    
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        if(obj instanceof Fruit){
            obj.update();
            //this.fruitGravity(obj);
            if(obj.getXform().getYPos() <= -this.WCHeight / 2 + this.groundHeight){
                this.incrementScore(false);
                gEngine.AudioClips.playACue(this.badcatch);
               
                this.mAllObjs.removeFromSet(obj);
                this.mFruit = null;
            }
        }
        //If Bat Remove
        else if(obj instanceof Bat){
            if(obj.getXform().getYPos()>=this.WCCenterY+this.WCHeight/2 + 10){;
                this.mAllObjs.removeFromSet(this.mBat);
                this.mBat=null;
                this.hasBat=false;
                //obj.getXform().setYPos(0-this.WCHeight/2 + this.groundHeight+1);
                //obj.yv = -1 *obj.yv;               
            }
            if(obj.getXform().getYPos()>=this.WCCenterY+this.WCHeight/2 + 10){
               //obj.getXform().setYPos(this.WCCenterY+this.WCHeight/2 + 9);
               //obj.yv = -1 *obj.yv;   
            }
            obj.update();
        }
        else{           
            obj.update();
        }
    }
    if(this.mFruit != null && this.mHero.checkCollision(this.mFruit)){
        //console.log("collide");
        this.checkAnswer();
        this.mAllObjs.removeFromSet(this.mFruit);
        this.mFruit = null;
            
        //add fruit to the storage
        //generate a new fruit
    }
};

BasketScene.prototype.incrementScore = function(hit){
    //this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    //this.nextMarkX += this.markOffset;
    this.scoreMarksArray.push(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    this.nextMarkX += this.markOffset;
    this.Shots++;
    
    // if the score was incremented with a bad hit, increase number of
    // incorrect/missed asteroids
    if(!hit){
        this.numIncorrect++;
        
    } else {
        this.numCorrect++;
        this.Hits++;
        this.checkNext();
        
    }    
    // toggle gameover state if exceeded gameeover number
    if(this.numIncorrect >= this.gameOverNumber){
        // set this text element to correctly display numCorrect
        this.gameOverText2 = new MenuElement(("Final Score: " + (100-10*this.numIncorrect+10*this.numCorrect)), -20, 0, 10);
        this.gameOver = true;
    }
    
    if(this.numCorrect >= this.succeedNumber || this.gameOver && this.Accuracy >= 70){
        this.gameOverText = new MenuElement("You Win!", -15, 30, 10);
        this.gameOverText2 = new MenuElement(" ", -20, 0, 10);
        this.gameOver = true;
        
        if(localStorage.getItem("Baskets") != "2"){
            localStorage.setItem("Baskets", "1");
        }
        
        //this.win = true;
    }
    if(this.numCorrect >= this.succeedNumber || this.gameOver && this.Accuracy == 100){
        this.gameOverText = new MenuElement(("You Win! Score: "+(200-this.numIncorrect+10*this.numCorrect)), -15, 30, 10);
        this.gameOverText2 = new MenuElement(" ", -20, 0, 10);
        this.gameOver = true;
        localStorage.setItem("Baskets", "2");
        
        //this.win = true;
    }
    // check if y needs to be incremented and x reset
    if(this.nextMarkX >= this.WCCenterX - (this.WCWidth / 2) + this.markOffset + 100){
        this.nextMarkY += this.markOffset;
        this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + this.markOffset;
    }
    
    if(this.Shots!=0){
        this.Accuracy= this.Hits/ this.Shots * 100;
    }    
    this.accuracyText = new MenuElement("Accuracy: "+ this.Accuracy.toPrecision(3) + "%", 0,-100,5);    
};

BasketScene.prototype.processInput = function(){
        //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }
    
    if(!this.gameOver){
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
            this.helpTableVisible = true;
        }
        else
        {
            this.helpTableVisible = false;
        }

        var heroXF = this.mHero.getXform();
        var deltax = 3.0;
                
        //moving basket
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){ 
                if(heroXF.getXPos()>this.WCCenterX-this.WCWidth/2){
                    heroXF.incXPosBy(-1*deltax);    
                }
                this.mHero.changeDir(true);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
               if(heroXF.getXPos()<this.WCCenterX+this.WCWidth/2){
                    heroXF.incXPosBy(deltax);    
                }
                this.mHero.changeDir(false);
        }    
        
                
        //selecting Projectile type:
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)) {
                     
            this.position++;
            
            if(this.position>this.maxPosition){
                this.position=0
            }
            
            this.selectionArrow.getXform().setYPos(this.posY1- this.offSet*this.position);
            this.selectionArrow.getXform().setXPos(this.posX);
            this.limitSelection();
                
            this.selectIndex--;
            
            this.setAnswer();
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
            
            this.limitSelection();
            
            this.position--;
            
            if(this.position<0){
                this.position=this.maxPosition;
            }
            
            this.selectionArrow.getXform().setYPos(this.posY1- this.offSet*this.position);
            this.selectionArrow.getXform().setXPos(this.posX);
            this.selectIndex++;
            
            this.setAnswer();
        }  
                
        //stop all object movement (testing only)
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z)) {

            for (var i = 0; i < this.mAllObjs.size(); i++) {
                var obj = this.mAllObjs.getObjectAt(i);

                if(obj.yv==0){
                    obj.yv=-7;
                }
                else{
                    obj.yv=0;
                }
            }
        }
    
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
            this.problemType++;
            if(this.problemType>4){
                this.problemType=4;
            }
            this.setOperators();
        }
            
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
                this.problemType--;
                if(this.problemType<0){
                    this.problemType=0;
                }
            this.setOperators();
        }
    }    
};


//Generate an asteroid at a random location at the top of the camera view
BasketScene.prototype.generateBat = function () {
        
        // -20 to keep bat text on the screen.
        var xl = this.WCCenterX-this.WCWidth/2 +20+ Math.random()*(this.WCWidth-120);
        
        var yl = this.WCCenterY+ this.WCHeight/2 -20;

        var type=this.problemType;       
        //problem type
        //type = Math.round(Math.random()*this.maxType); 
                
        //type=1;        
        //answer =  true or false.
        var ans = true;
        
        if(this.trueOrFalse){
            if(Math.random()>.5){
                ans = false;
            }
        }
        //console.log(ans);
        
        var Bat1 = new Bat(this.seagull, this.fish, xl, yl, false, type, ans);

        //drop speed
        //Bat1.yv=-14;

        this.mAllObjs.addToSet(Bat1); 
        
        this.hasBat = true;
        this.mBat = Bat1;
};



BasketScene.prototype.fruitGravity = function( fruit ) {
    
    if (fruit.getXform().getYPos() > this.groundLevel){
      //  fruit.mRigidBody.setVelocity(0,50);
      if(!fruit.attached && !fruit.onPlatform){
       // fruit.mRigidBody.mInvMass=1;
       //console.log(fruit.mRigidBody);
       //fruit.mRigidBody.setMass(0.01);
      }
    }
    else{
        fruit.mRigidBody.setMass(0);
        fruit.getXform().setYPos(this.groundLevel);
    }
};

BasketScene.prototype.checkAnswer = function( ) {
    /*
    console.log(this.mBat);
    console.log(this.mBat.answer);
    console.log(this.mBat.correctAnswer);
    console.log("mAsnwer " + this.mAnswer + ".  mBatAnswer " + this.mBat.correctAnswer)
    */
    if (this.mAnswer == this.mBat.correctAnswer){
        this.incrementScore(true);
        gEngine.AudioClips.playACue(this.goodcatch);
    }
    else{

        this.incrementScore(false);
        //gEngine.AudioClips.playACue(this.badcatch);
        //helper speaks
        this.callHelper();
    }
}
BasketScene.prototype.setOperators = function() {
    
   // console.log("Operators");
    
    var posY1 = -75;
    var offSet = 12;
    
    this.offSet = offSet;
    this.posY1 = posY1;
    
    var posY2 = posY1 - offSet;
    var posY3 = posY1 - 2* offSet;
    var posX = 100;
    this.posX = posX -10;
    var textSize = 12;
    
    this.selectionArrow.getXform().setPosition(this.posX, this.posY1);
    
    this.fontRenderable1 = new FontRenderable("1");
    this.fontRenderable1.setColor([0, 0, 0, 1]);
    this.fontRenderable1.getXform().setPosition(posX, posY1);
    this.fontRenderable1.setTextHeight(textSize);
    
    //this.mAllObjs.addToSet(this.fontRenderable1);
    
    this.fontRenderable2 = new FontRenderable("2");
    this.fontRenderable2.setColor([0, 0, 0, 1]);
    this.fontRenderable2.getXform().setPosition(posX, posY2);
    this.fontRenderable2.setTextHeight(textSize);
    
    //this.mAllObjs.addToSet(this.fontRenderable2);

    this.fontRenderable3 = new FontRenderable("3");
    this.fontRenderable3.setColor([0, 0, 0, 1]);
    this.fontRenderable3.getXform().setPosition(posX, posY3);
    this.fontRenderable3.setTextHeight(textSize);
    
    //this.mAllObjs.addToSet(fontRenderable3);
    
    var msg1 = "";
    var msg2 = "";
    var msg3 = "";
    this.maxPosition=1;
     switch (this.problemType){
        case 0:
            msg1 = "==";
            msg2 = "!=";
            break;
        case 1:
            msg1 = ">";
            msg2 = "==";
            msg3 = "<";
            this.maxPosition=2;
            break;
        case 2:
            msg1 = ">=";
            msg2 = "<";            
            break;
        case 3:
            msg1 = "<=";
            msg2 = ">";           
            break;
        case 4:
            msg1 = "true";
            msg2 = "false";              
            break;
    }
    
    this.fontRenderable1.setText(msg1);
    this.fontRenderable2.setText(msg2);
    this.fontRenderable3.setText(msg3);
    
    this.Operators=[this.fontRenderable1, this.fontRenderable2, this.fontRenderable3];
    
    if(this.basketText==null){
    this.basketText = new FontRenderable("msg1");
    this.basketText.setColor([0, 0, 0, 1]);
    this.basketText.getXform().setPosition(posX, posY3);
    this.basketText.setTextHeight(textSize);
    //this.mAllObjs.addToSet(this.basketText);
    }
    
    this.position=0;
    
    this.setAnswer();
    this.displayChange();
   
 }

// 
     /*  const EQUAL = 0;
        const NOT_EQUAL = 1;
        const GREATER = 2;
        const LESSER = 3;
        const GREATER_OR_EQUAL = 4;
        const LESSER_OR_EQUAL = 5;
        const LOGICAL_AND = 6;
        const LOGICAL_OR = 7;
     */
    
    // Problem Types
    //0 !=    ==
    //1 <   ==   >
    //2 >=   <
    //3 <=   >
    //4 && ||
BasketScene.prototype.setAnswer = function() {
    this.mAnswer=0;
    var choices = [];
    var msgs = [];
         switch (this.problemType){
        case 0:
            choices = [0,1];
            msgs = ["==", "!="];
            break;
        case 1:
            choices = [2,0,3];
            this.maxPosition=2;
            msgs = [">", "==", "<"];
            break;
        case 2:
            choices = [4,3];
            msgs = [">=", "<"];
            break;
        case 3:
            choices = [5,2]; 
            msgs = ["<=", ">"];
            break;
        case 4:
            choices = [6,7]; 
            msgs = ["true", "false"];
            break;
    }
    this.basketText.setText(msgs[this.position]);
    
    
//    this.basketText = new FontRenderable("lolol");
//    this.basketText.setColor([0, 0, 0, 1]);
//    this.basketText.getXform().setPosition(this.posX, this.posY1);
//    this.basketText.setTextHeight(10);
//    this.mAllObjs.addToSet(this.basketText);
    
    this.mAnswer = choices[this.position];
    
}

BasketScene.prototype.checkNext = function() {
     
    this.successCount++;
        //console.log("check next " + this.successCount);
    
    if(this.successCount >= this.THRESHOLD){
        
        //console.log("Problem Type " + this.ProblemType);
        
        if(this.problemType>=this.MAX_TYPE){
            this.gameOver=true;
            console.log("game won");
        }else{
            this.successCount = 0;
            this.problemType++;
            
            this.setOperators();
            this.timer= 2.5*this.SPAWN_INTERVAL;
        }   
    }

};

BasketScene.prototype.callHelper = function() {
    this.friendVisible = true;
    this.helpTimer = 0;
   // this.mbat.correctAnswer;
    var solution = "Oops! " + this.mBat.text.getText();
    var answer = "";
        switch (this.mBat.correctAnswer){
            case 0:
                answer = "==";
                break;
            case 1:
                answer = "!=";
                break;
            case 2:
                answer = ">";
                break;
            case 3:
                answer = "<";
                break;
            case 4:
                answer = ">=";
                break;
            case 5:
                answer = "<=";
                break;
            case 6:
                answer = "true";
                break;
            case 7:
                answer = "false";
                break;
        }
    solution = solution.replace("__", answer);
    //console.log(solution);
    
   
    this.showAnswer.setColor([0, .5, 1, 1]);
    this.showAnswer.setText(solution);
    this.showAnswer.setTextHeight(10);
    
}