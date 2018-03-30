/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype.updateCamera = function () {
    
    
    var ZOOM = .1;
    
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.One)) {
        this.mCamera.zoomBy(1-ZOOM);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Two)) {
        this.mCamera.zoomBy(1+ZOOM);
    }
    this.mCamera.update();
};