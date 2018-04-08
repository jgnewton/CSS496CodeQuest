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
    this.maxselect=10;
    
    this.selection=0;
     
    this.genTimer=0;
    
    //width of world within camera view
    this.WCWidth=300;
    
    //center x coordinate of camera
    this.WCCenterX=0;
    //y coord
    this.WCCenterY=0;
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
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
        
    
    //object Set
    this.mAllObjs = new GameObjectSet();   
    
    //create hero and add to set
    this.mHero = new Hero(this.kMinionSprite);
    this.mHero.mDye.getXform().setPosition(50, -60);
    
    
    
    this.mAllObjs.addToSet(this.mHero);
    
    //create minion 
    this.mAsteroid1 = new Asteroid(this.kMinionSprite, 50, 40);
    this.mAllObjs.addToSet(this.mAsteroid1);
    
    this.mtestProj = new Projectile(this.kPlatformTexture, 55,45);
    this.mtestProj.mRigidBody.setVelocity(1,1);
    this.mAllObjs.addToSet(this.mtestProj);


    this.mMsg = new FontRenderable("Asteroid Scene");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);
    
    this.mShapeMsg = new FontRenderable("Current Selection: "+this.selection);
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(5, 73);
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
    
    this.mBackground.draw(this.mCamera);
    
    
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
    var msg = "";   
    this.mHero.update();
    
    //this.mHero.keyControl();
    this.mHero.AsteroidControl();
    
    this.mAllObjs.update(this.mCamera);
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
    this.mShapeMsg.setText("Rotation: "+ Math.floor(this.mHero.getXform().getRotationInDegree())+"Current Selection : "+this.selection);
    
    
    //checking for Hero Firing
    if(this.mHero.firing){
        
        //get hero state info
        var hxf = this.mHero.getXform();
        var xp = hxf.getXPos();
        var yp = hxf.getYPos();
        
        //get in radians for Math javascript func
        var rot = hxf.getRotationInRad();
        
        //create new projectile
        var p = new Projectile(this.kPlatformTexture, xp, yp);
        
        //setting projectile velocity
        this.maxV=50;
        
        var xv = this.maxV*Math.sin(rot) *-1 ; //for some reason 2d game engine rotates one way in practice...
        var yv = this.maxV*Math.cos(rot);
       
        p.xv=xv;
        p.yv=yv;
        
        //adding projectile to set
        this.mAllObjs.addToSet(p);
        
        // allow hero to fire again
        this.mHero.firing=false;
    }
    
    //updating projectiles (object) set
    
    //updating the generating of asteroids
    this.genTimer++;
    if(this.genTimer>=120){
        this.generate();
        this.genTimer=0;
    }
    
};


//random asteroid generation
AsteroidScene.prototype.generate = function () {
    
    
    var xl = this.WCCenterX-this.WCWidth/2 + Math.random()*this.WCWidth;
    var yl = 60;
    
    var Asteroid1 = new Asteroid(this.kMinionSprite, xl, yl);
    
    //drop speed
    Asteroid1.yv=-10;
    
    this.mAllObjs.addToSet(Asteroid1);    
};