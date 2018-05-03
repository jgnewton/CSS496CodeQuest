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

//type = type of question
// ans = true or false.

const EQUAL = 0;
const NOT_EQUAL = 1;
const GREATER = 2;
const LESSER = 3;
const GREATER_OR_EQUAL = 4;
const LESSER_OR_EQUAL = 5;
const LOGICAL_AND = 6;
const LOGICAL_OR = 7;

function Bat(spriteTexture, atX, atY, createCircle, type, ans) {
        
    var w = 25;
    var h = 25;
    
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(w, h);
    this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates

    GameObject.call(this, this.mMinion);
    
    var r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 0.35*Math.sqrt(w*w + h*h)); 
    else
        r = new RigidRectangle(this.getXform(), w, h);
    var vx = (Math.random() - 0.5);
    var vy = (Math.random() - 0.5);
    var speed = 20 + Math.random() * 10;
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    //this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
    
    //not using physics
    // do not set mass to 0.
    //this.mRigidBody.mInvMass=0;
    
    
    this.problemType=type;

    
    this.xv=0;
    this.yv=0;
    
    this.mortal=true;
    
    this.bound = this.getBBox();
    
    this.displayCoord=false;
    
    this.answer=ans;
    
    this.correctOType=0;
    this.correctAnswer=0;
    
    this.setText();
    
    this.text.getXform().setPosition(atX-15, atY);
    
    
    this.sprite = spriteTexture;
    
    this.DROP_DELAY = 60;
    
    this.timer = 0;
    
    
}
gEngine.Core.inheritPrototype(Bat, GameObject);

Bat.prototype.update = function () {
    //var status = 0;
    // 0 = no hit
    // 1 = good hit
    // 2 = bad hit
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion' s animation
    this.mMinion.updateAnimation();

    //this.getXform().incXPosBy(this.xv);
    //this.getXform().incYPosBy(this.yv);
    
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
    

    //this.text.getXform().setPosition(x-15, y);
    
    this.test();
    
    this.timer++;
    
};

//commented out draw render temporarily
Bat.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        //if (this.mDrawRenderable)
            this.mRenderComponent.draw(aCamera);
        //if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
            this.mRigidBody.draw(aCamera);
    }
    this.text.draw(aCamera);
};




