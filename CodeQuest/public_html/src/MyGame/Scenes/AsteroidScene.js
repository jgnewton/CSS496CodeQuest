/*
 * File: AsteroidScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function AsteroidScene() {
    
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";
    this.kForest = "assets/Forest2.png";
    this.kEarth = "assets/Earth.png";
    this.kMW = "assets/MW2.jpg";
    
    this.scoreMarks = "assets/checksandx.png"
    this.kArrow = "assets/MenuSelectArrow.png";
    this.helpTable = "assets/AsteroidHelp.PNG";
    
    // new assets
    this.mGrass = "assets/MeteorGame/grassyellow.png";
    this.mMountain = "assets/MeteorGame/mountainyellow.png";
    this.mBg1 = "assets/MeteorGame/sunset.png";
    this.mBg2 = "assets/MeteorGame/sunnyday.png";
    this.mCloud = "assets/MeteorGame/clouds.png";
    this.mCannonSprite = "assets/MeteorGame/cannon.png";
    
    this.mCannonBase = "assets/MeteorGame/cannonbaseyellow.png";
    this.mCannonMuzzle = "assets/MeteorGame/cannonmuzzle.png";
    this.mMeteorSprite = "assets/MeteorGame/meteorexplosion.png";
    
    // The camera to view the scene
    this.mCamera = null;

    //this.mMsg = null;
    this.mShapeMsg = null;

    this.mAllObjs = null;
    this.mBounds = null;
    this.mCollisionInfos = [];
    this.mHero = null;
    this.mCannon = null;
    
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
    this.gameOverNumber = 5;

    this.succeedNumber = 10;
    //this.win = false;
    
    // when gameOver is true, we display the player's score and prompt them
    // to play again or return to main menu
    this.gameOver = false;
    this.gameOverText = null;
    this.gameOverText2 = null;
    this.gameOverText3 = null;
    this.gameOverText4 = null;
    
    this.Accuracy=null;
    this.Shots=null;
    this.Hits=null;
    
    this.revealMsg = null;
    
    this.fireTimer = 60;
    this.fireRate = 60;
    this.canFire = true;
    
    this.burstCount = 0;
    
    this.Ray=null;
    
    this.musicOn=true;
}
gEngine.Core.inheritPrototype(AsteroidScene, Scene);


AsteroidScene.prototype.loadScene = function () {
    
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
    
    gEngine.Textures.loadTexture(this.mGrass);
    gEngine.Textures.loadTexture(this.mMountain);
    gEngine.Textures.loadTexture(this.mBg1);
    gEngine.Textures.loadTexture(this.mBg2);
    gEngine.Textures.loadTexture(this.mCloud);
    gEngine.Textures.loadTexture(this.mCannonSprite);
    
    gEngine.Textures.loadTexture(this.mCannonBase);
    gEngine.Textures.loadTexture(this.mCannonMuzzle);
    
    gEngine.Textures.loadTexture(this.mMeteorSprite);
    
        //sounds
    this.asteroidsong = "assets/Sounds/asteroidScene.mp3";
    this.music="assets/Sounds/asteroidScene.mp3";
    
    this.firing = "assets/Sounds/firing.mp3";
    this.explosion = "assets/Sounds/Explosion.mp3";
    this.laser = "assets/Sounds/laser.mp3";
    gEngine.AudioClips.loadAudio(this.asteroidsong);
    gEngine.AudioClips.loadAudio(this.music);
    gEngine.AudioClips.loadAudio(this.firing);
    gEngine.AudioClips.loadAudio(this.explosion);
    gEngine.AudioClips.loadAudio(this.laser);
};

AsteroidScene.prototype.unloadScene = function () {
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
    
    gEngine.Textures.unloadTexture(this.mGrass);
    gEngine.Textures.unloadTexture(this.mMountain);
    gEngine.Textures.unloadTexture(this.mBg1);
    gEngine.Textures.unloadTexture(this.mBg2);
    gEngine.Textures.unloadTexture(this.mCloud);
    gEngine.Textures.unloadTexture(this.mCannonSprite);
    
    gEngine.Textures.unloadTexture(this.mCannonBase);
    gEngine.Textures.unloadTexture(this.mCannonMuzzle);
    gEngine.Textures.unloadTexture(this.mMeteorSprite);
    
    var MG = new MyGame();
    gEngine.Core.startScene(MG); 
};

AsteroidScene.prototype.initialize = function () {
    setControlText("Meteors");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(this.WCCenterX, this.WCCenterY), // position of the camera
        this.WCWidth,                     // width of camera
        [0, 0, this.VPWidth, this.VPHeight]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(2.6);
          
    //object Set
    this.mAllObjs = new GameObjectSet();   
       
    //this.background = new TextureRenderable(this.mBg1);
    this.background = new TextureRenderable(this.mBg1);
    this.background.getXform().setPosition(0, 0);
    this.background.getXform().setRotationInDegree(0); // In Degree
    this.background.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.background);
    
    this.mountainyellow = new TextureRenderable(this.mMountain);
    this.mountainyellow.getXform().setPosition(0, 0);
    this.mountainyellow.getXform().setRotationInDegree(0); // In Degree
    this.mountainyellow.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.mountainyellow);
    
    //configure ground (currently a solid color green)
    // in the future it should be a texture renderable
    //this.ground = new Renderable(gEngine.DefaultResources.getConstColorShader());
    //this.ground.setColor([0, 1, 0, 1]);
    
    this.ground = new TextureRenderable(this.mGrass);
    
    // bottom of the viewport = -WCHeight / 2
    this.groundHeight = this.WCHeight / 4.5;
    //this.ground.getXform().setPosition(0, -this.WCHeight / 2 + this.groundHeight / 2);
    this.ground.getXform().setPosition(0, 0);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.ground);
    
    //create hero and add to set
    /*
    this.mHero = new Hero(this.kMinionSprite);
    this.mHero.mDye.getXform().setPosition(this.WCCenterX, this.WCCenterY-60);
    this.mAllObjs.addToSet(this.mHero);
    */
    
    this.mCannon = new Cannon(this.mCannonBase, this.mCannonMuzzle);
    //this.mCannon.base.getXform().setPosition(this.WCCenterX, this.WCCenterY-60);
    //this.mCannon.cannon.getXform().setPosition(this.WCCenterX, this.WCCenterY-50);
    //this.mAllObjs.addToSet(this.mCannon);
   
    
    // background init
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    var bxf=this.mBackground.getXform();
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);

    // initialize the text that represents data types
    
    var textSize = 7.5;
    var textYpos = -this.WCHeight / 2 + this.groundHeight / 8;
    var textXPos = 110;
    var textOffset = 10;
    this.intText = new MenuElement("int", textXPos, textYpos + textOffset * 4, textSize);
    this.doubleText = new MenuElement("double", textXPos, textYpos + textOffset * 3, textSize);
    this.boolText = new MenuElement("boolean", textXPos, textYpos + textOffset * 2, textSize);
    this.charText = new MenuElement("char", textXPos, textYpos + textOffset, textSize);
    this.stringText = new MenuElement("String", textXPos, textYpos, textSize);
    //this.stage3Pegs = new MenuElement("Stage 3 Cat-chinko", 30, 35, 3)
    
    
    this.elements = [
        this.intText,
        this.doubleText,
        this.boolText,
        this.charText,
        this.stringText
    ];
    
    for(var i =0; i< this.elements.length; i++){
        var e = this.elements[i];
        e.setColor([0,1,1,1]);
    }
    
    this.selectedElement = this.intText;
    this.selectionArrow = new TextureRenderable(this.kArrow);
    this.selectionArrow.getXform().setSize(3, 3);
    this.helpTableObject = new TextureRenderable(this.helpTable);
    this.helpTableObject.getXform().setSize(210, 80);
    
    this.gameOverText = new MenuElement("Game Over", -15, 30, 10);
    this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -25, 0, 10);
    this.gameOverText3 = new MenuElement("Press X to return to overworld", -70, -30, 10);
    //this.gameOverText4 = new MenuElement("Press Space to play again", -45, -60, 10);
    
    this.Accuracy=0;
    this.Hits=0;
    this.Shots=0;
    
    this.accuracyText = new MenuElement("Success Rate: "+ this.Accuracy.toPrecision(3) + "%", 10,-100,5);
    this.accuracyText.setColor([0,1,1,1]);
    
    this.revealTime=0;
    
    
    this.mCannon.intRotByDeg(0.01);
    
            
         if(this.musicOn){
         gEngine.AudioClips.stopBackgroundAudio();    
         gEngine.AudioClips.playBackgroundAudio(this.asteroidsong);
        }
    
    //debugging
    //this.generateAsteroid(true, 10,100);
    //this.generateAsteroid(true, 100,-60);
    //this.GenerateOn=false;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
