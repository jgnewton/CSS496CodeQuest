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

function Helper(spriteTexture, sprite2) {
    this.kDelta = 0.3;

    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(50, 40);
    this.mDye.getXform().setSize(8, 10);
    //this.mDye.setElementPixelPositions(0, 0, 512, 512);
    
    GameObject.call(this, this.mDye);
    
    this.mDye2 = new SpriteRenderable(sprite2);
    this.mDye2.setColor([1, 1, 1, 0]);
    this.mDye2.getXform().setPosition(50, 40);
    this.mDye2.getXform().setSize(16, 18);
    this.mDye2.setElementPixelPositions(0, 120, 0, 180);
    
    
    var r = new RigidRectangle(this.getXform(), 13, 14);
    this.setRigidBody(r);
    
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
    
    this.mRigidBody.mInvMass=0;
    this.firing=false;
    
    this.mInterpolate = new Interpolate(0,60,.1);
    this.mInterpolatey = new Interpolate(0,60,.1);
    
    this.friendObjectr = new TextureRenderable(spriteTexture);
    this.friendObjectr.getXform().setSize(40, 20);
    
    this.friendObjectl = new TextureRenderable(spriteTexture);
    this.friendObjectl.getXform().setSize(40, 20);
    
    this.right=true;
    
    
}
gEngine.Core.inheritPrototype(Helper, WASDObj);

Helper.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.friendObjectl.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos());
    this.friendObjectr.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos());
        
}

Helper.prototype.draw = function (camera) {
    GameObject.prototype.draw.call(this, camera);
    /*
    if(this.right){
        this.friendObjectr.draw(camera);
    }else{
        this.friendObjectl.draw(camera);
    }
    */
}


Helper.prototype.setTarget = function (obj) {
    var tgx = obj.getXform();
    
}
    
Helper.prototype.follow = function (obj) {
    var xform = obj.getXform();
    
    var x = xform.getXPos();
    var y = xform.getYPos();
    
    if(this.getXform().getXPos()<x){
        this.right=true;
    }else{
        this.right=false;
    }
    
    this.mInterpolate.setFinalValue(x);
    this.mInterpolatey.setFinalValue(y);
    
    this.mInterpolate.updateInterpolation();
    this.mInterpolatey.updateInterpolation();
    
    var nx = this.mInterpolate.getValue();
    var ny = this.mInterpolatey.getValue();
    
    this.getXform().setXPos(nx-10);
    this.getXform().setYPos(ny);
            
};


