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

/*
var kMinionWidth = 10;
var kMinionHeight = 10;
var kMinionRandomSize = 0;
*/

//type = type of question
// ans = true or false.
function Bat(spriteTexture, atX, atY, createCircle, type, ans) {
        
    var w = 25;
    var h = 25;
    
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
    
    
    this.problemType=type;

    
    this.xv=0;
    this.yv=0;
    
    this.mortal=true;
    
    this.bound = this.getBBox();
    
    this.displayCoord=false;
    
    this.answer=ans;
    
    this.correctOType=0;
    
    this.setText();
    
    this.sprite = spriteTexture;
    
    this.DROP_DELAY = 60;
    
    this.timer = 0;
    
}
gEngine.Core.inheritPrototype(Bat, GameObject);

Bat.prototype.update = function () {
    //var status = 0;
    // 0 = no hit
    // 1 = good hit
    // 2 = bad hit
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion' s animation
    this.mMinion.updateAnimation();

    //this.getXform().incXPosBy(this.xv);
    //this.getXform().incYPosBy(this.yv);
    
    this.mRigidBody.setVelocity(this.xv,this.yv);
    
    
    this.bound = this.getBBox();
    
    var x = this.mMinion.getXform().getXPos();
    var y = this.mMinion.getXform().getYPos();
    
    if(this.displayCoord){
        this.text = new FontRenderable("x:"+x.toPrecision(2)+" y:"+y.toPrecision(2));
        this.text.setColor([0, 0, 0, 1]);
        this.text.getXform().setPosition(x, y);
        this.text.setTextHeight(7.5);
    }
    

    this.text.getXform().setPosition(x-15, y);
    
    this.test();
    
    this.timer++;
    
};

//commented out draw render temporarily
Bat.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        //if (this.mDrawRenderable)
            //this.mRenderComponent.draw(aCamera);
        //if ((this.mRigidBody !== null) && (this.mDrawRigidShape))
            //this.mRigidBody.draw(aCamera);
    }
    this.text.draw(aCamera);
};




Bat.prototype.setText =function (){
    //this will contain the random message to represent the data type;
    var msg="(";
    
    var rn = Math.random()*200 -100;
    
    rn=rn.toFixed(2);
    
    //console.log(this.problemType);
    
    if(this.problemType == 1){
        msg+=this.equalOrNot();
    }
    
    if(this.problemType == 2){
        msg+="> , ==,  <";
       this.moreOrEqualOrLess();
    }
    
    if(this.problemType == 3){
        msg+=">=, <";
        this.greaterEqualOrLess();
    }
    
    if(this.problemType == 4 ){
        msg+="<=, >";
        this.lesserEqualOrMore();        
    }
    
       
    if(this.problemType == 5){
        msg+="&&, ||";
        this.andOrOR();
    }
    
    var addendum = ")";
    if(this.answer){
        //addendum= " )== true";
    }else{
        //addendum= " )== false";
    }
    
    msg+=addendum;
   //change color instead.
   
    
    this.text = new FontRenderable(msg);
    this.text.setColor([0, 0, 0, 1]);
    this.text.getXform().setPosition(200, 200);
    this.text.setTextHeight(5); 
    
    if(!this.answer){
        this.text.setColor([1, 0, 0, 1]);    
   }
} ;

Bat.prototype.equalOrNot =function (){
    return this.generateExpression();
};

Bat.prototype.moreOrEqualOrLess =function (){
};

Bat.prototype.greaterEqualOrLess =function (){
};

Bat.prototype.lesserEqualOrMore =function (){
};

Bat.prototype.andOrOR =function (){
};