AsteroidScene.prototype.draw = function () {
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
    
        for(var i = 0; i < this.elements.length; i++){
            //console.log(this.elements[i]);
            this.elements[i].draw(this.mCamera);
        }

        this.selectionArrow.draw(this.mCamera);

        
        for(var i = 0; i < this.scoreMarksArray.length; i++){
            //console.log(this.elements[i]);
            this.scoreMarksArray[i].draw(this.mCamera);
        }
        
        if(this.Ray!=null){
            //this.Ray.draw(this.mCamera);
        }

        this.mCannon.draw(this.mCamera);
    
    
        if(this.revealMsg!=null){
            if(this.revealTime>0){
               this.revealMsg.draw(this.mCamera);
            }
        }

        if (this.helpTableVisible)
        {
           this.helpTableObject.draw(this.mCamera);
        }
    
    }
     this.accuracyText.draw(this.mCamera);
    
};

AsteroidScene.prototype.update = function () {
     this.checkMusic();
    this.processInput();
    
    if(!this.gameOver){
        this.updateObjects();

        //update selection arrow position
        var pos = this.selectedElement.mFontRenderable.getXform().getPosition();
        this.selectionArrow.getXform().setPosition(pos[0] - 5, pos[1] - 0.5);


        //updating the generating of asteroids
        this.genTimer++;
        if(this.genTimer>=350){
            this.generateAsteroid();
            this.genTimer=0;
        }
        
        this.fireTimer++;
        if(this.fireTimer >= this.fireRate){
            //this.generateAsteroid();
            this.canFire = true;
            //this.genTimer=0;
        } else{
            this.canFire = false;
        }
    }

    this.mCannon.update();
    this.revealTime--;
        
};

