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
    
    this.setText();
    
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
    

    this.text.getXform().setPosition(x, y);
};

//commented out draw render temporarily
Bat.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.mDrawRenderable)
           // this.mRenderComponent.draw(aCamera);
        if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
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
        msg+="== , !=";
        this.equalOrNot();
    }
    
    if(this.problemType == 1){
        msg+="> , ==,  <";
       this.moreOrEqualOrLess();

    }
    
    if(this.problemType == 2){
        msg+=">=, <";
        this.greaterEqualOrLess();
    }
    
    if(this.problemType == 3 ){
        msg+="<=, >";
        this.lesserEqualOrMore();
        
    }
    
       
    if(this.problemType == 4){
        msg+="&&, ||";
        this.andOrOR();
    }
    
    var addendum = "";
    if(this.answer){
        addendum= " )= true";
    }else{
        addendum= " )= false";
    }
    
    msg+=addendum;
    
    this.text = new FontRenderable(msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(200, 200);
    this.text.setTextHeight(5);    
} ;

Bat.prototype.equalOrNot =function (){
};

Bat.prototype.moreOrEqualOrLess =function (){
};

Bat.prototype.greaterEqualOrLess =function (){
};

Bat.prototype.lesserEqualOrMore =function (){
};

Bat.prototype.andOrOR =function (){
};
