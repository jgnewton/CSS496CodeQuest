/* File: Helper.js 
 *
 * Creates and initializes the Helper (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, WASDObj */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Helper(spriteTexture) {
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
    
    this.mInterpolate = new Interpolate();
}
gEngine.Core.inheritPrototype(Helper, WASDObj);

Helper.prototype.update = function () {
    GameObject.prototype.update.call(this);
        
}

Helper.prototype.setTarget = function (obj) {
    var tgx = obj.getXform();
    
}
    
Helper.prototype.follow = function (obj) {
    var xform = obj.getXform();
    var x = xform.getXPos();
    this.mInterpolate.setFinalValue(x);
    
    this.getXform().setXPos(x+10);
            
};


