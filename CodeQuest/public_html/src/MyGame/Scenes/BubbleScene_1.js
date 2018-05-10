

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
            
            var b = new Bubble(this.mMeteorSprite, j*this.bubbleW -this.WCWidth/2 +40+offset, this.WCHeight/2-this.bubbleW/2- i*this.bubbleW, false, color);
            this.myBubbles.addToSet(b);
        }
    }
    
    
};

BubbleScene.prototype.setBubblePosition = function (b, currx, curry) {
    console.log(b);
    var x = b.mMinion.getXform().getXPos();
    var y = b.mMinion.getXform().getYPos();
    
    var side =0;
    if(currx>x+this.bubbleW/2){
        side=1;
    }else{
        side = -1;
    }
    
    var h = 1;
    if(curry > y){
       h = 0;
       side*=2;
    }

    this.mFlyBubble.getXform().setXPos(x + side*this.bubbleW/2);
    this.mFlyBubble.getXform().setYPos(y-h*this.bubbleW);
};


BubbleScene.prototype.checkNeighbors = function () {
    for(var i =0; i< this.myBubbles.size(); i++){
        var b = this.myBubbles.getObjectAt(i);
        b.checkNeighbor(this.myBubbles);
    }
    
};