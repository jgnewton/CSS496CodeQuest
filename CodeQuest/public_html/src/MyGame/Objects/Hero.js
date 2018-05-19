/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture) {
    this.kDelta = 0.3;

    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(50, 40);
    this.mDye.getXform().setSize(16, 18);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    
    GameObject.call(this, this.mDye);
    
    
    var r = new RigidRectangle(this.getXform(), 13, 14);
    this.setRigidBody(r);
    
    //this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
    
    this.mRigidBody.mInvMass=0;
    this.firing=false;
    this.carryHeight=2;
}
gEngine.Core.inheritPrototype(Hero, GameObject);


Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
    //this.aimShoot();
    
    /*if(this.attachedObj!=null){
        var hxf = this.getXform();
        var oxf = this.attachedObj.getXform();
        
        oxf.setXPos(hxf.getXPos());
        oxf.setYPos(hxf.getYPos()); + this.carryHeight;
    }*/
       
}

Hero.prototype.heroControls = function () {
    var kWASDDelta = .5;
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPosBy(kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPosBy(-kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-kWASDDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(kWASDDelta);
    }    
}

//pickup or drop an object
Hero.prototype.attachObj = function (obj) {
    if(this.attachedObj==null){
       this.attachedObj = obj;
       obj.attached = true;
       obj.onPlatform = false;
      // obj.mRigidBody.mInvMass=0;
    }
    else{
        var hxf = this.getXform();
        var oxf = this.attachedObj.getXform();
        
        //put down
        //oxf.setYPos(hxf.getYPos());
        //obj.mRigidBody.mInvMass=1;
        obj.attached = false;
        obj.onPlatform = false;
        //detach
        this.attachedObj=null;
        
    }
};

//Eat Fruits
Hero.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
} ;
