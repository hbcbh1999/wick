document.addEventListener("DOMContentLoaded", function(event) { 

    // Global player vars
    var frames = [[]];
    var currentFrame = 1;
    var projectLoaded = false;
    var mousePos;

    // This variable is set by makeBundles.py.
    // Never set manually!!
    var loadBundledJSONWickProject = false;

    // Setup canvas
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');

/*****************************
    Temporary GUI events
*****************************/

    // Load from a project JSON bundled with the player.
    // This variable is set by the editor.
    // Never set manually!!
    loadJSONProject(bundledJSONProject);

/*****************************
    Mouse events
*****************************/

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function(evt) {
        if(projectLoaded) {
            mousePos = getMousePos(canvas, evt);

            // Check if we're hovered over a clickable object...
            var hoveredOverObj = false;
            for(var i = 0; i < frames[currentFrame].length; i++) {
                var obj = frames[currentFrame][i];
                if(obj.wickData.clickable && mouseInsideObj(obj)) {
                    hoveredOverObj = true;
                    obj.hoveredOver = true;
                    break;
                } else {
                    obj.hoveredOver = false;
                }
            }
            //...and change the cursor if we are
            if(hoveredOverObj) {
                document.getElementById("canvasContainer").style.cursor = "pointer";
            } else {
                document.getElementById("canvasContainer").style.cursor = "default";
            }
        }
    }, false);

    document.getElementById("canvasContainer").addEventListener("mousedown", function(event) {
        // Check if we clicked a clickable object
        for(var i = 0; i < frames[currentFrame].length; i++) {
            var obj = frames[currentFrame][i];
            if(obj.wickData.clickable && mouseInsideObj(obj)) {
                currentFrame = obj.wickData.toFrame;
                console.log("Went to frame " + currentFrame);
                break;
            }
        }
    }, false);

/*****************************
    Player Utils
*****************************/

function mouseInsideObj(obj) {

    var scaledObjLeft = obj.left;
    var scaledObjTop = obj.top;
    var scaledObjWidth = obj.width*obj.scaleX;
    var scaledObjHeight = obj.height*obj.scaleY;

    return mousePos.x >= scaledObjLeft && 
           mousePos.y >= scaledObjTop &&
           mousePos.x <= scaledObjLeft + scaledObjWidth && 
           mousePos.y <= scaledObjTop + scaledObjHeight;
}

/*****************************
    Draw loop
*****************************/

    // update canvas size on window resize
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // start draw/update loop
    var FPS = 30;
    setInterval(function() {
        if(projectLoaded) {
            update();
            draw();
        }
    }, 1000/FPS);

    function update() {
        
    }

    function draw() {
        // Clear canvas
        context.fillStyle = '#FFFFFF';
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();

        // Draw current frame content
        for(var i = 0; i < frames[currentFrame].length; i++) {
            context.save();

            var obj = frames[currentFrame][i];
            context.translate(obj.left, obj.top);
            //if(!obj.hoveredOver) {
                context.scale(obj.scaleX, obj.scaleY);
            //}
            context.drawImage(obj.image, 0, 0);

            context.restore();
        }
    }

/*****************************
    Opening projects
*****************************/

    function loadJSONProject(proj) {
        // load project JSON
        frames = JSON.parse(proj);
        projectLoaded = true;

        // make canvas images out of src
        for(var f = 0; f < frames.length; f++) {
            console.log("Loading frame "+f+"...");
            var frame = frames[f];
            for(var i = 0; i < frame.length; i++) {
                var obj = frame[i];
                obj.image = new Image();
                obj.image.src = obj.src;
                console.log("Loaded object " + obj.wickData.name);
            }
        }
    }

});