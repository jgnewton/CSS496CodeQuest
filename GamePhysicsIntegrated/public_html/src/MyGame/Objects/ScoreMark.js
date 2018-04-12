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


function ScoreMark(spriteTexture, atX, atY, correct) {
    this.mMinion = new SpriteRenderable(spriteTexture);
    //this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY); 
    this.mMinion.getXform().setSize(4,4);
    
    if(correct){
        //left, right, top, bottom
        this.mMinion.setElementPixelPositions(0, 64, 64, 128);//check marke
    } else {
        this.mMinion.setElementPixelPositions(0, 64, 0, 64);//X marke
    }
    
    GameObject.call(this, this.mMinion);
   
}
gEngine.Core.inheritPrototype(ScoreMark, GameObject);

ScoreMark.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);
};


ScoreMark.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
};

