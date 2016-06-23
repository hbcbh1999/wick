/*****************************
	Projects
*****************************/

// Holds the root object and some project settings.

var WickProject = function () {

	// Create the root object.
	// The editor is always editing the root object or its sub-objects and 
	// cannot ever leave the root object.
	this.rootObject = new WickObject();
	this.rootObject.isSymbol = true;
	this.rootObject.isRoot = true;
	this.rootObject.currentFrame = 0;
	this.rootObject.frames = [new WickFrame()];
	this.rootObject.left = 0;
	this.rootObject.top = 0;
	
	this.resolution = {};
	this.resolution.x = 650;
	this.resolution.y = 500;

	this.backgroundColor = "#FFFFFF";

	this.framerate = 12;

	this.fitScreen = false;

};
