/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Fruit(spriteTexture, atX, atY, answer) {
    
    this.w=20;
    this.h=13;
    
    this.answer = answer;
    
    /*
    this.fruit = new Renderable();
    this.fruit.setColor([1, 0, 0, 1]);
    
    if(this.answer){
        this.fruit.setColor([0, 0, 1, 1]);   
    }else{
        this.fruit.setColor([1, 0, 0, 1]);    
    }
    */
   
    this.fruit = new SpriteRenderable(spriteTexture);
    //Fish - (0,0),(350,0),(0,199),(350,199)
    this.fruit.setElementPixelPositions(0, 350, 512, 512 - 199);
    
    
    var xf = this.fruit.getXform();
    
    xf.setPosition(atX, atY);
    xf.setSize(this.w, this.h);
    
    /*
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(this.w, this.h);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    */
    
    GameObject.call(this, this.fruit);
    
    this.scene=0; //which scene to go to
    
    //this.operatorType=otype;
    //console.log(this.operatorType);
    
    
    
    
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
    
    var r = new RigidRectangle(this.fruit.getXform(), this.w, this.h);
    r.setAngularVelocity(Math.random()*2 - 1);
    //r.setMass(40);
    //r.setInertia(.01);
    this.setRigidBody(r);
    //this.mRigidBody.mInvMass=0;
    this.attached = false;
    this.onPlatform = false;
}
gEngine.Core.inheritPrototype(Fruit, GameObject);

Fruit.prototype.update = function (objset) {
    GameObject.prototype.update.call(this);
    this.text.getXform().setPosition(this.fruit.getXform().getXPos(),this.fruit.getXform().getYPos() );
    this.fruit.getXform().setPosition(this.fruit.getXform().getXPos(),this.fruit.getXform().getYPos() );
    this.fruit.getXform().incYPosBy(.6);
};


Fruit.prototype.draw = function (aCamera) {
    this.fruit.draw(aCamera);
    //this.text.draw(aCamera);
};
/*
Fruit.prototype.checkCollision = function (obj){
    
    if(this.getBBox().intersectsBound(obj.getBBox())!=0){
        return true;
    }
    else{
        return false;
    }
    
} ;
*/
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