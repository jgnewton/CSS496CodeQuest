/* File: Cannon.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Cannon(basetext, muzzletext) {
    /*
    this.cannon = new SpriteRenderable(spriteTexture);
    //this.base.setColor([1, 1, 1, 0]);
    //this.base.getXform().setPosition(50, 40);
    this.cannon.getXform().setSize(10, 20);
    this.cannon.setElementPixelPositions(0, 70, 263, 422);
    //this.cannon.setElementPixelPositions(0, 70, 95, 222);
    
    this.base = new SpriteRenderable(spriteTexture);
    this.base.getXform().setSize(40, 30);
    this.base.setElementPixelPositions(0, 217, 95, 222);
    //this.base.setElementPixelPositions(0, 217, 263, 422);
    */
   
    this.base = new SpriteRenderable(basetext);
    this.base.getXform().setSize(40, 30);
    this.base.setElementPixelPositions(0, 217, 256 - 159, 256);

    this.cannon = new SpriteRenderable(muzzletext);
    this.cannon.getXform().setSize(15, 30);
    this.cannon.setElementPixelPositions(0, 70, 256 - 127, 256);
    
    GameObject.call(this, this.base);
    
    
    //var r = new RigidRectangle(this.getXform(), 13, 14);
    //this.setRigidBody(r);
    
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
    
    //this.mRigidBody.mInvMass=0;
    //this.firing=false;
    //this.carryHeight=2;
}
//gEngine.Core.inheritPrototype(Cannon, WASDObj);

Cannon.prototype.update = function () {
    GameObject.prototype.update.call(this);
    
}

Cannon.prototype.draw = function (aCamera) {
    this.base.draw(aCamera);
    this.cannon.draw(aCamera);
    
}

Cannon.prototype.intRotByDeg = function(inRot){
    this.cannon.getXform().incRotationByDegree(inRot);
    
    if(this.cannon.getXform().getRotationInDegree()>100){
        this.cannon.getXform().setRotationInDegree(100);
    }
    if(this.cannon.getXform().getRotationInDegree()<-100){
        this.cannon.getXform().setRotationInDegree(-100);
    }
}