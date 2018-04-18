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
    
    this.selection=0;
     
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
    
    this.raycast = false;
    
    this.ground = null;
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
    var groundHeight = this.WCHeight / 4.5;
    this.ground.getXform().setPosition(0, -this.WCHeight / 2 + groundHeight / 2);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, groundHeight);
    this.mAllObjs.addToSet(this.ground);
    
   
   // Selection message
    this.mShapeMsg = new FontRenderable("Current Selection: "+this.selection);
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(this.WCCenterX-this.WCWidth/2, this.WCCenterY-80);
    this.mShapeMsg.setTextHeight(7.5);
    
    
    // background init
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    var bxf=this.mBackground.getXform();
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
AsteroidScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    //this.mBackground.draw(this.mCamera);
    
    
    this.mAllObjs.draw(this.mCamera);
    
    // for now draw these ...
    /*for (var i = 0; i<this.mCollisionInfos.length; i++) 
        this.mCollisionInfos[i].draw(this.mCamera); */
    this.mCollisionInfos = []; 
    
    //this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    this.mShapeMsg.draw(this.mCamera);

};

AsteroidScene.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
AsteroidScene.kBoundDelta = 0.1;


AsteroidScene.prototype.update = function () {
    this.processInput();
    
    
    
    

    //this.mHero.aimShoot();
    
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        
        
        if(obj instanceof Asteroid ){
            //give asteroids list of all objects
            var hit = obj.update(this.mAllObjs);
        
        
            if(hit ==1){
                //, this.nextMarkX, this.nextMarkY
                this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, true));
                this.nextMarkX += this.markOffset;
                this.mAllObjs.removeFromSet(obj);
            }
            
            else if(hit==2){
                this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, false));
                this.nextMarkX += this.markOffset;
                this.mAllObjs.removeFromSet(obj);
            }
            
            //var WB = 
            obj.testTerminated(this.ground);
        
        }
        else if(obj instanceof Projectile){
            obj.testTerminated([this.WCCenterX, this.WCCenterY, this.WCWidth, this.WCHeight]);
        }
        else{
            obj.update();
        }






        // test if the object should be terminated
        if(obj.mortal){
            //console.log("Projectile Found");
            //obj.testTerminated(WB);
            
            if(obj instanceof Asteroid && obj.terminated){
                this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, false));
                this.nextMarkX += this.markOffset;
                this.mAllObjs.removeFromSet(obj);
            }

            if (obj.terminated){
                this.mAllObjs.removeFromSet(obj);
            }
        }  
            
    }
    //this.updateCamera();
    

    
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
    
    //this.generateProjectile();
    
    //updating projectiles (object) set
    
    //updating the generating of asteroids
    this.genTimer++;
    if(this.genTimer>=350){
        this.generateAsteroid();
        this.genTimer=0;
    }
    
    //console.log(this.nextMarkX);
    if(this.nextMarkX >= this.WCCenterX - (this.WCWidth / 2) + this.markOffset + 100){
        this.nextMarkY -= this.markOffset;
        this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + this.markOffset;
    }
    
    // don't call rayCast 60 times per second, should be called when pressing fire right?
    //this.rayCast();
};

AsteroidScene.prototype.processInput = function(){
        //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }
    
    //selecting Ray type:
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.selection--;
        
        if(this.selection<this.minselect){
            this.selection = this.maxselect;
        }
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.selection++;
        
        if(this.selection>this.maxselect){
            this.selection= this.minselect;
        }
    }    
    
    var heroXF = this.mHero.getXform();
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        heroXF.incRotationByDegree(1.5);       
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        heroXF.incRotationByDegree(-1.5);    
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.generateProjectile 
    }
}


//random asteroid generation
AsteroidScene.prototype.generateAsteroid = function () {
       
    var xl = this.WCCenterX-this.WCWidth/2 + Math.random()*(this.WCWidth - 20);
    var yl = 60;
    
    var type=0;
    
    type = Math.round(Math.random()*this.maxType);  
    
    var Asteroid1 = new Asteroid(this.kMinionSprite, xl, yl, false, type);
    
    //drop speed
    Asteroid1.yv=-7;
    
    this.mAllObjs.addToSet(Asteroid1);    
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
        
        var w = 200;
        var h = 200;
        //create new projectile
        //console.log("selection"+this.selection);
        var p = new Projectile(this.kPlatformTexture, xp, yp, w, h, false, this.selection);
        
        //setting projectile velocity
        this.maxV=100;
        
        if(this.raycast){
            this.maxV=0;
            p.getXform().setRotationInRad(rot);
            
            p.getXform().setSize(10,2000);
            
            this.rayDataType=this.selection;
            
            //p.mMinion.getXform().setSize(2, 100);
            
           // p.mRigidBody.mWidth=2;
            //p.mRigidBody.mHeight=100;
            
            p.lifeTime=130;
        }
        
        var xv = this.maxV*Math.sin(rot) *-1 ; //for some reason 2d game engine rotates one way in practice...
        var yv = this.maxV*Math.cos(rot);
        
        this.raym = Math.tan(rot);
       
        p.xv=xv;
        p.yv=yv;
        
        //adding projectile to set
        this.mAllObjs.addToSet(p);
        
        // allow hero to fire again
        //this.mHero.firing=false;
    //}    
}

AsteroidScene.prototype.rayCast = function () {
  
  
    for (var i = 0; i < this.mAllObjs.size(); i++) {
      
        var ast= this.mAllObjs.getObjectAt(i);
        
        var axf = ast.getXform();
        
        var x = axf.getXPos();
        var y = axf.getYPos();
        
        if(y == this.raym*x ){
            
            if(ast.dataType== this.rayDataType){
                ast.hit();
            }
            else{
                ast.falseHit();
            }
        }
  }
    
}