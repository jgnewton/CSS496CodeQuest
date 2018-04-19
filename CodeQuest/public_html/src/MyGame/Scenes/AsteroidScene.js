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
    this.scoreMarks = "assets/scoreMarks.png"
    this.kArrow = "assets/MenuSelectArrow.png";
    this.helpTable = "assets/AsteroidHelp.PNG";
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
    this.nextMarkY = this.WCCenterY + (this.WCHeight / 2) - this.markOffset;
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
    this.gameOverNumber = 1;
    
    // when gameOver is true, we display the player's score and prompt them
    // to play again or return to main menu
    this.gameOver = false;
    this.gameOverText = null;
    this.gameOverText2 = null;
    this.gameOverText3 = null;
    this.gameOverText4 = null;
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
    
    var MG = new MyGame();
    gEngine.Core.startScene(MG); 
};

AsteroidScene.prototype.initialize = function () {
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
    
    //create hero and add to set
    this.mHero = new Hero(this.kMinionSprite);
    this.mHero.mDye.getXform().setPosition(this.WCCenterX, this.WCCenterY-60);
    this.mAllObjs.addToSet(this.mHero);
    
    
    //configure ground (currently a solid color green)
    // in the future it should be a texture renderable
    this.ground = new Renderable(gEngine.DefaultResources.getConstColorShader());
    this.ground.setColor([0, 1, 0, 1]);
    // bottom of the viewport = -WCHeight / 2
    this.groundHeight = this.WCHeight / 4.5;
    this.ground.getXform().setPosition(0, -this.WCHeight / 2 + this.groundHeight / 2);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, this.groundHeight);
    this.mAllObjs.addToSet(this.ground);
    
   /*
   // Selection message
    this.mShapeMsg = new FontRenderable("Current Selection: "+this.selection);
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(this.WCCenterX-this.WCWidth/2, this.WCCenterY-80);
    this.mShapeMsg.setTextHeight(7.5);
    */
    
    // background init
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    var bxf=this.mBackground.getXform();
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    
    /*
     *     if(this.selection==0){
        selection = "Integer";
    }
        if(this.selection==1){
        selection = "Double";
    }
        if(this.selection==2){
        selection = "Boolean";
    }
        if(this.selection==3){
        selection = "Char";
    }
        if(this.selection==4){
        selection = "String";
    }
     */
    // initialize the text that represents data types
    
    var textSize = 5;
    var textYpos = -this.WCHeight / 2 + this.groundHeight / 8;
    var textXPos = 110;
    var textOffset = 10;
    this.intText = new MenuElement("Int", textXPos, textYpos + textOffset * 4, textSize);
    this.doubleText = new MenuElement("Double", textXPos, textYpos + textOffset * 3, textSize);
    this.boolText = new MenuElement("Boolean", textXPos, textYpos + textOffset * 2, textSize);
    this.charText = new MenuElement("Char", textXPos, textYpos + textOffset, textSize);
    this.stringText = new MenuElement("String", textXPos, textYpos, textSize);
    //this.stage3Pegs = new MenuElement("Stage 3 Cat-chinko", 30, 35, 3);
    
    this.elements = [
        this.intText,
        this.doubleText,
        this.boolText,
        this.charText,
        this.stringText
    ];
    
    this.selectedElement = this.intText;
    this.selectionArrow = new TextureRenderable(this.kArrow);
    this.selectionArrow.getXform().setSize(3, 3);
    this.helpTableObject = new TextureRenderable(this.helpTable);
    this.helpTableObject.getXform().setSize(180, 80);
    
    this.gameOverText = new MenuElement("Game Over", -15, 30, 10);
    this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -25, 0, 10);
    this.gameOverText3 = new MenuElement("Press X to return to overworld", -70, -30, 10);
    //this.gameOverText4 = new MenuElement("Press Space to play again", -45, -60, 10);
    
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

        if (this.helpTableVisible)
        {
           this.helpTableObject.draw(this.mCamera);
        }
    }
    
    
    
    // for now draw these ...
    /*for (var i = 0; i<this.mCollisionInfos.length; i++) 
        this.mCollisionInfos[i].draw(this.mCamera); */
    //this.mCollisionInfos = []; 
    
    //this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    //this.mShapeMsg.draw(this.mCamera);

};