AsteroidScene.prototype.updateObjects = function(){
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        obj.update();
        // if asteroid, check for collision with projectils
        if(obj instanceof Asteroid ){
                        
            //console.log(this.ground.getBBox());
            //console.log(obj.bound);
           
            //var groundBound = ;
            
            // for some reason the Asteroid never collides with the ground... But
            // the intersectsBound call does happen and returns false
            //console.log(obj.bound.intersectsBound(this.ground.getBBox()));
            //if(obj.bound.intersectsBound(this.ground.getBBox())!= 0){
            //var groundHeight = this.WCHeight / 4.5;
            //this.ground.getXform().setPosition(0, -this.WCHeight / 2 + groundHeight / 2);
            if(obj.getXform().getYPos() <= -this.WCHeight / 2 + this.groundHeight){
                //console.log("asteroid collision with ground");
                this.incrementScore(false);
                this.mAllObjs.removeFromSet(obj);
                this.mCamera.shake(-10, -10, 40, 60);
                gEngine.AudioClips.playACue(this.explosion);
            }
            
            // check collision of this asteroid with all projectiles
            for (var j = 0; j < this.mAllObjs.size(); j++) {                
                var proj = this.mAllObjs.getObjectAt(j);
                if(proj instanceof Projectile){
                                       
                    var projectileBound = proj.getBBox();
                                       
                    if(obj.bound.intersectsBound(projectileBound)!= 0){                     
                        this.procHit(obj, proj);                        
                    }   
                }
            }       
        }
        //checking for projectile termination (upon leaving camera view)
        else if(obj instanceof Projectile){
            obj.testTerminated([this.WCCenterX, this.WCCenterY, this.WCWidth, this.WCHeight]);
            if (obj.terminated){
                if(obj.type == 2){
                    this.Ray = null;
                }
                this.mAllObjs.removeFromSet(obj);
                
            }
        }
    }
    this.mCamera.update();
};

