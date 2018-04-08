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

function Asteroid(spriteTexture, atX, atY, createCircle) {
        
    var w = kMinionWidth + Math.random() * kMinionRandomSize;
    var h = kMinionHeight + Math.random() * kMinionRandomSize;
    
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
    
    
    this.dataType=1;
    /*
     *  1. boolean	true or false	false	1 bit	true, false
        2. byte	twos complement integer	0	8 bits	(none)
        3. char	Unicode character	\u0000	16 bits	'a', '\u0041', '\101', '\\', '\'', '\n', 'ß'
        4. short	twos complement integer	0	16 bits	(none)
        5. int	twos complement integer	0	32 bits	-2, -1, 0, 1, 2
        6. long	twos complement integer	0	64 bits	-2L, -1L, 0L, 1L, 2L
        7. float	IEEE 754 floating point	0.0	32 bits	1.23e100f, -1.23e-100f, .3f, 3.14F
        8. double	IEEE 754 floating point	0.0	64 bits	1.23456e300d, -1.23456e-300d, 1e1d
    */
    
    this.text = new FontRenderable("Data Type Filler MSG");
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(5, 73);
    this.text.setTextHeight(2.5);
    
    this.xv=0;
    this.yv=0;
    
}
gEngine.Core.inheritPrototype(Asteroid, GameObject);

Asteroid.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion's animation
    this.mMinion.updateAnimation();

    //his.getXform().incXPosBy(this.xv);
    //this.getXform().incYPosBy(this.yv);
    
    this.mRigidBody.setVelocity(this.xv,this.yv);
    
    
    var x = this.mMinion.getXform().getXPos();
    var y = this.mMinion.getXform().getYPos();
    this.text.getXform().setPosition(x, y);

    
};


Asteroid.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        if (this.mDrawRenderable)
            this.mRenderComponent.draw(aCamera);
        if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
            this.mRigidBody.draw(aCamera);
    }
    this.text.draw(aCamera);
};