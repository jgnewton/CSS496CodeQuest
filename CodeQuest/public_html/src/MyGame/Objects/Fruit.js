/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Fruit(spriteTexture, atX, atY, otype) {
    
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
    
    /* 0 ==
     * 1 !=
     * 2 >
     * 3 <
     * 4 >=
     * 5 <=
     * 6 &&
     * 7 ||
     * 
     */
    this.setText();
    
    
    
}
gEngine.Core.inheritPrototype(Fruit, GameObject);

Fruit.prototype.update = function (objset) {
    this.text.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
    this.placeHolder.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
};


Fruit.prototype.draw = function (aCamera) {
    this.placeHolder.draw(aCamera);
    this.text.draw(aCamera);
};

Fruit.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
    
} ;

Fruit.prototype.Transition = function (){
}

Fruit.prototype.setText = function (){
    var text = "text"
    
    if(this.operatorType==0){
        this.mDye.setColor([1, 0, 0, 1]);
        text = "==";
    }
    
    else if(this.operatorType==1){
        this.mDye.setColor([1, 1, 0, 1]);
        text = "!=";
    }
     else    if(this.operatorType==2){
        this.mDye.setColor([1, .1, .1, 2]);
        text = ">";
    }
     else    if(this.operatorType==3){
        this.mDye.setColor([1, 0, 1, 1]);
        text = "<";
    }
     else    if(this.operatorType==4){
        this.mDye.setColor([0, 1, 1, 1]); 
        text = ">=";
    }
    
    else if(this.operatorType==5){
        this.mDye.setColor([0, 1, 1, 1]); 
        text = "<=";
    }
    
    else if(this.operatorType==6){
        this.mDye.setColor([0, 1, 1, 1]); 
        text = "&&";
    }
    
    else if(this.operatorType==7){
        this.mDye.setColor([0, 1, 1, 1]); 
        text = "||";
    }
    
    this.text = new FontRenderable(text);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(this.getXform().getXPos(),this.getXform().getYPos() );
    this.text.setTextHeight(7.5);
};