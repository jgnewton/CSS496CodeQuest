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
}
gEngine.Core.inheritPrototype(Hero, WASDObj);

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
    this.aimShoot();
    
}
    
Hero.prototype.aimShoot = function () {
    var xform = this.getXform();
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incRotationByDegree(1);       
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incRotationByDegree(-1);    
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.shoot();    
    }
    
    
};


Hero.prototype.shoot = function () {
    this.firing=true;
};