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
        vec2.fromValues(50, 40), // position of the camera
        300,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
        
    
    //object Set
    this.mAllObjs = new GameObjectSet();   
    
    //create hero and add to set
    this.mHero = new Hero(this.kMinionSprite);
    this.mAllObjs.addToSet(this.mHero);
    
    //create minion 
    this.mAsteroid1 = new Asteroid(this.kMinionSprite, 50, 40);
    this.mAllObjs.addToSet(this.mAsteroid1);


    this.mMsg = new FontRenderable("Asteroid Scene");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);
    
    this.mShapeMsg = new FontRenderable("Shape");
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(5, 73);
    this.mShapeMsg.setTextHeight(2.5);
    
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
    this.mHero.keyControl();
    
    this.mAllObjs.update(this.mCamera);
    //this.updateCamera();
    
    //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }

};