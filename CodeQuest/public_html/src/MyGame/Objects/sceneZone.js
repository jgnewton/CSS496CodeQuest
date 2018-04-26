/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SceneZone(spriteTexture, atX, atY, win) {
    
    this.w=10;
    this.h=10;
    
    
    this.placeHolder = new Renderable();
    //this.placeHolder.setColor([1, 0, 0, 1]);
    
    
    console.log(win);
    if(!win){
        this.placeHolder.setColor([1, 0, 0, 1]);
    } else {
        this.placeHolder.setColor([0, 1, 0, 1]);
    }
    var xf = this.placeHolder.getXform();
    
    xf.setPosition(atX, atY);
    xf.setSize(this.w, this.h);
    
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(this.w, this.h);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    
    
    GameObject.call(this, this.mDye);
    
    this.scene=0; //which scene to go to
    
}
gEngine.Core.inheritPrototype(SceneZone, GameObject);

SceneZone.prototype.update = function (aCamera) {
    
};


SceneZone.prototype.draw = function (aCamera) {
    this.placeHolder.draw(aCamera);
    
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