Bat.prototype.setText =function (){
    //this will contain the random message to represent the data type;
    var msg="(";
    
    var rn = Math.random()*200 -100;
    
    rn=rn.toFixed(2);
    
    //console.log(this.problemType);
    
    if(this.problemType == 0){
        msg+=this.equalityBank();
    }
    
    if(this.problemType == 1){
        msg+=this.ltgtBank();
    }
    
    if(this.problemType == 2){
        msg+=this.goEltBank();
    }
    
    if(this.problemType == 3 ){
        msg+=this.loEgtBank();        
    }
    
       
    if(this.problemType == 4){
        msg+=this.boolBank();
    }
    
    var addendum = ")";
    if(this.answer){
        //addendum= " )== true";
    }else{
        //addendum= " )== false";
    }
    
    msg+=addendum;
   //change color instead.
   
    
    this.text = new FontRenderable(msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(200, 200);
    this.text.setTextHeight(10); 
    
    if(!this.answer){
        this.text.setColor([1, 0, 0, 1]);    
   }
   else{
       this.text.setColor([0, 0, 1, 1]);  
   }
} ;

//!=    or    ==
Bat.prototype.equalityBank =function (){
    var bank = [
        
        //!=
        "True __ False",
        "False __ True",
        "1 __ 2",
        "1 __ 0",
        "2+2 __ 5",        
        "6 __ 7",
        "1.01 __ 1.00",
        "2 __ 1",
        
        //==
        "True __ True",
        "False __ False",
        "1 __ 1",
        "2 __ 2",
        "2+2 __ 4",
        "2+4 __ 6",
        "3.14__ 3.14",
        "2-2 __ 0",
    ];
    
    var idx = Math.round(Math.random()*(bank.length-1));
    
    
    console.log("idx" + idx);
    var cutoff = 8;
    if(idx<cutoff){
        this.correctAnswer=NOT_EQUAL;
    }
    else{
        this.correctAnswer=EQUAL;
    }
    
    var ret = bank[idx];
    
    console.log("correct answer in bat:"+this.correctAnswer);
    return ret;
}

// >   or    <     or    ==
Bat.prototype.ltgtBank =function (){
    var bank = [

        // <
        "1 __ 2",
        "2 __ 3",
        "-1 __ 0",
        "-1 __ 1",
        "4 __ 5",
        "3 __ 2+2",
               
        // >
        "1 __ 0",
        "2+1 __ 2",        
        "7.5 __ 7",
        "1.01 __ 1.00",
        "2 __ 1",
        "0 __ -1",
        
        //==
        "1+3 __ 4",
        "2.1 __ 2.1",
        "2+3 __ 5",
        "6 __ 2+4",
        "2.72__ 2.72",
        "0 __ 3-3",
    ];
    var idx = Math.round(Math.random()*(bank.length-1));
    var ret = bank[idx];
    
        var cutoff = 6;
        var cutoff2 = 12;
    if(idx<cutoff){
        this.correctAnswer=LESSER;
    }
    else if(idx<cutoff2) {
        this.correctAnswer=GREATER;
    }
    else{
        this.correctAnswer=EQUAL;
    }
    
    
    return ret;
}


//>=  or    <
Bat.prototype.goEltBank =function (){
    var bank = [

        // >=
                       
            // >
            "1 __ 0",
            "2+1 __ 2",        
            "7.5 __ 7",
            "1.01 __ 1.00",
            "2 __ 1",
            "0 __ -1",
             // OR
            //==
            "1+3 __ 4",
            "2.1 __ 2.1",
            "2+3 __ 5",
            "6 __ 2+4",
            "2.72__ 2.72",
            "0 __ 3-3",
        
        // <        
        "1 __ 2",
        "2 __ 3",
        "-1 __ 0",
        "-1 __ 1",
        "4 __ 5",
        "3 __ 2+2",
            "1+2 __ 4",
            "2.1 __ 2.2",
            "2+2 __ 5",
            "3 __ 2+4",
            "2.71__ 2.72",
            "0 __ 3-2",
    ];
    var idx = Math.round(Math.random()*(bank.length-1));
    var ret = bank[idx];
    
    var cutoff = 12;
    if(idx<cutoff){
        this.correctAnswer=GREATER_OR_EQUAL;
    }
    else{
        this.correctAnswer=LESSER;
    }
    
    
    return ret;
}


//>=  or    <
Bat.prototype.loEgtBank =function (){
    var bank = [

        // >
                       
            // >
            "1 __ 0",
            "2+1 __ 2",        
            "7.5 __ 7",
            "1.01 __ 1.00",
            "2 __ 1",
            "0 __ -1",
             
            "3+2 __ 4",
            "2.1 __ 2.01",
            "2+2 __ 3",
            "7 __ 2+4",
            "2.73__ 2.72",
            "0 __ 3-4",
            // 
            // 

        // <=
             //
            //==
            "1+3 __ 4",
            "2.1 __ 2.1",
            "2+3 __ 5",
            "6 __ 2+4",
            "2.72__ 2.72",
            "0 __ 3-3",
        
        // <        
        "1 __ 2",
        "2 __ 3",
        "-1 __ 0",
        "-1 __ 1",
        "4 __ 5",
        "3 __ 2+2",

    ];
    var idx = Math.round(Math.random()*(bank.length-1));
    var ret = bank[idx];
    
    var cutoff = 12;
    if(idx<cutoff){
        this.correctAnswer=GREATER;
    }
    else{
        this.correctAnswer=LESSER_OR_EQUAL;
    }
      
    return ret;
}



Bat.prototype.boolBank =function (){
    var bank = [
    
    //    ||    
    "True __ False",
    "True __ True",
    "False __ True",
    "(True __ False) || False",    
    "(True __ False) && True",
    "(2+2==4) __ (2+2==5) == True",
     "(True __ False) == (True && True)",
    
    
    // &&
    "(True __ False) == False",
    "!(True __ False)",    
    "(True __ False) != (True && True)",
    "(2+2==4) __ (2+2==5) == False", 
    "True != (True __ False)",   
    "False && False && False && False __ True == False",
    "!True __ !False == False",
    
    ];
    
    var idx = Math.round(Math.random()*(bank.length-1));
    

    
    var cutoff = 8;
    if(idx<cutoff){
        this.correctAnswer=LOGICAL_OR;
    }
    else{
        this.correctAnswer=LOGICAL_AND;
    }
    
    return bank[idx];
    
}


Bat.prototype.dropFruit =function (){    
    console.log("bat dropping fruit");
    var fruit = new Fruit (this.sprite, this.getXform().getXPos(), this.getXform().getYPos(), this.answer);    
    return fruit;
};


Bat.prototype.flyAway =function (){
    this.yv = 8;
};