AsteroidScene.prototype.incrementScore = function(hit){
    //console.log("score incremented");
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
    }
    
    // toggle gameover state if exceeded gameeover number
    if(this.numIncorrect >= this.gameOverNumber){
        // set this text element to correctly display numCorrect
        this.gameOverText = new MenuElement("You Lose! Try Again!", -30, 30, 10);
        this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -20, 0, 10);
        this.gameOver = true;
        //this.win = false;
    }
    if(this.numCorrect >= this.succeedNumber && this.Accuracy != 100){
        this.gameOverText = new MenuElement("You Win!", -15, 30, 10);
        this.gameOverText2 = new MenuElement(" ", -20, 0, 10);
        this.gameOver = true;
        this.accuracyText.setColor([0,0,0,1]);
        if(localStorage.getItem("Meteors") != "2"){
            localStorage.setItem("Meteors", "1");
        }
        
        //this.win = true;
    }
    if(this.numCorrect >= this.succeedNumber && this.Accuracy == 100){
        this.gameOverText = new MenuElement("You Win!", -15, 30, 10);
        this.gameOverText2 = new MenuElement(" ", -20, 0, 10);
        this.gameOver = true;
        this.accuracyText.setColor([0,0,0,1]);
        localStorage.setItem("Meteors", "2");
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
    
    this.accuracyText = new MenuElement("Success Rate: "+ this.Accuracy.toPrecision(3) + "%", 10,-100,5);
    this.accuracyText.setColor([0,1,1,1]);
};

AsteroidScene.prototype.processInput = function(){
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


        //selecting Projectile type:
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {

            this.selectIndex--;
            
            if(this.selectIndex<0){
                this.selectIndex=this.elements.length-1;
            }
            //this.selectIndex = clamp(this.selectIndex, 0, this.elements.length - 1);
            
            
            this.selectedElement = this.elements[this.selectIndex];
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)) {
            this.selectIndex++;
            
            //this.selectIndex = clamp(this.selectIndex, 0, this.elements.length - 1);
            
            if(this.selectIndex>this.elements.length-1){
                this.selectIndex=0;
            }
            
            this.selectedElement = this.elements[this.selectIndex];
        }    
        /*
        var heroXF = this.mHero.getXform();
        
        
        //roate hero firing cannon, clamped at 100 and -100
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            heroXF.incRotationByDegree(1.5);
            
            if(heroXF.getRotationInDegree()>100){
               heroXF.setRotationInDegree(100);
            }
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            heroXF.incRotationByDegree(-1.5);
            
            if(heroXF.getRotationInDegree()<-100){
               heroXF.setRotationInDegree(-100);
            }
        }
        */
       //var heroXF = this.mHero.getXform();
        
        
        //roate cannon firing cannon, clamped at 100 and -100
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
            this.mCannon.intRotByDeg(1.5);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
            this.mCannon.intRotByDeg(-1.5);
        }
        
        //fire
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
            if(this.canFire){
                this.fireTimer = 0;
                this.generateProjectile();
            }
            
        }
        
        
        /*
        //debugging to display asteroid coordinates
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Y)) {
            for (var i = 0; i < this.mAllObjs.size(); i++) {
                var obj = this.mAllObjs.getObjectAt(i);

                //written like this because displayCoord is not defined in all objects
                if(obj.displayCoord){
                    obj.displayCoord=false;
                }else{
                   obj.displayCoord=true;   
                }
            }
        }
        
        //turn off or on asteroid generation
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.G)) {
            this.GenerateOn=!this.GenerateOn; 
            console.log("generating Asteroids: " + this.GenerateOn);
        }
        
        //stop or start asteroid movement
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {

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
        */
    }
    
};


