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

var kMinionWidth = 6*0.5;
var kMinionHeight = 4.8*0.5;
var kMinionRandomSize = 5;

function Projectile(spriteTexture, atX, atY, width, height, createCircle, type) {
        
    var w = width;
    var h = height;
    
    /*
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
    */
    
    this.mMinion = new Renderable();
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
    r.setVelocity(vx * speed, vy * speed);
    this.setRigidBody(r);
    
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
    
    
    this.dataType=type;
    
    var text = "text"
    
    if(type==0){
        this.mMinion.setColor([1, 0, 0, 1]);
        text = "int";
    }
        if(type==1){
        this.mMinion.setColor([1, 1, 0, 1]);
        text = "double";
    }
        if(type==2){
        this.mMinion.setColor([1, .1, .1, 2]);
        text = "boolean";
    }
        if(type==3){
        this.mMinion.setColor([1, 0, 1, 1]);
        text = "char";
    }
        if(type==4){
        this.mMinion.setColor([0, 1, 1, 1]); 
        text = "string";
    }
    
    this.text = new FontRenderable(text);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(atX, atY);
    this.text.setTextHeight(5);
    
    
    
    //projectiles do not interact with physics... or gravity.
    // for now
    
    // do not set projectile to mass 0....
    //this.mRigidBody.mInvMass=0;
    
    //will manually set veklocity, x and y components
    this.xv=0;
    this.yv=0;
    
    //when to remove from set to reduce lag (or just not draw)
    this.terminated=false;
    this.mortal=true;
    this.lifeTime=999999;
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.update = function () {
    
    // using rigid body for velocities...
    this.mRigidBody.setVelocity(this.xv,this.yv);
    
    GameObject.prototype.update.call(this);
    
    //change position based on velocity
    var mxf = this.mMinion.getXform();
    
    
    // remember to update this.mMinion's animation
    //this.mMinion.updateAnimation();
    var x = mxf.getXPos();
    var y = mxf.getYPos();
    
    this.text.getXform().setPosition(x, y);
        
    //check for being outside camera bounds
    this.lifeTime--;

};


Projectile.prototype.draw = function (aCamera) {
    
    
    //this.mRenderComponent.draw(aCamera);
    //console.log("drawing projectile");
    this.mMinion.draw(aCamera);

    this.text.draw(aCamera);
    
    /*
    if (this.isVisible()) {
        
        if (this.mDrawRenderable){
            //this.mRenderComponent.draw(aCamera);
            this.mMinion.draw(aCamera);
        }
        
        if ((this.mRigidBody !== null) && (this.mDrawRigidShape)){
            this.mRigidBody.draw(aCamera);
        }
    }
    */
    //this.text.draw(aCamera);
};

Projectile.prototype.terminate = function () {
    this.terminated=true;
};

Projectile.prototype.testTerminated = function (WB) {
   var xc = WB[0];
   var yc = WB[1]; 
   var w = WB[2]; 
   var h = WB[3];
   
   var xf = this.getXform();
   
   //console.log("testing");
   
   if(xf.getXPos()>xc+w/2 || xf.getXPos()<xc-w/2 || 
           xf.getYPos()>yc+h/2 || xf.getYPos()<yc-h/2 ){
       
       //do not terminate laser raycast projectil
       if(this.dataType!=2){
            this.terminate();
        }
   }
   
   //console.log(this.lifeTime);
   if(this.lifeTime<=0){
       this.terminate();
   }
};