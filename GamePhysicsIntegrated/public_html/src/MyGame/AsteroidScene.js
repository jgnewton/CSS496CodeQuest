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
    
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;
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
};

AsteroidScene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth);
    gEngine.Textures.unloadTexture(this.kMW); 
    
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
    
    //create minion 
    this.mAsteroid1 = new Asteroid(this.kMinionSprite, 50, 40);
    this.mAllObjs.addToSet(this.mAsteroid1);
    
    //this.mtestProj = new Projectile(this.kPlatformTexture, 55,45);
    //this.mtestProj.mRigidBody.setVelocity(1,1);
    //this.mAllObjs.addToSet(this.mtestProj);


    this.mMsg = new FontRenderable("Asteroid Scene");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);
    
    this.mShapeMsg = new FontRenderable("Current Selection: "+this.selection);
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(this.WCCenterX-this.WCWidth/2, this.WCCenterY-80);
    this.mShapeMsg.setTextHeight(7.5);
    
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    
    var bxf=this.mBackground.getXform();
    
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    
    //this.setCameraFollowTarget(this.mHero);
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
    
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
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
    

    //this.mHero.aimShoot();
    
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        if(obj instanceof Asteroid ){
            //give asteroids list of all objects
            obj.update(this.mAllObjs);
        }
        else{
            obj.update();
        }
            
    }
    //this.updateCamera();
    
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
    
    this.generateProjectile();
    
    //updating projectiles (object) set
    
    //updating the generating of asteroids
    this.genTimer++;
    if(this.genTimer>=100){
        this.generateAsteroid();
        this.genTimer=0;
    }
    
    
    //test for terminated objects
    var WB = [this.WCCenterX, this.WCCenterY, this.WCWidth, this.WCHeight];
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
       // console.log(obj);
        
        if(obj.mortal){
            //console.log("Projectile Found");
            obj.testTerminated(WB);

            if (obj.terminated){
                this.mAllObjs.removeFromSet(obj);
            }
        }  
    }
       
};


//random asteroid generation
AsteroidScene.prototype.generateAsteroid = function () {
       
    var xl = this.WCCenterX-this.WCWidth/2 + Math.random()*this.WCWidth;
    var yl = 60;
    
    var type=0;
    
    type = Math.round(Math.random()*this.maxType);  
    
    var Asteroid1 = new Asteroid(this.kMinionSprite, xl, yl, false, type);
    
    //drop speed
    Asteroid1.yv=-10;
    
    this.mAllObjs.addToSet(Asteroid1);    
};


//generating projectiles
AsteroidScene.prototype.generateProjectile = function () {
//checking for Hero Firing to see if a Projectile should be created
    if(this.mHero.firing){
        
        //get hero state info
        var hxf = this.mHero.getXform();
        var xp = hxf.getXPos();
        var yp = hxf.getYPos();
        
        //get in radians for Math javascript func
        var rot = hxf.getRotationInRad();
        
        //create new projectile
        console.log("selection"+this.selection);
        var p = new Projectile(this.kPlatformTexture, xp, yp, false, this.selection);
        
        //setting projectile velocity
        this.maxV=100;
        
        var xv = this.maxV*Math.sin(rot) *-1 ; //for some reason 2d game engine rotates one way in practice...
        var yv = this.maxV*Math.cos(rot);
       
        p.xv=xv;
        p.yv=yv;
        
        //adding projectile to set
        this.mAllObjs.addToSet(p);
        
        // allow hero to fire again
        this.mHero.firing=false;
    }    
}