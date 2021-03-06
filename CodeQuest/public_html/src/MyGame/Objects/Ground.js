/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Platform(spriteTexture, atX, atY, otype) {
    
    this.w=10;
    this.h=10;
    
    
    this.placeHolder = new Renderable();
    this.placeHolder.setColor([1, 0, 0, 1]);
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
    
    this.operatorType=otype;
    console.log(this.operatorType);
    
   
    
    
}
gEngine.Core.inheritPrototype(Platform, GameObject);

Platform.prototype.update = function (objset) {
    this.text.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
    this.placeHolder.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
};


Platform.prototype.draw = function (aCamera) {
    this.placeHolder.draw(aCamera);
    this.text.draw(aCamera);
};

Platform.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
    
} ;
