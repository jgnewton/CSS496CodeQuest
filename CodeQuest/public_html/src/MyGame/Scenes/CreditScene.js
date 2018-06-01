/*
 * File: CreditScene.js
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CreditScene() {
    this.credits = "assets/Menu/credits.png";
    this.mCamera = null;
    this.mAllObjs = null;
    this.nextScene = null;
    this.creditObj = null;
    
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
    this.musicOn=true;
}
gEngine.Core.inheritPrototype(CreditScene, Scene);


CreditScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.credits);
    
     this.credsong = "assets/Sounds/12bar_mainmenu.mp3";
      gEngine.AudioClips.loadAudio(this.credsong);
 
};

CreditScene.prototype.unloadScene = function () {
    // unload textures
    gEngine.Textures.unloadTexture(this.credits);

    if(this.nextScene==0){
        gEngine.Core.startScene(new MainMenuScene());
    }
        
};

CreditScene.prototype.initialize = function () {
    setControlText("Credits");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(this.WCCenterX, this.WCCenterY), // position of the camera
        this.WCWidth,                     // width of camera
        [0, 0, this.VPWidth, this.VPHeight]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mAllObjs = new GameObjectSet(); 
    
    this.creditObj = new TextureRenderable(this.credits);
    this.creditObj.getXform().setPosition(0, 0);
    this.creditObj.getXform().setRotationInDegree(0); // In Degree
    this.creditObj.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.creditObj);
    
        if(this.musicOn){
         gEngine.AudioClips.playBackgroundAudio(this.credsong);
        }
this.acknowledgements = new MenuElement(" Advisors: Dr. Laurie Anderson, Dr. Kelvin Sung", -140, -70, 8);
this.acknowledgements2 = new MenuElement(" Game Engine: Kelvin Sung, Jebediah Pavleas, Fernando Arnez, Jason Pace  ", -145, -80, 6)

this.acknowledgements.setColor([1,1,1,1]);
this.acknowledgements2.setColor([1,1,1,1]);
};


// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
CreditScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    //console.log("test");
    this.mAllObjs.draw(this.mCamera);
    this.creditObj.draw(this.mCamera);
    //this.mCollisionInfos = []; 
    
    this.acknowledgements.draw(this.mCamera);
    this.acknowledgements2.draw(this.mCamera);

};

CreditScene.prototype.update = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        this.nextScene = 0;
        gEngine.GameLoop.stop();  
    }
};