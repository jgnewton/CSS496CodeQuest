/* File: Minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/*
var kMinionWidth = 10;
var kMinionHeight = 10;
var kMinionRandomSize = 0;
*/

function Bubble(spriteTexture, atX, atY, createCircle, type) {
        
    var w = 12;
    var h = 12;
    
    
    this.mMinion = new SpriteRenderable(spriteTexture);
    this.mMinion.setElementPixelPositions(0, 211, 1024, 1024 - 210);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(w, h);
   
    GameObject.call(this, this.mMinion);
    
    var r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 0.35*Math.sqrt(w*w + h*h)); 
    else
        r = new RigidRectangle(this.getXform(), w, h);
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    
    var speed = 20 + Math.random() * 10;
    
    
    r.setMass(0);
    
    //r.setVelocity(vx * speed, vy * speed);
    
    
    this.setRigidBody(r);
    
    
    this.dataType=type;

    //this will contain the random message to represent the data type;
    var msg="";
    
    var rn = Math.random()*200 -100;    
    rn=rn.toFixed(2);

        
    this.text = new FontRenderable(msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(200, 200);
    this.text.setTextHeight(7.5);
    
    this.xv = 0;
    this.yv = 0;
    
    this.mortal = true;
    
    this.bound = this.getBBox();
    
    this.displayCoord = false;
    
    this.simNeighbors = [];
    
}
gEngine.Core.inheritPrototype(Bubble, GameObject);

Bubble.prototype.update = function () {

    GameObject.prototype.update.call(this);

    
    this.mRigidBody.setVelocity(this.xv,this.yv);
    
    
    this.bound = this.getBBox();
    
    var x = this.mMinion.getXform().getXPos();
    var y = this.mMinion.getXform().getYPos();
    
    if(this.displayCoord){
        this.text = new FontRenderable("x:"+x.toPrecision(2)+" y:"+y.toPrecision(2));
        this.text.setColor([0, 0, 0, 1]);
        this.text.getXform().setPosition(x, y);
        this.text.setTextHeight(7.5);
    }
    

    this.text.getXform().setPosition(x, y);
};

//commented out draw render temporarily
Bubble.prototype.draw = function (aCamera) {
    //GameObject.prototype.draw.call(this);
    this.mMinion.draw(aCamera);
    
    if (this.isVisible()) {
        if (this.mDrawRenderable)
            this.mRenderComponent.draw(aCamera);
         this.mRigidBody.draw(aCamera);
    }
    this.text.draw(aCamera);
};

Bubble.prototype.randString =function () {
    
    var lib =[ "\"one\"", "\"two\"","\"three\"","\"four\"","\"five\"","\"six\"",
        "\"seven\"","\"eight\"","\"nine\"","\"zero\"",
        "\"True\"","\"False\"","\"I am not a string\"", "\"this is an int\"", 
        "\"I am a double\"", "\"I am a Boolean\"", "\"This is an array of chars\"", 
        "\"This is a double: 9.99\"", "\"HI!\"", "\"I'm friendly\""];
    
    
    var length = lib.length;
    
    var index = Math.round(Math.random()*(length-1));
    
    return lib[index];
        
}


Bubble.prototype.checkNeighbor =function (bubbleSet) {
    for(var i=0; i < bubbleSet.size(); i++){
        if(this.checkCollision(bubbleSet[i]))
            if(this.color == bubbleSet[i].color){
                
            }
    }
}

Bubble.prototype.checkCollision =function (bubble) {
    
}