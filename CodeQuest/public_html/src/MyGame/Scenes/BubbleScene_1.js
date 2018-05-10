

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
            var b = new Bubble(this.mMeteorSprite, j*this.bubbleW -this.WCWidth/2 +40+offset, this.WCHeight/2-this.bubbleW/2- i*this.bubbleW, false, 0);
            this.myBubbles.addToSet(b);
        }
    }
    
    
};