AsteroidScene.prototype.update = function () {
    this.processInput();
    this.updateObjects();
    
    //update selection arrow position
    var pos = this.selectedElement.mFontRenderable.getXform().getPosition();
    this.selectionArrow.getXform().setPosition(pos[0] - 5, pos[1] - 0.5);

    /*
    //debuggin messages
    var selection = "";
    if(this.selection==0){
        selection = "Integer";
    }
        if(this.selection==1){
        selection = "Double";
    }
        if(this.selection==2){
        selection = "Boolean";
    }
        if(this.selection==3){
        selection = "Char";
    }
        if(this.selection==4){
        selection = "String";
    }
    this.mShapeMsg.setText("Current Selection : "+selection);  
    */
    //this.generateProjectile();
    
    //updating projectiles (object) set
    
    //updating the generating of asteroids
    this.genTimer++;
    if(this.genTimer>=350){
        this.generateAsteroid();
        this.genTimer=0;
    }

    // don't call rayCast 60 times per second, should be called when pressing fire right?
    //this.rayCast();
    
};

AsteroidScene.prototype.updateObjects = function(){
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        obj.update();
        
        
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
            }
            
            // check collision of this asteroid with all projectiles
            for (var j = 0; j < this.mAllObjs.size(); j++) {
                
                var proj = this.mAllObjs.getObjectAt(j);
                if(proj instanceof Projectile){
                                       
                    var projectileBound = proj.getBBox();
                                       
                    if(obj.bound.intersectsBound(projectileBound)!= 0){
                        if(obj.dataType == proj.dataType){
                            this.incrementScore(true);
                            this.mAllObjs.removeFromSet(obj);
                            this.mAllObjs.removeFromSet(proj);
                            
                        }
                        else{
                            this.incrementScore(false);
                            this.mAllObjs.removeFromSet(obj);
                            this.mAllObjs.removeFromSet(proj);
                        }
                    }
                    
                }
            }      
        
        }
        else if(obj instanceof Projectile){
            obj.testTerminated([this.WCCenterX, this.WCCenterY, this.WCWidth, this.WCHeight]);
            if (obj.terminated){
                this.mAllObjs.removeFromSet(obj);
            }
        }
    }
};

AsteroidScene.prototype.incrementScore = function(hit){
    //console.log("score incremented");
    //this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    //this.nextMarkX += this.markOffset;
    this.scoreMarksArray.push(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    this.nextMarkX += this.markOffset;
    
    // if the score was incremented with a bad hit, increase number of
    // incorrect/missed asteroids
    if(!hit){
        this.numIncorrect++;
    } else {
        this.numCorrect++;
    }
    
    // toggle gameover state if exceeded gameeover number
    if(this.numIncorrect >= this.gameOverNumber){
        // set this text element to correctly display numCorrect
        this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -20, 0, 10);
        this.gameOver = true;
    }
    // check if y needs to be incremented and x reset
    if(this.nextMarkX >= this.WCCenterX - (this.WCWidth / 2) + this.markOffset + 100){
        this.nextMarkY -= this.markOffset;
        this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + this.markOffset;
    }
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



        //selecting Ray type:
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left) ||
                gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {

            this.selectIndex--;
            this.selectIndex = clamp(this.selectIndex, 0, this.elements.length - 1);
            this.selectedElement = this.elements[this.selectIndex];
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right) ||
                gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)) {
            this.selectIndex++;
            this.selectIndex = clamp(this.selectIndex, 0, this.elements.length - 1);
            this.selectedElement = this.elements[this.selectIndex];
        }    

        var heroXF = this.mHero.getXform();

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
            heroXF.incRotationByDegree(1.5);       
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            heroXF.incRotationByDegree(-1.5);    
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
            this.generateProjectile();
        }

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

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.G)) {
            this.GenerateOn=!this.GenerateOn; 
            console.log("generating Asteroids: " + this.GenerateOn);
        }

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
    }
    
};


