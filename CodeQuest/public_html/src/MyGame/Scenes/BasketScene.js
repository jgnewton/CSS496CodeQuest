/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * File: BasketScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BasketScene() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kTargetTexture = "assets/target.png";
    this.kForest = "assets/Forest2.png";
    this.kEarth = "assets/Earth.png";
    this.kMW = "assets/MW2.jpg";
    this.scoreMarks = "assets/scoreMarks.png"
    this.kArrow = "assets/MenuSelectArrow.png";
    this.helpTable = "assets/AsteroidHelp.PNG";
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
    
    //this.selection=0;
     
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
    this.nextMarkY = this.WCCenterY - (this.WCHeight / 2) + this.markOffset;
    this.scoreMarksArray = [];
    
    
    this.ground = null;
    
    // elements is an array that holds all the text elements for the data ttype
    // that the player can select from
    this.elements = [];
    this.selectedElement = null;
    this.selectIndex = 0;
    this.helpTableObject = null;
    this.helpTableVisible = false;
    this.GenerateOn=true;
    
        
    // the number of Xs the player has
    this.numIncorrect = 0;
    this.numCorrect = 0;
    // the number of Xs required to lose the game
    this.gameOverNumber = 10;
    
    // when gameOver is true, we display the player's score and prompt them
    // to play again or return to main menu
    this.gameOver = false;
    this.gameOverText = null;
    this.gameOverText2 = null;
    this.gameOverText3 = null;
    this.gameOverText4 = null;
    
    this.Accuracy=null;
    this.Shots=null;
    this.Hits=null;
    
    this.revealMsg = null;
    
    this.basketString=null;
    this.basketText=null;
    
    
    this.revealTime=0;
    this.groundLevel = null;
}
gEngine.Core.inheritPrototype(BasketScene, Scene);


BasketScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kTargetTexture);
    gEngine.Textures.loadTexture(this.kForest);
    gEngine.Textures.loadTexture(this.kEarth);
    gEngine.Textures.loadTexture(this.kMW); 
    gEngine.Textures.loadTexture(this.scoreMarks); 
    gEngine.Textures.loadTexture(this.kArrow); 
    gEngine.Textures.loadTexture(this.helpTable); 
};

BasketScene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kTargetTexture);
    gEngine.Textures.unloadTexture(this.kForest);
    gEngine.Textures.unloadTexture(this.kEarth);
    gEngine.Textures.unloadTexture(this.kMW); 
    gEngine.Textures.unloadTexture(this.scoreMarks); 
    gEngine.Textures.unloadTexture(this.kArrow); 
    gEngine.Textures.unloadTexture(this.helpTable); 
    
    var MG = new MyGame();
    gEngine.Core.startScene(MG); 
};

