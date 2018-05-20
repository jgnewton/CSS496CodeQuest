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
        
    var w = 16;
    var h = 16;
    
    
    this.mMinion = new SpriteRenderable(spriteTexture);
    this.mMinion.setElementPixelPositions(15, 497, 487, 25);
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
    
    
    this.color = type;

    //this will contain the random message to represent the data type;
    this.msg = "X";
    
    var rn = Math.random()*200 -100;    
    rn=rn.toFixed(2);

        
    this.text = new FontRenderable(this.msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(atX, atY);
    this.text.setTextHeight(7.5);
    
    this.xv = 0;
    this.yv = 0;
    
    this.mortal = true;
    
    this.bound = this.getBBox();
    
    this.displayCoord = false;
    
    this.simNeighbors = [];
    this.setColor();
    
    this.poped = false;
    
    this.w = w;
    this.h= h;
    
    this.drawText = false;
    
    this.answerKey=-1;
    
}
gEngine.Core.inheritPrototype(Bubble, GameObject);

Bubble.prototype.update = function () {

    GameObject.prototype.update.call(this);    
    this.mRigidBody.setVelocity(this.xv,this.yv);
       
  //  this.bound = this.getBBox();
    
    var x = this.mMinion.getXform().getXPos();
    var y = this.mMinion.getXform().getYPos();
        
    var n = this.simNeighbors.length;
    
   // var msg = " " + n;
    
    //this.text.setText(msg);
   // this.text.setColor([0, 0, 0, 1]);
   // this.text.setTextHeight(7.5);
    this.getXform().incXPosBy(this.xv);
    this.getXform().incYPosBy(this.yv);
   // this.text.getXform().setPosition(x, y);
};

//commented out draw render temporarily
Bubble.prototype.draw = function (aCamera) {
    //GameObject.prototype.draw.call(this);
    this.mMinion.draw(aCamera);
    
    
    if (this.isVisible()) {
        if (this.mDrawRenderable)
            this.mRenderComponent.draw(aCamera);
         //htis.mRigidBody.draw(aCamera);
    }
    
    if(this.drawText){
        //console.log("Drawing Tesxt");
        //console.log(this.msg);
        this.text.draw(aCamera);
    }
    
    
    //this.text.draw(aCamera);
};

Bubble.prototype.randString = function () {
    
    var lib =[ "\"one\"", "\"two\"","\"three\"","\"four\"","\"five\"","\"six\"",
        "\"seven\"","\"eight\"","\"nine\"","\"zero\"",
        "\"True\"","\"False\"","\"I am not a string\"", "\"this is an int\"", 
        "\"I am a double\"", "\"I am a Boolean\"", "\"This is an array of chars\"", 
        "\"This is a double: 9.99\"", "\"HI!\"", "\"I'm friendly\""];
    
    
    var length = lib.length;
    
    var index = Math.round(Math.random()*(length-1));
    
    return lib[index];
        
}


Bubble.prototype.checkNeighbor = function (bubbleSet) {
    //console.log("checkNeighbor");
    this.simNeighbors=[];
    for(var i=0; i < bubbleSet.size(); i++){
        
        var b = bubbleSet.getObjectAt(i) 
        //console.log("test");
        if(this!=b && this.checkCollision(b))
            if(this.color == b.color){
                this.simNeighbors.push(b);
                //b.simNeighbors.push(this);
                //b.checkNeighbor(bubbleSet);
                if(b.simNeighbors.length >= 2){
                    //this.pop();
                }
            }
    }
}



Bubble.prototype.checkCollision = function (bubble, shrink) {
    if(bubble != null){
        var BBox = this.getBBox();
        BBox.setBounds([this.getXform().getXPos(), this.getXform().getYPos()], this.w+2, this.h+2);
        
        var sFactor = 3/4;
        
        if(shrink){
        BBox.setBounds([this.getXform().getXPos() + (1-sFactor)/2, this.getXform().getYPos()+ (1-sFactor)/2], this.w*sFactor, this.h*sFactor);    
        }
        //  
 //  BBox.setBounds(this.getXform().getXPos(), this.getXform().getYPos(), this.w+1, this.h +1);
       //console.log("checkCollision");
          if(BBox.intersectsBound(bubble.getBBox())!=0){
              //console.log("collide");
           return true;
       }
       else{
           //console.log("no collision");
           return false;
       } 
    }
}

Bubble.prototype.checkToPop = function () {
    var startPop = false;
    if(this.simNeighbors.length >= 2){
        startPop = true;
    }
    else{
        for(var i=0; i < this.simNeighbors.length; i++){
            if(this.simNeighbors[i].simNeighbors.length >= 2){
                startPop = true;
            }
        }
    }
    if(startPop)
        this.pop();
}

Bubble.prototype.pop = function () {
    this.poped = true;
    for(var i=0; i < this.simNeighbors.length; i++){
      console.log("Pop neighbors!! :D");
      if(!this.simNeighbors[i].poped)
        this.simNeighbors[i].pop();
    }
}

Bubble.prototype.setColor = function () {
   switch (this.color) {
    case 0:
        this.mMinion.setColor([1,.2,.1,.5]);//red
        break;
    case 1:
        this.mMinion.setColor([.2,.2,1,.5]);//blue
        break;
    case 2:
        this.mMinion.setColor([.1,.9,.1,.5]);//green
        break;
    case 3:
        this.mMinion.setColor([1,.9,.2,.5]);//yellow
        break;
    case 4:
        this.mMinion.setColor([.9,.1,.9,.5]);//purple
        break;
    case 5:
        this.mMinion.setColor([.1,1,1,.5]);//turquoise
        break;
    case 99:
        this.mMinion.setColor([0,0,0,.5]);//Black
    }

    
}

Bubble.prototype.velocity = function (x, y) {
    this.xv = x;
    this.yv = y;

}

Bubble.prototype.assignValue = function (string, answer) {
    console.log("assigned" +string);
    this.drawText= true;
    this.msg= string;
    this.text.setText(string);
    
    if(string.length>2){
        this.text.getXform().incXPosBy(-1*this.w/3);
    }
    
    if(this.color == 1){
        this.text.setColor([0,0,0,1]);
    }
    
    
    this.mAnswer = answer;
};