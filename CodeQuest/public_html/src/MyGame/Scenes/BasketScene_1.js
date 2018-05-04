/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * File: BasketScene.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

const EUQAL_OR_UNEQUAL=0;
const LESS_EQUAL_GREATER=1;
const GREATER_AND_EQUAL_OR_LESS=2;
const LESS_AND_EQUAL_OR_GREATER=3;
const LOGICALS=4;


BasketScene.prototype.limitSelection = function () {
    
    // Problem Types
    //0 !=    ==
    //1 <   ==   >
    //2 >=   <
    //3 <=   >
    //4 ||   &&
    
    /*
     *  const EQUAL = 0;
        const NOT_EQUAL = 1;
        const GREATER = 2;
        const LESSER = 3;
        const GREATER_OR_EQUAL = 4;
        const LESSER_OR_EQUAL = 5;
        const LOGICAL_AND = 6;
        const LOGICAL_OR = 7;
     */
  
    this.allowed= [false, false, false, false, false, false, false];
        
    switch (this.problemType){
        case 0:
            this.allowed[0]=true;
            this.allowed[1]=true;
            break;
        case 1:
            this.allowed[0]=true;
            this.allowed[2]=true;
            this.allowed[3]=true;
            break;
        case 2:
            this.allowed[4]=true;
            this.allowed[3]=true;
            break;
        case 3:
            this.allowed[5]=true;
            this.allowed[2]=true;            
            break;
        case 4:
            this.allowed[6]=true;
            this.allowed[7]=true;               
            break;
    }

};