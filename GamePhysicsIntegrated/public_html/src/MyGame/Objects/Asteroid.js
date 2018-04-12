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

function Asteroid(spriteTexture, atX, atY, createCircle, type) {
        
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
    
    
    this.dataType=type;
    /*
     * 
     * int=0
     * double=1
     * boolean=2
     * Char=3
     * string=4
     * 
     * 
     * void=5
     * 
     * 
     * 
     * 
     * 
     *  1. boolean	true or false	false	1 bit	true, false
        2. byte	twos complement integer	0	8 bits	(none)
        3. char	Unicode character	\u0000	16 bits	'a', '\u0041', '\101', '\\', '\'', '\n', 'ß'
        4. short	twos complement integer	0	16 bits	(none)
        5. int	twos complement integer	0	32 bits	-2, -1, 0, 1, 2
        6. long	twos complement integer	0	64 bits	-2L, -1L, 0L, 1L, 2L
        7. float	IEEE 754 floating point	0.0	32 bits	1.23e100f, -1.23e-100f, .3f, 3.14F
        8. double	IEEE 754 floating point	0.0	64 bits	1.23456e300d, -1.23456e-300d, 1e1d
    */
    
    //this will contain the random message to represent the data type;
    var msg="";
    
    var rn = Math.random()*200 -100;
    
    rn=rn.toFixed(2);
    
    //console.log(this.dataType);
    
    if(this.dataType == 0){
        rn = Math.floor(rn);
    }
    
    if(this.dataType == 2){
        
        var rn2 = Math.random();
        
        var bool="False"; 
        if(rn2>.5){
            bool="True";
        }
        rn = bool;
    }
    
    if(this.dataType ==3 ){
        
        var arm = 33 + Math.round(93*Math.random());
        
        rn = "\'"+String.fromCharCode(arm)+"\'";
    }
    
    
    
    if(this.dataType == 4){
      rn = this.randString();  
    }

    
    
    msg = rn.toString();
    
    
    this.text = new FontRenderable(msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(5, 73);
    this.text.setTextHeight(7.5);
    
    this.xv=0;
    this.yv=0;
    
    this.mortal=true;
    
    this.bound = this.getBBox();
}
gEngine.Core.inheritPrototype(Asteroid, GameObject);

Asteroid.prototype.update = function (projectileList) {
    var status = 0;
    // 0 = no hit
    // 1 = good hit
    // 2 = bad hit
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion's animation
    this.mMinion.updateAnimation();

    //his.getXform().incXPosBy(this.xv);
    //this.getXform().incYPosBy(this.yv);
    
    this.mRigidBody.setVelocity(this.xv,this.yv);
    
    
    var x = this.mMinion.getXform().getXPos();
    var y = this.mMinion.getXform().getYPos();
    this.text.getXform().setPosition(x, y);
    
    
    this.bound=this.getBBox();
    
    for (var i = 0; i < projectileList.size(); i++) {
        var obj = projectileList.getObjectAt(i);
                
        if(obj instanceof Projectile){
             var projectileBound=obj.getBBox();
             
             if(this.bound.intersectsBound(projectileBound)!=0){

                if(this.dataType==obj.dataType){
                    this.hit(obj);
                    status=1;
                }
                else{
                    this.falseHit(obj);
                    status=2;
                }
                
                
                obj.terminate();
             }
        }
    }
    
    /*
    if(this.testTerminated(WB)){
        status = 2;
    } 
    */
    return status;
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

Asteroid.prototype.testTerminated = function (WB) {
   var xc = WB[0];
   var yc = WB[1]; 
   var w = WB[2]; 
   var h = WB[3];
   
   var xf = this.getXform();
   
   if(xf.getXPos()>xc+w/2 || xf.getXPos()<xc-w/2 || 
           xf.getYPos()>yc+h/2 || xf.getYPos()<yc-h/2 ){
       
       this.terminate();
       //return true;
   }
   //return false;
}

Asteroid.prototype.terminate = function () {
    this.terminated=true;
}

Asteroid.prototype.hit = function (projectile) {
    //console.log("Hit!");
    this.mMinion.setColor([1, 0, 0, 1]);
    //scoreMark
   // scoreMark.draw(aCamera)
    this.terminate();
}

Asteroid.prototype.falseHit = function (projectile) {
    //console.log("False Hit");
    this.mMinion.setColor([1, 1, 1, 1]);
    this.terminate();
}


Asteroid.prototype.randString =function () {
    
    var lib =[ "\"one\"", "\"two\"","\"three\"","\"four\"","\"five\"","\"six\"",
        "\"seven\"","\"eight\"","\"nine\"","\"zero\"",
        "\"True\"","\"False\"","\"I am not a string\"", "\"this is an int\"", 
        "\"I am a double\"", "\"I am a Boolean\"", "\"This is an array of chars\"", 
        "\"This is a double: 9.99\"", "\"HI!\"", "\"I'm friendly\"",];
    
    
    
    var length = lib.length;
    
    var index = Math.round(Math.random()*length);
    
    return lib[index];
        
}


