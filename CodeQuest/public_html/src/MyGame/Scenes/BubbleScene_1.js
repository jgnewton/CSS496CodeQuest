

BubbleScene.prototype.initBubbles = function () {
  console.log("test");  
  
  this.bubbleW = 16;
  
  this.perRow = Math.floor((this.WCWidth-10)/this.bubbleW*.75);
  
  this.numRows =4;
  
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
            
            var b = new Bubble(this.mCloudSprite, j*(this.bubbleW) -this.WCWidth/2 +40+offset, this.WCHeight/2-this.bubbleW/2- i*(this.bubbleW), false, color);
 
            this.myBubbles.addToSet(b);
        }
    }
    
    // adding answers to a number of the bubbles
    this.assignAnswers();
    
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

BubbleScene.prototype.initAnswerStrings = function () {
   this.deletes= ["1","1","delete"];
   this.q1s= ["2","1","__", " C = 3;"];
   this.q2s= ["3","2","Int ", "__", " = 3;"];
   this.q3s= ["3","2","Int B = A", "__", "2;"];
   this.q4s= ["2","2","System.print(A", "__;"];
   this.q5s= ["2","2", "A = A / 5", "__"];
   this.q6s= ["3","2", "B ", "__",  " A;"];
   
   this.questions = [this.deletes, this.q1s,this.q2s,this.q3s,this.q4s,this.q5s,this.q6s];

};


BubbleScene.prototype.assignAnswers = function () {
    
    // indices of bubble set that are Value Bubbles (contain an answer)
    var used = [];
    
    //number of different answers
    var numAnswers = 12;
    
    //add to array the index in bubble set to be used as a Value.
    for(var i =1; i <=numAnswers; i++){
       var idx = Math.round(1/numAnswers * this.myBubbles.size()*Math.random())+Math.round((i-1)/numAnswers * (this.myBubbles.size()-i))+i;
       
        if(idx>this.myBubbles.size()-1){
            idx = this.myBubbles.size()-1;
        }
       
       if(used[i-2]==idx){
           idx+=1;
       } 
       used.push(idx);
       console.log(idx);
    }
    //used = this.shuffle(used);
    var counter = 0;
     
    this.answers = ["int","for","A","C","+","&&",")","(",";",".","=","=="];
    var answerKey = [1,-1,2,-1,3,-1,4,-1,5,-1,6,-1];
    
    var twoArrays = this.biShuffle(this.answers, answerKey);
    
    this.answers = twoArrays[0];
    answerKey = twoArrays[1];
    
    this.correctAnswers=[0,1,2,3,4,5,6];
            
    for(var i =0; i< this.myBubbles.size(); i++){
        var b = this.myBubbles.getObjectAt(i);
        
        if(i == used[counter]){
            b.assignValue(this.answers[counter]);
            b.answerKey=answerKey[counter];
            counter++;
            if(counter>numAnswers){
                break;
            }
            
        }
        
    }
    
};

BubbleScene.prototype.setElements = function () {
    
        
    var textSize = 7.5;
    var textYpos = -this.WCHeight / 2 + this.groundHeight / 8;
    var textXPos = 70;
    var textOffset = 15;
    
    
    var qs ="";
    var qStrings=[];
    
    for(var i =0; i <this.questions.length;i++){
        var num = parseInt(this.questions[i][0]);
        var space = parseInt(this.questions[i][1]);
        
        for(var j =0; j<num; j++){
            qs+=this.questions[i][j+2];
        }
        qStrings[i] =qs;
        qs="";
    }
    
    this.delete=new MenuElement(qStrings[0], textXPos, textYpos + textOffset * 6, textSize);
    this.q1 = new MenuElement(qStrings[1], textXPos, textYpos + textOffset * 5, textSize);
    this.q2 = new MenuElement(qStrings[2], textXPos, textYpos + textOffset * 4, textSize);
    this.q3 = new MenuElement(qStrings[3], textXPos, textYpos + textOffset * 3, textSize);
    this.q4 = new MenuElement(qStrings[4], textXPos, textYpos + textOffset * 2, textSize);
    this.q5 = new MenuElement(qStrings[5], textXPos, textYpos + textOffset, textSize);
    this.q6 = new MenuElement(qStrings[6], textXPos, textYpos, textSize);
    //this.stage3Pegs = new MenuElement("Stage 3 Cat-chinko", 30, 35, 3);
    
    this.elements = [
        this.delete,
        this.q1,
        this.q2,
        this.q3,
        this.q4,
        this.q5,
        this.q6
    ];
    
};

BubbleScene.prototype.biShuffle = function (array1, array2) {
    console.log(array1);
    var ret=[];
    
    var na1 = [];
    var na2= [];
    var rn = 0;
    
    while(array1.length>0){        
       
        rn = Math.floor(Math.random()*array1.length);        
        //console.log(rn);
        
        var i1 = ""+array1.splice(rn,1);
        var i2 = ""+array2.splice(rn,1);
        
        na1.push(i1);    
        na2.push(i2);
    }
    console.log("output:"+na1);
    ret = [na1, na2];
    return ret;
 
};

