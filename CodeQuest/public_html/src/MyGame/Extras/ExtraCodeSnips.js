/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


                // displaying Boundary rays
                /*
                if(astx<=0){
                    var rend = new Renderable();
                    rend.setColor([1,0,0,1]);
                    
                    var toprx = astx + axf.getWidth()/2;
                    var topry = asty + axf.getHeight()/2;
                    
                    
                    rend.getXform().setPosition(toprx/2, topry/2 -30);
                    rend.getXform().setSize(1,Math.sqrt(toprx*toprx+(topry+60)*(topry+60)));
                    rend.getXform().setRotationInRad(thetaMin);
                    
                    this.mAllObjs.addToSet(rend);
                    var rend2 = new Renderable();
                    rend2.setColor([1,0,0,1]);  
                    var blx = astx - axf.getWidth()/2;
                    var bly = asty - axf.getHeight()/2;
                    rend2.getXform().setPosition(blx/2, bly/2 -30);
                    rend2.getXform().setSize(1,Math.sqrt(blx*blx+(bly+60)*(bly+60)));
                    rend2.getXform().setRotationInRad(thetaMax);
                    
                    this.mAllObjs.addToSet(rend2);
                }
                else{
                    var rend = new Renderable();
                    rend.setColor([1,0,0,1]);
                    
                    var tlx = astx - axf.getWidth()/2;
                    var tly = asty + axf.getHeight()/2;
                    
                    rend.getXform().setPosition(tlx/2, tly/2 -30);
                    rend.getXform().setSize(1,Math.sqrt(tlx*tlx+(tly+60)*(tly+60)));
                    rend.getXform().setRotationInRad(thetaMin);
                    
                    this.mAllObjs.addToSet(rend);
                    
                    var rend2 = new Renderable();
                    rend2.setColor([1,0,0,1]);
                    
                    var brx = astx + axf.getWidth()/2;
                    var bry = asty - axf.getHeight()/2;
                                        
                    rend2.getXform().setPosition(brx/2, bry/2 -30);
                    rend2.getXform().setSize(1,Math.sqrt(brx*brx+(bry+60)*(bry+60)));
                    rend2.getXform().setRotationInRad(thetaMax);
                    
                    this.mAllObjs.addToSet(rend2);  
                }
                */
               
               
   
/*
               
BasketScene.prototype.updateBasketText = function( ) {
    
    //this.leftOperand="5";
    //this.rightOperand="3";
    
    var op = "";
    
    switch(this.Operator){
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
    
    */
   
   
   /*
    * 
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
    */
   
   //special controls for jumping and etc.
//NOT USED
//BasketScene.prototype.heroControls = function( ) {
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up) && this.mHero.mRigidBody.mInvMass==0){
//        this.mHero.mRigidBody.setVelocity(0,30);
//        this.mHero.mRigidBody.mInvMass=100;
//        console.log("jump!");
//    }
//    
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)){
//        this.mHero.mRigidBody.setVelocity(0,-30);
//        //this.mHero.mRigidBody.mInvMass=100;
//        console.log("jump!");
//    }
//    
//    
//    if(this.mHero.getXform().getYPos()<= this.WCCenterY -this.WCHeight/2 + this.groundHeight){
//        console.log(this.groundHeight + "," + this.mHero.getXform().getYPos());
//        this.mHero.mRigidBody.mInvMass=0;
//        this.mHero.getXform().setYPos(this.WCCenterY -this.WCHeight/2 + this.groundHeight+1);
//    }
//};

/*
BasketScene.prototype.checkFruitCollision = function( ) {
      for (var i = 0; i < this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        if(obj instanceof Fruit){
            
            if(obj.checkCollision(this.mHero)){
                obj.terminate=true;
                this.Operator=obj.operatorType;

                this.mHero.attachObj(obj);
            }
        }  
    }
}
*/

//BasketScene.prototype.generateFruit = function( num, pt0, ptmax) { 
//    
//    for(var i =0; i<num;i++){
//        var x = this.WCCenterX-this.WCWidth/2 + (i*this.WCWidth/num)+ (1/num)*Math.random()*(this.WCWidth - 10);
//        var y = this.groundLevel;
//        
//        var type = Math.round(Math.random()*(ptmax-pt0)) + pt0;
//        
//        var fruit = new Fruit(this.kArrow, x, y, type);
//        this.mAllObjs.addToSet(fruit);
//    }
//};


 /*   var textSize = 7;
    var textYpos = -this.WCHeight / 2 + this.groundHeight / 2 +15;
    var textXPos = 120;
    var textOffset = 10;
    
    
    this.eqText = new MenuElement("==", textXPos, textYpos + textOffset * 4, textSize);
    this.neqText = new MenuElement("!=", textXPos, textYpos + textOffset * 3, textSize);
    this.moreText = new MenuElement(">", textXPos, textYpos + textOffset * 2, textSize);
    this.lessText = new MenuElement("<", textXPos, textYpos + textOffset, textSize);
    this.eqmoreText = new MenuElement(">=", textXPos, textYpos, textSize);
    this.eqlessText = new MenuElement("<=", textXPos, textYpos - textOffset, textSize);
    this.AndText = new MenuElement("&&", textXPos, textYpos - textOffset*2, textSize);
    //this.OrText = new MenuElement("||", textXPos, textYpos - textOffset*3, textSize);
    
    //this.stage3Pegs = new MenuElement("Stage 3 Cat-chinko", 30, 35, 3);
    
    this.elements = [
        this.eqText,
        this.neqText,
        this.moreText,
        this.lessText,
        this.eqmoreText,
        this.eqlessText,
        this.AndText,
       // this.OrText
    ];
    
    this.selectedElement = this.elements[0];
    this.selectionArrow = new TextureRenderable(this.kArrow);
    this.selectionArrow.getXform().setSize(3, 3);*/