/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Platform(spriteTexture, atX, atY, wid, height, otype) {
    
    this.w=wid;
    this.h=height;
    this.x=atX;
    this.y =atY;
    
    this.block = new Renderable();
    this.block.setColor([0, .5, .2, 1]);
    var bxf = this.block.getXform();
    
    bxf.setPosition(this.x, this.y);
    bxf.setSize(this.w, this.h);
    
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(this.x, this.y);
    this.mDye.getXform().setSize(this.w, this.h);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    
    
    GameObject.call(this, this.mDye);
    
    this.scene=0; //which scene to go to
    
    this.operatorType=otype;
    console.log(this.operatorType);
    
   this.myFruit = null;   
   this.isFull = false;
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

Platform.prototype.checkCollision = function (objSet){
    var BBox = this.getBBox();
    BBox.setBounds([this.getXform().getXPos(), this.getXform().getYPos() + (this.h/2)], this.w, this.h/4);
    
    for (var i = 0; i < objSet.size(); i++) {
       var obj = objSet.getObjectAt(i);
       if(obj instanceof Fruit){
           if(BBox.intersectsBound(obj.getBBox())!=0){
               //obj.getXform().setYPos()
               obj.mRigidBody.setMass(0);
               this.setFruit(obj);
               this.isFull = true;
               obj.onPlatform = true;//need to set it to false when the bat eats the fruit and when the hero pick it up again
               return true;
           }
        }
    }
    return false;
};

Platform.prototype.getFruit = function(){
    return this.myFruit;
    
};

Platform.prototype.setFruit = function (currFruit){
    this.myFruit = currFruit;
    var mxf = this.myFruit.getXform();
    
    mxf.setPosition(this.x, this.y+this.h);
    
    
};