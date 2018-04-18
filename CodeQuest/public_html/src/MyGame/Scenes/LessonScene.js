/*
 * File: LessonScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LessonScene() {
    //this.kMinionSprite = "assets/minion_sprite.png";
    //this.kPlatformTexture = "assets/platform.png";
    //this.kWallTexture = "assets/wall.png";
    //this.kTargetTexture = "assets/target.png";
    //this.kForest = "assets/Forest2.png";
    //this.kEarth = "assets/Earth.png";
    //this.kMW = "assets/MW2.jpg";
    //this.scoreMarks = "assets/scoreMarks.png"
    // The camera to view the scene
    this.mCamera = null;

    this.mMsg = null;
    this.mShapeMsg = null;

    this.mAllObjs = null;
    this.mBounds = null;
    this.mCollisionInfos = [];
    //this.mHero = null;
    
    //this.mCurrentObj = 0;
    //this.mTarget = null;
    
    
    // Setting up ray selection logic
    //this.minselect=0;
    //this.maxselect=4;
    
    //this.selection=0;
     
    //this.genTimer=0;
    
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
    
    //this.maxType=4;
    
    //this.WCCenterX - (this.WCWidth / 2) + 5
    // this.WCCenterY - (this.WCHeight / 2) + 5
    //this.nextMarkX=-140;
    //this.nextMarkY=109.5;
    
    //this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + 10;
    //this.nextMarkY = this.WCCenterY + (this.WCHeight / 2) - 10;
    
    //this.raycast = false;
}
gEngine.Core.inheritPrototype(LessonScene, Scene);


LessonScene.prototype.loadScene = function () {
    /*
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kForest);
    gEngine.Textures.loadTexture(this.kEarth);
    gEngine.Textures.loadTexture(this.kMW); 
    gEngine.Textures.loadTexture(this.scoreMarks); 
    */
};

LessonScene.prototype.unloadScene = function () {
    /*
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth);
    gEngine.Textures.unloadTexture(this.kMW); 
    gEngine.Textures.unloadTexture(this.scoreMarks); 
    */
   
    //var MG = new MyGame();
    gEngine.Core.startScene(new AsteroidScene); 
};

LessonScene.prototype.initialize = function () {
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
    //this.mHero = new Hero(this.kMinionSprite);
    //this.mHero.mDye.getXform().setPosition(this.WCCenterX, this.WCCenterY-60);
    
    
    
    //this.mAllObjs.addToSet(this.mHero);
    

    this.mMsg = new FontRenderable("Lesson Scene");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);
    
   
   /*
    this.mShapeMsg = new FontRenderable("Current Selection: "+this.selection);
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(this.WCCenterX-this.WCWidth/2, this.WCCenterY-80);
    this.mShapeMsg.setTextHeight(7.5);
    */
    
    /*
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    
   
    var bxf=this.mBackground.getXform();
    
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    */
   
    //this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, -140, 109.5, true)); 
    //this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, -135, 109.5, false));
    //this.setCameraFollowTarget(this.mHero);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
LessonScene.prototype.draw = function () {
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
    //this.mShapeMsg.draw(this.mCamera);

};

LessonScene.prototype.update = function () {
    
    
    //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }
    
    // left and right should scroll the text of the lesson??
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {

    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {

    }    
    
    
};