//Generate an asteroid at a random location at the top of the camera view
AsteroidScene.prototype.generateAsteroid = function (nospeed, xx, yy) {
     
    if(this.GenerateOn){
        var xl = this.WCCenterX-this.WCWidth/2 + Math.random()*(this.WCWidth - 20);
        
        if(xl<this.WCCenterX-this.WCWidth/2+15){
            xl =this.WCCenterX-this.WCWidth/2+15; 
        }
        
        var yl = 120;

        var type=0;

        type = Math.round(Math.random()*this.maxType);  
        
        if(nospeed){
            xl=xx;
            yl=yy;
        }
        
        var Asteroid1 = new Asteroid(this.mMeteorSprite, xl, yl, false, type);

        //drop speed
        Asteroid1.yv=-7;
        
        if(nospeed){
            Asteroid1.yv=0;
            Asteroid1.mRigidBody.setMass(0);
        }

        this.mAllObjs.addToSet(Asteroid1); 
    }
};


//generating projectiles
AsteroidScene.prototype.generateProjectile = function () {
            //get hero state info
    var hxf = this.mCannon.cannon.getXform();
    var xp = hxf.getXPos();
    var yp = hxf.getYPos();

    //get in radians for Math javascript func
    var rot = this.mCannon.cannon.getXform().getRotationInRad();

    var w = 10;
    var h = 10;
    //create new projectile
    //console.log("selection"+this.selection);
    var p = new Projectile(this.kPlatformTexture, xp, yp, w, h, false, this.selectIndex);

    //setting projectile velocity
    this.maxV=100;
    
    var v = 1;
    gEngine.AudioClips.playACue(this.firing);
    if(this.selectIndex == 0){
        // int
        v = 3;
        p.getXform().setSize(6, 6);
        this.fireRate = 60;
    } else if(this.selectIndex == 1){
        //double
        this.fireRate = 30;
    } else if(this.selectIndex==2){
        //bool
        gEngine.AudioClips.playACue(this.laser);
        
        this.fireRate = 60;
        
        this.maxV=0;
        p.getXform().setRotationInRad(rot);

        p.getXform().setSize(2,2000);
        
        var xd = Math.sin(rot) * 1000;
        var yd = Math.cos(rot) * 1000;
        
        //take original projectile position and adjust so end of laser starts at hero
        //subtract because positive angles are to left (-x) 
        p.getXform().setXPos(xp - xd);
        p.getXform().setYPos(yp+yd);

        p.lifeTime=10;

        this.rayCast(p);
        
        this.Ray = p;
    } else if(this.selectIndex == 3){
        //char
        this.fireRate = 30;
        
        v = .5;
        p.getXform().setSize(15, 15);
    } else if(this.selectIndex == 4){
        //string
        v = 1.25;
        
        this.burstCount++;
        if(this.burstCount >= 4){
            this.burstCount = 0;
            this.fireRate = 45;
        } else {
            this.fireRate = 5;
        }
    }
         

    var xv = this.maxV*Math.sin(rot) *-1 ; //for some reason 2d game engine rotates one way in practice...
    var yv = this.maxV*Math.cos(rot);

    p.xv=xv * v;
    p.yv=yv * v;

    //adding projectile to set
    this.mAllObjs.addToSet(p);  
}


