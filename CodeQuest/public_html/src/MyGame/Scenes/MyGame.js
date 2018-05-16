/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";
    this.kForest = "assets/Forest2.png";
    this.kEarth = "assets/Earth.png";
    
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
    
    this.zones=[];
    
    //this.nextScene indicates which scene to load next
    // 0 - overworld
    // 1 - asteroid scene
    // 2 - lesson scene
    this.nextScene=0;
    
    this.meteorWin = false;
    this.basketWin = false;
    this.bubbleWin = false;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kForest);  
    gEngine.Textures.loadTexture(this.kEarth); 
};

MyGame.prototype.unloadScene = function () {
    // unload textures
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth); 
    
    
    // start the next scene
    var SceneObject = new AsteroidScene();
    
    
    if(this.nextScene==0){
        gEngine.Core.startScene(new MyGame());
        
    }
    
    //this.nextScene indicates which scene to load next
    else if(this.nextScene==1){
        //SceneObject = new AsteroidScene();
        
        gEngine.Core.startScene(new AsteroidScene());
    }
    
    else if(this.nextScene==2){
        gEngine.Core.startScene(new AsteroidScene());
        //gEngine.Core.startScene(new LessonScene());
    }
    
    else if(this.nextScene==3){
        gEngine.Core.startScene(new BasketScene());
    }
    
    else if(this.nextScene==4){
        gEngine.Core.startScene(new BubbleScene());
    }
    
    
    //gEngine.Core.startScene(SceneObject);  
        
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
      
    this.mHero = new Hero(this.kMinionSprite);
    this.mAllObjs = new GameObjectSet();   
    this.mAllObjs.addToSet(this.mHero);
    
    this.initLocalStorage();
    
    
    this.sz1 = new SceneZone(this.kMinionSprite,0,0, this.meteorWin);
    this.sz1.scene = 2;
    this.mAllObjs.addToSet(this.sz1);
    
    this.sz2 = new SceneZone(this.kMinionSprite,50,0, this.basketWin);
    this.sz2.scene = 3;
    this.mAllObjs.addToSet(this.sz2);
    
    this.sz3 = new SceneZone(this.kMinionSprite,0,50, this.bubbleWin);
    this.sz3.scene = 4;
    this.mAllObjs.addToSet(this.sz3);
    
    
    
    this.mHelper = new Helper(this.kMinionSprite);
    this.mAllObjs.addToSet(this.mHelper);
    
    /*
    this.mMsg = new FontRenderable("MyGame Scene1 (World View)");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 7);
    this.mMsg.setTextHeight(3);
    
    this.mShapeMsg = new FontRenderable("Shape");
    this.mShapeMsg.setColor([0, 0, 0, 1]);
    this.mShapeMsg.getXform().setPosition(5, 73);
    this.mShapeMsg.setTextHeight(2.5);
    */
   
    // intext, x pos, y pos, size
    this.sceneZone1Text = new MenuElement("Meteors", 0, 0, 4);
    this.sceneZone2Text = new MenuElement("Basket", 50, 0, 4);
   
    this.mBackground = new TextureRenderable(this.kEarth);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    
    var bxf=this.mBackground.getXform();
    
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    
    this.setCameraFollowTarget(this.mHero);
    
    this.zones=[];
    this.zones.push(this.sz1);
    this.zones.push(this.sz2);
    this.zones.push(this.sz3);
};


MyGame.prototype.initLocalStorage = function(){
    
    //console.log("Meteors win: " + localStorage.getItem("Meteors"));
    //console.log("Baskets win: " + localStorage.getItem("Baskets"));
    
    
    if(localStorage.getItem("Meteors") != null){
        this.meteorWin = JSON.parse(localStorage.getItem("Meteors"));
    } else {
        this.meteorWin = false;
        localStorage.setItem("Meteors", false);
    }
    
    if(localStorage.getItem("Baskets") != null){
        this.basketWin = JSON.parse(localStorage.getItem("Baskets"));
    } else {
        this.basketWin = false;
        localStorage.setItem("Baskets", false);
    }
}


// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mBackground.draw(this.mCamera);
    
    
    this.mAllObjs.draw(this.mCamera);
    
    // for now draw these ...
    /*for (var i = 0; i<this.mCollisionInfos.length; i++) 
        this.mCollisionInfos[i].draw(this.mCamera); */
    this.mCollisionInfos = []; 
    
    //this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    //this.mShapeMsg.draw(this.mCamera);
    
    this.sceneZone1Text.draw(this.mCamera);
    this.sceneZone2Text.draw(this.mCamera);
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;


MyGame.prototype.update = function () {
    var msg = "";   
    this.mHero.update();
    
    this.mHelper.follow(this.mHero);
    
    
    this.mHero.keyControl();
    
    this.mAllObjs.update(this.mCamera);
    this.updateCamera();

    //to make a conflict
    //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }
    
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.B)) {
        this.nextScene = 3;
         gEngine.GameLoop.stop();  
    }
    
    
    this.checkZones();
};


//go through all zones and check to see if the hero is currently colliding with their
//bounding boxes
MyGame.prototype.checkZones = function () {
    for(var i =0; i< this.zones.length;i++){
        if(this.zones[i].checkCollision(this.mHero)){
            
            // hard coding this to be the lesson scene for now
            this.nextScene = this.zones[i].scene;
            //this.nextScene = 2;
            
            gEngine.GameLoop.stop();
        }
    }
}