//random asteroid generation
AsteroidScene.prototype.generateAsteroid = function () {
     
    if(this.GenerateOn){
        var xl = this.WCCenterX-this.WCWidth/2 + Math.random()*(this.WCWidth - 20);
        var yl = 120;

        var type=0;

        type = Math.round(Math.random()*this.maxType);  

        var Asteroid1 = new Asteroid(this.kMinionSprite, xl, yl, false, type);

        //drop speed
        Asteroid1.yv=-7;

        this.mAllObjs.addToSet(Asteroid1); 
    }
};


//generating projectiles
AsteroidScene.prototype.generateProjectile = function () {
//checking for Hero Firing to see if a Projectile should be created
    //if(this.mHero.firing){
        
        //get hero state info
        var hxf = this.mHero.getXform();
        var xp = hxf.getXPos();
        var yp = hxf.getYPos();
        
        //get in radians for Math javascript func
        var rot = hxf.getRotationInRad();
        
        var w = 10;
        var h = 10;
        //create new projectile
        //console.log("selection"+this.selection);
        var p = new Projectile(this.kPlatformTexture, xp, yp, w, h, false, this.selectIndex);
        
        //setting projectile velocity
        this.maxV=100;
        
        // if raycast
        if(this.selectIndex==2){
            this.maxV=0;
            p.getXform().setRotationInRad(rot);
            
            p.getXform().setSize(10,2000);
                        
            //p.mMinion.getXform().setSize(2, 100);
            
           // p.mRigidBody.mWidth=2;
            //p.mRigidBody.mHeight=100;
            
            p.lifeTime=130;
            
            this.rayCast();
        }
        
        var xv = this.maxV*Math.sin(rot) *-1 ; //for some reason 2d game engine rotates one way in practice...
        var yv = this.maxV*Math.cos(rot);
        
       
        p.xv=xv;
        p.yv=yv;
        
        //adding projectile to set
        this.mAllObjs.addToSet(p);
        
        // allow hero to fire again
        //this.mHero.firing=false;
    //}    
}


//checking for raycast collisions
AsteroidScene.prototype.rayCast = function () {
  
  
    for (var i = 0; i < this.mAllObjs.size(); i++) {
      
        var ast= this.mAllObjs.getObjectAt(i);
        
        if(ast instanceof Asteroid){

                var axf = ast.getXform();

                var astx = axf.getXPos();
                var asty = axf.getYPos();
                            
                
                //given asteroid x position, calculate where ray would intersect
                var theta = this.mHero.getXform().getRotationInRad();
                
                // find out which direction the laser is firing and compare to if asteroid is left or right of laser source
                var mirror=false;
                if (theta >0 && astx<=0){
                    mirror=true;
                }
                else if(theta<0 && astx>=0){
                    mirror=true;
                }
                
                
                var y = Math.abs(astx-this.mHero.getXform().getXPos())/Math.tan(Math.abs(theta)-this.mHero.getXform().getYPos());
                
                

                console.log("asty "+asty+"  intersect y:" +y +" theta: "+theta*180/Math.PI);

                var yhi= y +axf.getHeight()*.5;
                var ylow = y-axf.getHeight()*.5;

                //check if intersection
                if(asty>= ylow && asty <= yhi && mirror){

                    console.log("Ray Hit!");
                    //check if correct data types
                    if(ast.dataType == this.selectionIndex){
                        this.incrementScore(true);
                        this.mAllObjs.removeFromSet(ast);

                    }
                    else{
                        this.incrementScore(false);
                        this.mAllObjs.removeFromSet(ast);
                    }
                    
                }
          }
    }  
}