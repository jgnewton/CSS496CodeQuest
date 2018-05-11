

BubbleScene.prototype.initBubbles = function () {
  console.log("test");  
  
  this.bubbleW = 16;
  
  this.perRow = Math.floor((this.WCWidth-10)/this.bubbleW*.75);
  
  this.numRows =5;
  
  this.myBubbles= new GameObjectSet();
  
  var offset=0;
    
    //creating 65 bubbles
    //rows
    for(var i =0; i<this.numRows; i++){
        if( i%2 ==0){
            offset = this.bubbleW/2;
        }else{
            offset=0;
        }
        //each individual bubble
        for(var j =0; j < this.perRow; j++){
            
            //color
            var color = Math.round(Math.random()*5);
            
            var b = new Bubble(this.mMeteorSprite, j*(this.bubbleW) -this.WCWidth/2 +40+offset, this.WCHeight/2-this.bubbleW/2- i*(this.bubbleW), false, color);
            
            
            
            this.myBubbles.addToSet(b);
        }
    }
    
    
};

BubbleScene.prototype.setBubblePosition = function (b, currx, curry) {
    console.log(b);
    var x = b.mMinion.getXform().getXPos();
    var y = b.mMinion.getXform().getYPos();
    
    var side =0;
    if(currx>(x+this.bubbleW/6)){
        side=this.bubbleW/2;
    }
    else if(currx<(x-this.bubbleW/6)){
       side = -1*this.bubbleW/2; 
    }
    else{
        side =0;
    }
    
    var h = this.bubbleW;
    
    if(curry > y){
       h = 0;
       if(currx>x){
        side = this.bubbleW;
       }else{
        side = -1*this.bubbleW;   
       }
    }

    this.mFlyBubble.getXform().setXPos(x + side);
    this.mFlyBubble.getXform().setYPos(y-h);
};


BubbleScene.prototype.checkNeighbors = function () {
    for(var i =0; i< this.myBubbles.size(); i++){
        var b = this.myBubbles.getObjectAt(i);
        b.checkNeighbor(this.myBubbles);
    }
    
};

BubbleScene.prototype.onHit = function () {
   this.checkNeighbors(); 
};


BubbleScene.prototype.checkBounce = function () {
   if(this.mFlyBubble.getXform().getXPos()>this.WCCenterX+this.WCWidth/2 || this.mFlyBubble.getXform().getXPos()<this.WCCenterX-this.WCWidth/2){
    this.mFlyBubble.xv = this.mFlyBubble.xv*-1;
   }
   
   if(this.mFlyBubble.getXform().getYPos()>this.WCCenterY+this.WCHeight/2 || this.mFlyBubble.getXform().getYPos()<this.WCCenterY-this.WCHeight/2){
    this.mFlyBubble.yv = this.mFlyBubble.yv*-1;
   }
   
   
};

BubbleScene.prototype.initAnswerSet = function () {
    
    this.ans = [
        "A",
        "+",
        "2",
        ")",
        ";",
        "="
        
    ];
       
};

BubbleScene.prototype.getRandAnswer = function () {
    var r = Math.floor(Math.random()*this.ans.length);
    return this.ans.pop(r);
    
};