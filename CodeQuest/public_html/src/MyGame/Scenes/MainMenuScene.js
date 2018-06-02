/*
 * File: MainMenuScene.js
*/

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MainMenuScene() {
    this.bg = "assets/Menu/titlescreen.png";
    this.playButton = "assets/Menu/playbtn.png";
    this.creditsButton = "assets/Menu/creditsbtn.png";
    
    this.mCamera = null;
    this.mAllObjs = null;
    this.nextScene = null;
    this.titlescreen = null;

    this.mAllObjs = null;
    this.nextScene = null;
    
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
    
        //sounds
    this.bar12 = "assets/Sounds/12bar_mainmenu.mp3";
    this.bubbsong = "assets/Sounds/BubbleMadness.mp3";
    this.explosion = "assets/Sounds/Explosion.mp3";
    this.fishsong = "assets/Sounds/FishThemeSong.mp3";
    this.laser = "assets/Sounds/Laser.mp3";
    this.asteroidsong = "assets/Sounds/asteroidScene.mp3";
    this.catchbad = "assets/Sounds/catchbad.mp3";
    this.fishfall = "assets/Sounds/fishfall.mp3";
    this.pops = "assets/Sounds/pops.mp3";
    this.firing = "assets/Sounds/firing.mp3";
    this.firing = "assets/Sounds/firing.mp3";
    this.maingame = "assets/Sounds/maingame.mp3";
    
    this.music = "assets/Sounds/maingame.mp3";
    
    
    this.musicOn=true;
}
gEngine.Core.inheritPrototype(MainMenuScene, Scene);


MainMenuScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.bg);
    gEngine.Textures.loadTexture(this.playButton);
    gEngine.Textures.loadTexture(this.creditsButton);
    
        //sounds
    gEngine.AudioClips.loadAudio(this.bar12);
    gEngine.AudioClips.loadAudio(this.bubbsong);
    gEngine.AudioClips.loadAudio(this.explosion);
    gEngine.AudioClips.loadAudio(this.fishsong);
    gEngine.AudioClips.loadAudio(this.laser);
    gEngine.AudioClips.loadAudio(this.asteroidsong);
    gEngine.AudioClips.loadAudio(this.catchbad);
    gEngine.AudioClips.loadAudio(this.fishfall);
    gEngine.AudioClips.loadAudio(this.pops);
    gEngine.AudioClips.loadAudio(this.firing);
    gEngine.AudioClips.loadAudio(this.maingame);
    gEngine.AudioClips.loadAudio(this.music);
};

MainMenuScene.prototype.unloadScene = function () {
    // unload textures
    gEngine.Textures.unloadTexture(this.bg);
    gEngine.Textures.unloadTexture(this.playButton);
    gEngine.Textures.unloadTexture(this.creditsButton);
    
    //gEngine.AudioClips.stopBackgroundAudio();
    
    
    if(this.nextScene==0){
        gEngine.Core.startScene(new MyGame());
        
    } else if(this.nextScene==1){
        gEngine.Core.startScene(new CreditScene());
        
    } 
        
};

MainMenuScene.prototype.initialize = function () {
    setControlText("MainMenu");
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
    
    
    this.titlescreen = new TextureRenderable(this.bg);
    this.titlescreen.getXform().setPosition(0, 0);
    this.titlescreen.getXform().setRotationInDegree(0); // In Degree
    this.titlescreen.getXform().setSize(this.WCWidth, this.WCHeight);
    this.mAllObjs.addToSet(this.titlescreen);
    
    this.play = new TextureRenderable(this.playButton);
    this.play.getXform().setPosition(0, -35);
    this.play.getXform().setRotationInDegree(0); // In Degree
    this.play.getXform().setSize(this.WCWidth / 4, this.WCHeight / 4);
    this.mAllObjs.addToSet(this.play);
    
    this.credits = new TextureRenderable(this.creditsButton);
    this.credits.getXform().setPosition(7, -75);
    this.credits.getXform().setRotationInDegree(0); // In Degree
    this.credits.getXform().setSize(this.WCWidth / 4, this.WCHeight / 4);
    this.mAllObjs.addToSet(this.credits);
    
        if(this.musicOn){
         gEngine.AudioClips.playBackgroundAudio(this.maingame);
        }
    
};


// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MainMenuScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mAllObjs.draw(this.mCamera);
    //this.mCollisionInfos = []; 

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
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
        localStorage.clear();
        document.location.reload();
    }
     this.checkMusic();
};