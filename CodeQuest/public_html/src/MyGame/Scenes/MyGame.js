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
    this.friendr = "assets/squirralR.png";
    this.friendl = "assets/squirralL.png";
    
    this.mc = "assets/maincharacter.png"
    
    this.chipmunk = "assets/squirrel.png";
    this.chipmunkhelmet = "assets/squirrelhelmet.png"
    
    this.map = "assets/map/map.png";
    this.meteorIcon = "assets/map/mapmeteor.png";
    this.bubbleIcon = "assets/map/mapcannon.png";
    this.basketIcon = "assets/map/mapseagull.png";
    
    this.scoreMark = "assets/checksandx.png";
    
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
    gEngine.Textures.loadTexture(this.friendr); 
    gEngine.Textures.loadTexture(this.friendl); 
    
    gEngine.Textures.loadTexture(this.mc);
    gEngine.Textures.loadTexture(this.chipmunk);
    gEngine.Textures.loadTexture(this.chipmunkhelmet);
    
    gEngine.Textures.loadTexture(this.map);
    gEngine.Textures.loadTexture(this.meteorIcon);
    gEngine.Textures.loadTexture(this.bubbleIcon);
    gEngine.Textures.loadTexture(this.basketIcon);
    
    gEngine.Textures.loadTexture(this.scoreMark);
};

MyGame.prototype.unloadScene = function () {
    // unload textures
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth);
    gEngine.Textures.unloadTexture(this.friendr); 
    gEngine.Textures.unloadTexture(this.friendl); 
    
    gEngine.Textures.unloadTexture(this.mc);
    gEngine.Textures.unloadTexture(this.chipmunk);
    gEngine.Textures.unloadTexture(this.chipmunkhelmet);
    
    gEngine.Textures.unloadTexture(this.map);
    gEngine.Textures.unloadTexture(this.meteorIcon);
    gEngine.Textures.unloadTexture(this.bubbleIcon);
    gEngine.Textures.unloadTexture(this.basketIcon);
    
    gEngine.Textures.unloadTexture(this.scoreMark);
    
    
    // start the next scene
    //var SceneObject = new AsteroidScene();
    
    
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
    
    else if(this.nextScene == 5){
        gEngine.Core.startScene(new MainMenuScene());
    }
    else if(this.nextScene == 6){
        gEngine.Core.startScene(new LessonScene("Meteors"));
    }
    else if(this.nextScene == 7){
        gEngine.Core.startScene(new LessonScene("Baskets"));
    }
    else if(this.nextScene == 8){
        gEngine.Core.startScene(new LessonScene("Bubbles"));
    }
    
    //gEngine.Core.startScene(SceneObject);  
        
};

MyGame.prototype.initialize = function () {
    setControlText("MyGame");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.mBackground = new TextureRenderable(this.map);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    
    var bxf=this.mBackground.getXform();
    
    bxf.setPosition(50,40);
    bxf.setWidth(187.5);
    bxf.setHeight(150);
      
    this.mHero = new Hero(this.mc);
    this.mHero.mDye.setElementPixelPositions(0, 372, 512 - 452, 512);
    this.mHero.mDye.getXform().setSize(8, 9);
    this.mAllObjs = new GameObjectSet();   
    this.mAllObjs.addToSet(this.mHero);
    
    this.initLocalStorage();
    
    
    this.sceneZoneMeteor = new SceneZone(this.meteorIcon, this.scoreMark, 40,-10, this.meteorWin);
    this.sceneZoneMeteor.mDye.setElementPixelPositions(0, 240, 512 - 138, 512);
    
    if(this.meteorWin != "0"){
       this.sceneZoneMeteor.scene = 2; 
    } else {
        this.sceneZoneMeteor.scene = 6;
    }
    
    this.mAllObjs.addToSet(this.sceneZoneMeteor);
    
    this.sceneZoneBasket = new SceneZone(this.basketIcon, this.scoreMark, 100,80, this.basketWin);
    this.sceneZoneBasket.mDye.setElementPixelPositions(0, 130, 512 - 138, 512);
    this.sceneZoneBasket.mDye.getXform().setSize(20, 20);
    if(this.basketWin != "0"){
       this.sceneZoneBasket.scene = 3; 
    } else {
        this.sceneZoneBasket.scene = 7;
    }
    this.mAllObjs.addToSet(this.sceneZoneBasket);
    
    this.sceneZoneBubble = new SceneZone(this.bubbleIcon,this.scoreMark, 0,80, this.bubbleWin);
    this.sceneZoneBubble.mDye.setElementPixelPositions(0, 180, 512 - 138, 512);
    this.sceneZoneBubble.mDye.getXform().setSize(27, 20);
    if(this.bubbleWin != "0"){
       this.sceneZoneBubble.scene = 4; 
    } else {
        this.sceneZoneBubble.scene = 8;
    }
    this.mAllObjs.addToSet(this.sceneZoneBubble);
    
    
    
    this.mHelper = new Helper(this.chipmunk, this.friendl);
    this.mHelper.mDye.getXform().setSize(4, 5);
    this.mHelper.mDye.setElementPixelPositions(0, 421, 1024 - 523, 1024);
    //friendObjectr
    
    //this.mHelper = new SpriteRenderable(this.chipmunkhelmet);
    //this.mHelper.setElementPixelPositions(0, 421, 512 - 523, 512);
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
    //this.sceneZone1Text = new MenuElement("Meteors", 0, 0, 4);
    //this.sceneZone2Text = new MenuElement("Basket", 50, 0, 4);
   
   
    
    this.setCameraFollowTarget(this.mHero);
    
    this.zones=[];
    this.zones.push(this.sceneZoneMeteor);
    this.zones.push(this.sceneZoneBasket);
    this.zones.push(this.sceneZoneBubble);
};


MyGame.prototype.initLocalStorage = function(){
    
    //console.log("Meteors win: " + localStorage.getItem("Meteors"));
    //console.log("Baskets win: " + localStorage.getItem("Baskets"));
    
    
    if(localStorage.getItem("Meteors") != null){
        this.meteorWin = JSON.parse(localStorage.getItem("Meteors"));
    } else {
        this.meteorWin = 0;
        localStorage.setItem("Meteors", 0);
    }
    
    if(localStorage.getItem("Baskets") != null){
        this.basketWin = JSON.parse(localStorage.getItem("Baskets"));
    } else {
        this.basketWin = 0;
        localStorage.setItem("Baskets", 0);
    }
    
    if(localStorage.getItem("Bubbles") != null){
        this.bubbleWin = JSON.parse(localStorage.getItem("Bubbles"));
    } else {
        this.bubbleWin = 0;
        localStorage.setItem("Bubbles", 0);
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
    
    //this.sceneZone1Text.draw(this.mCamera);
    //this.sceneZone2Text.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    //var msg = "";   
    this.mHero.update();
    this.mHero.heroControls(this.mBackground);
    
    this.mHelper.follow(this.mHero);
    
    
    //this.mHero.keyControl();
    
    this.mAllObjs.update(this.mCamera);
    this.updateCamera();

    //to make a conflict
    //debug Scene Change
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.X)) {
        this.nextScene = 5;
         gEngine.GameLoop.stop();  
    }
    
    /*
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.B)) {
        this.nextScene = 3;
         gEngine.GameLoop.stop();  
    }
    */
    
    
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