//checking for raycast collisions
AsteroidScene.prototype.rayCast = function (p) {
    //the Actual Rotation of the Hero.
     var theta = this.mCannon.cannon.getXform().getRotationInRad();
    console.log("raycast: "+(theta*180/Math.PI));
    
    for (var i = 0; i < this.mAllObjs.size(); i++) {
      
        var ast= this.mAllObjs.getObjectAt(i);
        
        if(ast instanceof Asteroid){

            var axf = ast.getXform();
            
            var astx = axf.getXPos();
            var asty = axf.getYPos();
                              
            //ray to far bottom corner
            var thetaMax=0;

            //ray to near top corner
            var thetaMin=0;
            
            var theta1=0;
            var theta2=0
            var theta3=0;
            var theta4=0;
            
            var dyT = asty - this.mCannon.cannon.getXform().getYPos() + axf.getHeight()/2;
            var dyB = asty - this.mCannon.cannon.getXform().getYPos() - axf.getHeight()/2;
            var dxR = astx - this.mCannon.cannon.getXform().getXPos() - axf.getWidth()/2;
            var dxL = astx - this.mCannon.cannon.getXform().getXPos() + axf.getWidth()/2;

                //top right
                theta1= Math.abs(Math.atan(Math.abs(dxR/dyT)));
                //top left
                theta2= Math.abs(Math.atan(Math.abs(dxL/dyT)));
                //bottom right
                theta3= Math.abs(Math.atan(Math.abs(dxR/dyB)));
                //bottom left
                theta4= Math.abs(Math.atan(Math.abs(dxL/dyB)));
                
                // since we got absolute values, will be reflected when on right side
                if(astx>this.mCannon.cannon.getXform().getXPos()){
                    theta1*=-1;
                    theta2*=-1;
                    theta3*=-1;
                    theta4*=-1;
                }
                
                // when asteroid is more than 90 degrees, need to rereference the inverse tangent
                if(asty<this.mCannon.cannon.getXform().getYPos()){
                    if(astx<this.mCannon.cannon.getXform().getXPos()){
                        //top right
                        theta1= (Math.PI/2)+ Math.abs(Math.atan(dyT/dxR));
                        //top left
                        theta2= (Math.PI/2)+ Math.abs(Math.atan(dyT/dxL));
                        //bottom right
                        theta3= (Math.PI/2)+ Math.abs(Math.atan(dyB/dxR));
                        //bottom left
                        theta4= (Math.PI/2)+ Math.abs(Math.atan(dyB/dxL));
                     }
                     else{
                        //top right
                       theta1= (Math.PI/-2)- Math.abs(Math.atan(dyT/dxR));
                       //top left
                       theta2= (Math.PI/-2)- Math.abs(Math.atan(dyT/dxL));
                       //bottom right
                       theta3= (Math.PI/-2)- Math.abs(Math.atan(dyB/dxR));
                       //bottom left
                       theta4= (Math.PI/-2)- Math.abs(Math.atan(dyB/dxL));                   
                    }
                }
                               

                if(theta1>=theta2 && theta1>=theta3 && theta1>=theta4){
                    thetaMax = theta1;
                }
                else if (theta2>=theta1 && theta2>=theta3 && theta2>=theta4){
                    thetaMax = theta2;
                }
                else if (theta3>=theta1 && theta3>=theta2 && theta3>=theta4){
                    thetaMax = theta3;
                }else{
                    thetaMax=theta4;
                }
                
                if(theta1<=theta2 && theta1<=theta3 && theta1<=theta4){
                    thetaMin = theta1;
                }
                else if (theta2<=theta1 && theta2<=theta3 && theta2<=theta4){
                    thetaMin = theta2;
                }
                else if (theta3<=theta1 && theta3<=theta2 && theta3<=theta4){
                    thetaMin = theta3;
                }else{
                    thetaMin=theta4;
                }           
                 
                 // cases where asteroid straddles the origin
                 if(Math.abs(astx)<axf.getWidth()){
                    if(astx<0){
                        thetaMin*=-1;
                    }else{
                        thetaMax*=-1;
                    }
                 }
                 
            //console.log(" theta: "+theta*180/Math.PI + " thetaMAx:"+thetaMax*180/Math.PI + " thetaMin"+thetaMin*180/Math.PI);
            
            // displaying Boundary rays for debugging, uncommong add rends to set to see them
                    var bx = this.mCannon.cannon.getXform().getXPos();
                    var by = this.mCannon.cannon.getXform().getYPos();
                    
                if(astx<=0){
                    var rend = new Renderable();
                    rend.setColor([0,1,0,1]);                                                    
                    rend.getXform().setPosition(bx,by);
                    rend.getXform().setSize(1,2000);
                    rend.getXform().setRotationInRad(thetaMin);
                    
                    //this.mAllObjs.addToSet(rend);
                    
                var rend2 = new Renderable();
                    rend2.setColor([1,0,0,1]);  
                    rend2.getXform().setPosition(bx,by);
                    rend2.getXform().setSize(1,2000);
                    rend2.getXform().setRotationInRad(thetaMax);
                    
                    //this.mAllObjs.addToSet(rend2);
                }
                else{
                    var rend = new Renderable();
                    rend.setColor([0,0,0,1]);                                                    
                    rend.getXform().setPosition(bx,by);
                    rend.getXform().setSize(1,2000);
                    rend.getXform().setRotationInRad(thetaMin);
                    
                    //this.mAllObjs.addToSet(rend);
                    
                var rend2 = new Renderable();
                    rend2.setColor([1,1,1,1]);  
                    rend2.getXform().setPosition(bx,by);
                    rend2.getXform().setSize(1,2000);
                    rend2.getXform().setRotationInRad(thetaMax);
                    
                    //this.mAllObjs.addToSet(rend2);
                }
            
          
            //check if in possible theta range for collision

                if(theta>=thetaMin && theta <=thetaMax){
                  console.log("Ray Hit! SelectionIndex:"+this.selectIndex+" asteroidDataType:"+ast.dataType);
                  console.log(" theta: "+theta*180/Math.PI + " thetaMAx:"+thetaMax*180/Math.PI + " thetaMin"+thetaMin*180/Math.PI);
                  this.procHit(ast, p);
                }else{
                   console.log("Miss! theta: "+theta*180/Math.PI + " thetaMAx:"+thetaMax*180/Math.PI + " thetaMin"+thetaMin*180/Math.PI);   
                }         
            
          }
    }  
}

