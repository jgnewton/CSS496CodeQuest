/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Platform(spriteTexture, atX, atY, wid, hight, otype) {
    
    this.w=wid;
    this.h=hight;
//    this.x=0;
//    this.y =0;
    
    this.block = new Renderable();
    this.block.setColor([1, 0, 0, 1]);
    var bxf = this.block.getXform();
    
    bxf.setPosition(atX, atY);
    bxf.setSize(this.w, this.h);
    
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(this.w, this.h);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    
    
    GameObject.call(this, this.mDye);
    
    this.scene=0; //which scene to go to
    
    this.operatorType=otype;
    console.log(this.operatorType);
<<<<<<< HEAD

   this.myFruit = null;
=======
    
   this.myFruit = null;
  
>>>>>>> 26cf8c5ca408215873e16f7405ea40cbffb3e2e6

    
}
gEngine.Core.inheritPrototype(Platform, GameObject);

Platform.prototype.update = function (objset) {
   // this.text.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
    this.block.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
};


Platform.prototype.draw = function (aCamera) {
    this.block.draw(aCamera);
    //this.text.draw(aCamera);
};

Platform.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
    
};

Platform.prototype.getFruit = function(){
    return this.myFruit;
    
};

Platform.prototype.setFruit = function (currFruit){
    this.myFruit = currFruit;
    var mxf = this.myFruit.getXform();
    
    mxf.setPosition(atX, atY+this.h);
    
    
};