Bat.prototype.generateExpression =function (){
    
    var ADD =1;
    var SUB =2;
    var MX = 3;
    var DIV = 4;
    
    
    var op1 = Math.random();
    var op2 = Math.random();  
    
    var operator1 = "_";
    var operator2 = "_";
    
    if(op1<=.5){
        op1 = 1;
        operator1 = "+";
    }
    else{
        op1 =2;
        operator1 = "-";
    }
    
    if(op2<=.5){
        op2 = 1;
        operator2 = "+";
    }
    else{
        op2 =2;
        operator2 = "-";
    }

           
    var sum = Math.round(Math.random()*100);
    
    var operand1 = Math.round(sum*Math.random());
    var operand2 = 0;
    
    if(op1==1){
        operand2 = sum-operand1;
        //sum= operand1 + operand2;
    }
    else{
        operand1 = sum + operand1;
        operand2 = operand1 - sum;
    }
    
    
    var diff = Math.round(Math.random()*8) -4;  
    //12.5% of the time the difference will randomly be 0, so we change that to 1 up or down
    if(diff ==0){
        if(Math.random>.5){
            diff = 1;
        }else{
            diff = -1;
        }
    }
    
    
    //percent of times to make both sides of the expression equal
    var equalPercent = 0;
    
    //console.log(this.problemType);
    
    // the two sides of the expression will be equal roughly 50% of the time
    if(this.problemType==1){
        equalPercent = .5;
    }
    else if (this.problemType==2){
        equalPercent = .33;
    }
    
    else if (this.problemType==3){
         equalPercent = .25;   
    }
        //console.log(equalPercent);
    
    //adjusting the difference
    if(Math.random()<equalPercent){
        diff=0;
    }
    //console.log(diff);
    
    var falseSum= sum + diff;
    
    var operand3 = Math.round(falseSum*Math.random());
    
    var operand4 = 0;
    
    if(op2==1){
        operand4 = falseSum-operand3;
        //falseSum = operand4+operand3;
    }
    else{
        operand3 = falseSum + operand3;
        operand4 = operand3 - falseSum;
    }
    
    // determing the correct answer
    if(this.problemType==1){
        // the first two sides of the expression are equal
        if(diff==0){
            //right side is ==True
            if(this.ans){
                this.correctOType=0; // ==
            }
            // right side == False
            else{
               this.correctOType=1; // != 
            }
        }
        // the first two sides are not equal
        else{
            //right side is ==True
            if(this.ans){
                this.correctOType=1; // !=
            }
            // right side == False
            else{
               this.correctOType=0; // == 
            }  
        }
    }
    
    // choice are < , == , >
    else if(this.problemType==2){
        //case equal
        if(diff==0){
            //case true
            if(this.ans){
                this.correctOType=0; // ==
            }
            //case false
            else{
                //any other choice should be correct
                this.correctOType=-1;
            }
        }
        
        //case left < right
        else if(diff>0){
            //case true
            if(this.ans){
                this.correctOType=3; // < lessthan
            }
            else{
                //any other choice should be correct
                this.correctOType=-1;   
            }
        }
        //case left> right
        else if (diff<0){
            //case true
            if(this.ans){
                this.correctOType=2; // > greater than
            }
            else{
                //any other choice should be correct
                this.correctOType=-1;   
            }
        }
    }
    
    //choices: >= , <
    else if(this.problemType==3){
        //case equal
        if(diff==0){
            //case true
            if(this.ans){
                this.correctOType=4; // >=
            }
            //case false
            else{
                this.correctOType=3; // <
            }
        }
        //case left < right
        else if(diff>0){
            //case true
            if(this.ans){
                this.correctOType=3; // <
            }
            //case false
            else{
                this.correctOType=4; // >=
            }
        }
        //case left > right
        else if(diff<0){
            //case true
            if(this.ans){
                this.correctOType=4; // >=
            }
            //case false
            else{
                this.correctOType=3; // <
            }    
        }
    }
        //choices: <= , >
    else if(this.problemType==4){
        //case equal
        if(diff==0){
            //case true
            if(this.ans){
                this.correctOType=5; // <=
            }
            //case false
            else{
                this.correctOType=2; // >
            }
        }
        //case left < right
        else if(diff>0){
            //case true
            if(this.ans){
                this.correctOType=5; // <=
            }
            //case false
            else{
                this.correctOType=2; // >
            }
        }
        //case left > right
        else if(diff<0){
            //case true
            if(this.ans){
                this.correctOType=2; // >
            }
            //case false
            else{
                this.correctOType=5; // <=
            }    
        }
    } 
    
    
    var op = "";
    
    switch(this.correctOType){
        
        case -1:
            op="anyNot==";
            break;
        
        case 0:
            op ="==";
            break;
        case 1:
            op="!=";
            break;
        case 2:
            op=">";
            break;
        case 3:
            op="<";
            break;
        case 4:
            op=">=";
            break;        
        
        case 5:
            op="<=";
            break;        
        case 6:
            op="&&";
            break;        
        case 7:
            op="||";
            break;        
    }
     
    
    var msg = ""+operand1+" "+operator1+" "+operand2+" __ " + " "+operand3 + " " +operator2+" "+operand4;
    return msg;
};


Bat.prototype.boolBank =function (){
    var bank = [
    
    
    "hello",
    "yo",
    
    "True __ False",
    "True __ True",
    "False __ False",
    "False __ True",
    
    "(True __ False) && True",
    "(False __ False) && True",
    
    "(True __ False) && False",
    
    "(False __ False) || False",
    "(True __ False) || False",
    
    "(False __ False) || True",
    
    "(False__False && True && True",
    
    "(False || False) __ True || False",
    
    "(False || False) __ True || False",
    
    "(False && False) __ True && False", 
    
    "(2+2==4) __ (2+2==5) == True", 
    
    "(2+2==4) __ (2+2==5) == False",   
    ];
    
    var idx = Math.round(Math.random()*bank.length-1);
    return bank[idx];
    
}


Bat.prototype.dropFruit =function (){
    
    console.log("bat dropping fruit");
    var fruit = new Fruit (this.sprite, this.getXform().getXPos(), this.getXform().getYPos(), 0);    
    return fruit;
};