AsteroidScene.prototype.procHit = function(obj, proj) {   
    //for making reveal message
    
    gEngine.AudioClips.playACue(this.explosion);
    
    var x = obj.getXform().getXPos();
    var y = obj.getXform().getYPos();
    var type = obj.dataType;
    
    if(obj.dataType == proj.dataType){
        this.incrementScore(true);
        this.mAllObjs.removeFromSet(obj);
        this.mAllObjs.removeFromSet(proj);

    } else if (obj.dataType == 0 && proj.dataType == 1){
        this.incrementScore(true);
        this.mAllObjs.removeFromSet(obj);
        this.mAllObjs.removeFromSet(proj);
    } else{
        this.incrementScore(false);
        var ans = obj.text.getText();
        this.mAllObjs.removeFromSet(obj);
        this.mAllObjs.removeFromSet(proj);

        // display a reveal message
        var text="Oops! " + ans + " was a ";
        if(type==0){
            text += "int";
        }
            if(type==1){
            text += "double";
        }
            if(type==2){
            text += "boolean";
        }
            if(type==3){
            text += "char";
        }
            if(type==4){
            text += "string";
        }

        this.revealMsg = new FontRenderable(text);
        this.revealMsg.setColor([0, 1, 1, 1]);
        this.revealMsg.getXform().setPosition(x, y);
        this.revealMsg.setTextHeight(5);
        this.revealTime=150;
    }
    
};