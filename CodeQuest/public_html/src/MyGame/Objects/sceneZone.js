/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SceneZone(spriteTexture, scoreMarks, atX, atY, win) {
    
    this.w=34;
    this.h=20;
    
    /*
    this.placeHolder = new Renderable();
    if(!win){
        this.placeHolder.setColor([1, 0, 0, 1]);
    } else {
        this.placeHolder.setColor([0, 1, 0, 1]);
    }
    var xf = this.placeHolder.getXform();
    
    xf.setPosition(atX, atY);
    xf.setSize(this.w, this.h);
    */
    
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(this.w, this.h);
    //this.mDye.setElementPixelPositions(0, 240, 512 - 138, 512);
    
    
    GameObject.call(this, this.mDye);
    
    
    this.check = new SpriteRenderable(scoreMarks);
    this.check.getXform().setPosition(atX + 8, atY + 10);
    this.check.getXform().setSize(12, 10);
    
    if(win == "0"){ //red x
        this.check.setElementPixelPositions(548, 756, 1024 - 202, 1024);
    } else if(win == "1"){ //green check
        this.check.setElementPixelPositions(0, 273, 1024 - 202, 1024);
    } else if(win == "2"){ //gold check
        this.check.setElementPixelPositions(274, 544, 1024 - 202, 1024);
    }
    
    this.scene=0; //which scene to go to
    
}
gEngine.Core.inheritPrototype(SceneZone, GameObject);

SceneZone.prototype.update = function (aCamera) {
    
};


SceneZone.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    //this.placeHolder.draw(aCamera);
    this.check.draw(aCamera);
    
};

SceneZone.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
    
} ;

SceneZone.prototype.Transition = function (){
    console.log("transition");
    gEngine.GameLoop.stop(); 
}