BasketScene.prototype.initialize = function () {
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
    this.groundHeight = this.WCHeight / 4.5;   
    this.ground.getXform().setPosition(0, -this.WCHeight / 2 + this.groundHeight / 2);
    this.ground.getXform().setRotationInDegree(0); // In Degree
    this.ground.getXform().setSize(this.WCWidth, this.groundHeight);
    this.mAllObjs.addToSet(this.ground);
    
    // background init
    this.mBackground = new TextureRenderable(this.kMW);
    this.mBackground.setColor.call(this, [1, 0, 0, 1]);
    var bxf=this.mBackground.getXform();
    bxf.setPosition(50,40);
    bxf.setWidth(500);
    bxf.setHeight(500);
    
    
    var textSize = 5;
    var textYpos = -this.WCHeight / 2 + this.groundHeight / 2;
    var textXPos = 110;
    var textOffset = 10;
    
    this.groundLevel = this.WCCenterY - (this.WCHeight/2) + this.groundHeight;
    
    this.eqText = new MenuElement("==", textXPos, textYpos + textOffset * 4, textSize);
    this.neqText = new MenuElement("!=", textXPos, textYpos + textOffset * 3, textSize);
    this.lessText = new MenuElement("<", textXPos, textYpos + textOffset * 2, textSize);
    this.moreText = new MenuElement(">", textXPos, textYpos + textOffset, textSize);
    this.eqmoreText = new MenuElement(">=", textXPos, textYpos, textSize);
    this.eqlessText = new MenuElement("<=", textXPos, textYpos - textOffset, textSize);
    //this.stage3Pegs = new MenuElement("Stage 3 Cat-chinko", 30, 35, 3);
    
    this.elements = [
        this.eqText,
        this.neqText,
        this.lessText,
        this.moreText,
        this.eqmoreText,
        this.eqlessText
    ];
    
    this.selectedElement = this.elements[0];
    this.selectionArrow = new TextureRenderable(this.kArrow);
    this.selectionArrow.getXform().setSize(3, 3);
    this.helpTableObject = new TextureRenderable(this.helpTable);
    this.helpTableObject.getXform().setSize(180, 80);
    
    this.gameOverText = new MenuElement("Game Over", -15, 30, 10);
    this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -25, 0, 10);
    this.gameOverText3 = new MenuElement("Press X to return to overworld", -70, -30, 10);
    //this.gameOverText4 = new MenuElement("Press Space to play again", -45, -60, 10);
    
    this.Accuracy=0;
    this.Hits=0;
    this.Shots=0;
    
    this.accuracyText = new MenuElement("Accuracy: "+ this.Accuracy.toPrecision(3) + "%", 0,-70,5);
    
    this.fruit1 = new Fruit(this.kArrow, 0, 0);
    this.mAllObjs.addToSet(this.fruit1);
    
    this.generateFruit(5);
    
    this.basketText = new FontRenderable("text");
    this.basketText.setColor([0, 0, 0, 1]);
    this.basketText.getXform().setPosition(this.mHero.getXform().getXPos(),this.mHero.getXform().getYPos() );
    this.basketText.setTextHeight(7.5);
    
    this.startLevel();
     
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BasketScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    //this.mBackground.draw(this.mCamera);
    
    if(this.gameOver)
    {
        this.gameOverText.draw(this.mCamera);
        this.gameOverText2.draw(this.mCamera);
        this.gameOverText3.draw(this.mCamera);
        //this.gameOverText4.draw(this.mCamera);
    } else {
        this.mAllObjs.draw(this.mCamera);
    

        //this.selectionArrow.draw(this.mCamera);

        if (this.helpTableVisible)
        {
           this.helpTableObject.draw(this.mCamera);
        }
        
        for(var i = 0; i < this.scoreMarksArray.length; i++){
            //console.log(this.elements[i]);
            this.scoreMarksArray[i].draw(this.mCamera);
        }
    }
    
    this.accuracyText.draw(this.mCamera);
    
    if(this.revealMsg!=null){
        if(this.revealTime>0){
           this.revealMsg.draw(this.mCamera);
        }
    }
    
   // this.basketText.draw(this.mCamera);

};

BasketScene.prototype.update = function () {
    this.processInput();
    this.updateObjects();
    
    //update selection arrow position
    var pos = this.selectedElement.mFontRenderable.getXform().getPosition();
    this.selectionArrow.getXform().setPosition(pos[0] - 5, pos[1] - 0.5);

    
    //updating the generating of asteroids
    this.genTimer++;
    if(this.genTimer>=350){
        //this.generateBat();
        this.genTimer=0;
    }

    // don't call rayCast 60 times per second, should be called when pressing fire right?
    //this.rayCast();
    
    this.revealTime--;
    
    this.updateBasketText();
    
    this.basketText.getXform().setPosition(this.mHero.getXform().getXPos(),this.mHero.getXform().getYPos() );
    
};

BasketScene.prototype.updateObjects = function(){
    //manually update all objects in the set
    for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        if(obj instanceof Fruit){
            obj.update(this.mAllObjs);
        }
        else{           
            obj.update();
        }
        //If BAt Reverse Directions:
        if(obj instanceof Bat){
            
            if(obj.getXform().getYPos()<=(0 - this.WCHeight/2 + this.groundHeight)){ 
                console.log(obj.getXform().getYPos());
                obj.getXform().setYPos(0-this.WCHeight/2 + this.groundHeight+1);
                obj.yv = -1 *obj.yv;               
            }
            if(obj.getXform().getYPos()>=this.WCCenterY+this.WCHeight/2 + 10){
               console.log(obj.getXform().getYPos());
               obj.getXform().setYPos(this.WCCenterY+this.WCHeight/2 + 9);
               obj.yv = -1 *obj.yv;   
            }
            
        }
    }
};

