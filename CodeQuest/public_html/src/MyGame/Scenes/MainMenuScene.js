/*
 * File: MainMenuScene.js
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MainMenuScene() {
    this.kMinionSprite = "assets/minion_sprite.png";

    this.mAllObjs = null;
    this.nextScene = null;
}
gEngine.Core.inheritPrototype(MainMenuScene, Scene);


MainMenuScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
 
};

MainMenuScene.prototype.unloadScene = function () {
    // unload textures
    gEngine.Textures.unloadTexture(this.kMinionSprite);

    if(this.nextScene==0){
        gEngine.Core.startScene(new MyGame());
        
    } else if(this.nextScene==1){
        gEngine.Core.startScene(new CreditsScene());
        
    } 
        
};

MainMenuScene.prototype.initialize = function () {
    setControlText("MainMenu");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    this.mAllObjs = new GameObjectSet();   

};


// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MainMenuScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mAllObjs.draw(this.mCamera);
    this.mCollisionInfos = []; 

};

MainMenuScene.prototype.update = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.P)) {
        this.nextScene = 0;
        gEngine.GameLoop.stop();  
    }
    
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
        this.nextScene = 1;
        gEngine.GameLoop.stop();  
    }
};