

BubbleScene.prototype.initBubbles = function () {
  console.log("test");  
  
  this.bubbleW = 16;
  
  this.perRow = Math.floor((this.WCWidth-10)/this.bubbleW*.75);
  
  this.numRows =5;
  
  this.myBubbles= new GameObjectSet();
  
  var offset=0;

    for(var i =0; i<this.numRows; i++){
        if( i%2 ==0){
            offset = this.bubbleW/2;
        }else{
            offset=0;
        }
        for(var j =0; j < this.perRow; j++){
            
            var color = Math.round(Math.random()*5);
            
            var b = new Bubble(this.mMeteorSprite, j*(this.bubbleW-1) -this.WCWidth/2 +40+offset, this.WCHeight/2-this.bubbleW/2- i*(this.bubbleW-1), false, color);
            this.myBubbles.addToSet(b);
        }
    }
    
    
};

BubbleScene.prototype.setBubblePosition = function (b, currx, curry) {
    console.log(b);
    var x = b.mMinion.getXform().getXPos();
    var y = b.mMinion.getXform().getYPos();
    
    var side =0;
    if(currx>(x+this.bubbleW/3)){
        side=this.bubbleW/2;
    }
    else if(currx<(x-this.bubbleW/3)){
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

    this.mFlyBubble.getXform().setXPos(x + side+1);
    this.mFlyBubble.getXform().setYPos(y-h+1);
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