BasketScene.prototype.incrementScore = function(hit){
    //console.log("score incremented");
    //this.mAllObjs.addToSet(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    //this.nextMarkX += this.markOffset;
    this.scoreMarksArray.push(new ScoreMark(this.scoreMarks, this.nextMarkX, this.nextMarkY, hit));
    this.nextMarkX += this.markOffset;
    this.Shots++;
    
    // if the score was incremented with a bad hit, increase number of
    // incorrect/missed asteroids
    if(!hit){
        this.numIncorrect++;
    } else {
        this.numCorrect++;
        this.Hits++;
    }
    
    // toggle gameover state if exceeded gameeover number
    if(this.numIncorrect >= this.gameOverNumber){
        // set this text element to correctly display numCorrect
        this.gameOverText2 = new MenuElement("Final Score: " + this.numCorrect, -20, 0, 10);
        this.gameOver = true;
    }
    // check if y needs to be incremented and x reset
    if(this.nextMarkX >= this.WCCenterX - (this.WCWidth / 2) + this.markOffset + 100){
        this.nextMarkY += this.markOffset;
        this.nextMarkX = this.WCCenterX - (this.WCWidth / 2) + this.markOffset;
    }
    
    if(this.Shots!=0){
        this.Accuracy= this.Hits/ this.Shots * 100;
    }
    
    this.accuracyText = new MenuElement("Accuracy: "+ this.Accuracy.toPrecision(3) + "%", 0,-70,5);    
};

BasketScene.prototype.processInput = function(){
        //debug Scene Change
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
         gEngine.GameLoop.stop();  
    }
    
    if(!this.gameOver){
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.H)) {
            this.helpTableVisible = true;
        }
        else
        {
            this.helpTableVisible = false;
        }

        
        var heroXF = this.mHero.getXform();
        var deltax = 3.0;
        //moving basket
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)){ 
            heroXF.incXPosBy(-1*deltax);
        }

        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)){
            heroXF.incXPosBy(deltax);
        }    
        
        
        //adjusting operator type
         if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A)) {

            this.selectIndex--;
            
            if(this.selectIndex<0){
                this.selectIndex=this.elements.length-1;
            }
            this.selectedElement = this.elements[this.selectIndex];
        }

        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)){
            this.selectIndex++;           
            //this.selectIndex = clamp(this.selectIndex, 0, this.elements.length - 1);         
            if(this.selectIndex>this.elements.length-1){
                this.selectIndex=0;
            }

            this.selectedElement = this.elements[this.selectIndex];
        }  
        
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)){
            this.checkFruitCollision();
               
        }
        

        
        //turn off or on asteroid generation
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.G)) {
            this.GenerateOn=!this.GenerateOn; 
            console.log("generating Bats: " + this.GenerateOn);
        }
        
        //stop or start asteroid movement
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {

            for (var i = 0; i < this.mAllObjs.size(); i++) {
                var obj = this.mAllObjs.getObjectAt(i);

                if(obj.yv==0){
                    obj.yv=-7;
                }
                else{
                    obj.yv=0;
                }
            }
        }
        
        this.heroControls();
    }
    
};


//Generate an asteroid at a random location at the top of the camera view
BasketScene.prototype.generateBats = function (num) {
     
    for(var i =0; i<num; i++){
        var xl = this.WCCenterX-this.WCWidth/2 + 20 + i*(this.WCWidth/num);
        var yl = 120-(15*i);

        var type=0;
        
        
        //problem type
        type = Math.round(Math.random()*this.maxType); 
        
        
        type=1;
        
        //answer =  true or false.
        var ans = false;

        var Bat1 = new Bat(this.kMinionSprite, xl, yl, false, type, ans);

        //drop speed
        Bat1.yv=-14;

        this.mAllObjs.addToSet(Bat1); 
    }
};


BasketScene.prototype.procHit = function(obj, proj) {   
    //for making reveal message
    var x = obj.getXform().getXPos();
    var y = obj.getXform().getYPos();
    var type = obj.dataType;
    
    if(obj.dataType == proj.dataType){
        this.incrementScore(true);
        this.mAllObjs.removeFromSet(obj);
        this.mAllObjs.removeFromSet(proj);

    }
    else{
        this.incrementScore(false);
        this.mAllObjs.removeFromSet(obj);
        this.mAllObjs.removeFromSet(proj);

        // display a reveal message
        var text="X ";
        if(type==0){
            text += "int";
        }
            if(type==1){
            text += "double";
        }
            if(type==2){
            text += "boolean";
        }
            if(type==3){
            text += "char";
        }
            if(type==4){
            text += "string";
        }

        this.revealMsg = new FontRenderable(text);
        this.revealMsg.setColor([1, 0, 0, 1]);
        this.revealMsg.getXform().setPosition(x, y);
        this.revealMsg.setTextHeight(5);
        this.revealTime=120;
    }
    
};

BasketScene.prototype.defineProblemSet = function() { 
    
    this.problemSet = [
        " 5 , 3+2",  
    ];
};

BasketScene.prototype.generateFruit = function( num) { 
    
    for(var i =0; i<num;i++){
        var x = this.WCCenterX-this.WCWidth/2 + (i*this.WCWidth/num)+ (1/num)*Math.random()*(this.WCWidth - 10);
        var y = this.groundLevel;
        
        var type = Math.round(Math.random()*8);
        
        var fruit = new Fruit(this.kArrow, x, y, type);
        this.mAllObjs.addToSet(fruit);
    }
};

BasketScene.prototype.updateBasketText = function( ) {
    
    //this.leftOperand="5";
    //this.rightOperand="3";
    
    var op = "";
    
    switch(this.Operator){
        case 0:
            op ="==";
            break;
        case 1:
            op="!=";
            break;
        case 2:
            op=">";
            break;
        case 3:
            op="<";
            break;
        case 4:
            op=">=";
            break;        
        
        case 5:
            op="<=";
            break;        
        case 6:
            op="&&";
            break;        
        case 7:
            op="||";
            break;        
    }
    
    this.basketString = op;
    
    this.basketText.setText(this.basketString);
}

BasketScene.prototype.checkFruitCollision = function( ) {
      for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        if(obj instanceof Fruit){
            
            if(obj.checkCollision(this.mHero)){
                obj.terminate=true;
                this.Operator=obj.operatorType;
                //this.updateBasketText();
                this.mHero.attachObj(obj);
            }
        }  
    }
}

BasketScene.prototype.startLevel = function( ) {
    this.generateBats(4);
    this.generatePlatforms(4);
};


//special controls for jumping and etc.
BasketScene.prototype.heroControls = function( ) {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)){
        this.mHero.mRigidBody.setVelocity(0,50);
        this.mHero.mRigidBody.mInvMass=1;
        console.log("jump!");
    }
    
    if(this.mHero.getXform().getYPos()<= this.WCCenterY -this.WCHeight/2 + this.groundHeight){
        console.log(this.groundHeight + "," + this.mHero.getXform().getYPos());
        this.mHero.mRigidBody.mInvMass=0;
        this.mHero.getXform().setYPos(this.WCCenterY -this.WCHeight/2 + this.groundHeight+1);
    }
};

BasketScene.prototype.generatePlatforms = function (num) {
     
    for(var i =0; i<num; i++){
        var xl = this.WCCenterX-this.WCWidth/2 + 20 + i*(this.WCWidth/num);
        var yl = this.groundLevel;
        

        var Platform1 = new Platform(this.kMinionSprite, xl, yl, 10, 20 );

//        //drop speed
//        Bat1.yv=-14;

        this.mAllObjs.addToSet(Platform1); 
    }
};
