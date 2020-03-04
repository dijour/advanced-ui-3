/* updated for homework 3 with constraints 
*/

/* 
Each of these classes needs to be put into its own class in your code. 
There are all collected together here just for brevity. You should modify
the body of all the methods to do the right things.
*/

function getNumberVal (valOrConstraint) {
    if (typeof (valOrConstraint) == "number")
       return valOrConstraint;
    else { // assume is a constraint
        // probably should add some error checking
       return valOrConstraint.valueGet();
    }
}
function noteValChanges(listOfUsers, newVal) {
    //do something to tell each of the constraints in listOfUsers, that the value they depend on is now outofdate
    // in the real implementation, there probably needs to be a lot more parameters and state
}



class GraphicalObject {

    /* creates an empty object at a location */
    constructor(x = 0, y = 0) { 
        this.ix = x;
        this.iy = y;
        this.group = null;
        // now keep track of which constraints use my values. This might alternatively go in an object for the 
        // attribute itself.
        this.usesMy_x = [];  // list of constraint objects which use my x value - somehow the constraints need to set these
        this.usesMy_y = [];  // list of constraint objects which use my y value - somehow the constraints need to set these
    } 
    get x() {
        return getNumberVal (this.ix);
    }
    get y() {
        return getNumberVal (this.iy);
    }
    set x(newVal) {
        if (typeof this.ix == "number") {
            this.ix=newVal;
            //if newVal is a constraint, then maybe need to get its new value?
        }
        else { // x contains a constraint
            // may need to remove the constraint instead, if formula constraint system
            this.ix.valueSet(newVal);
        }
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        noteValChanges(this.usesMy_x, newVal); // this probably doesn't work if newVal is a constraint **fix**
    }
    set y(newVal) {
        if (typeof this.iy == "number") {
            this.iy=newVal;
              //if newVal is a constraint, then maybe need to get its new value?
            }
        else { // y contains a constraint
            // may need to remove the constraint instead, if formula constraint system
            this.iy.valueSet(newVal);
        }
        // might be useful to keep track of whether x actually changes, and only call noteValChanges when it actually changes
        // since have a new value for x, let any constraints that use x know
        noteValChanges(this.usesMy_y, newVal); // this probably doesn't work if newVal is a constraint **fix**
   }
    
    /* ctx is a canvas returned from getContext */
    draw(ctx) {}

    /* returns the bounding box as a dictionary with these fields:
     {x: , y: , width:, height: } 
     */
    getBoundingBox() {} 

   /* moves the object to the specified coordinates */
    moveTo(x, y) {} 

    /* sets the group of the object */
    setGroup(group) { 
        this.group = group; // a real implementation may need to do more than just this
    }

    /* returns a boolean of whether this graphicalObject contains that point or not */
    contains(x, y) {
        return false;
    } 
}

/* class to create a rectangle outline
    x, y is the top, left of the rectangle
    x, y, width, height, lineThickness are all numbers
    color = color of the outline
    the rectangle should grow inwards if lineThickness changes, so the width and height don't change
    */
class OutlineRect extends GraphicalObject {
    constructor(x = 0, y = 0, width = 20, height = 20, color = "black", lineThickness = 1) {
        super(x,y);
        // need to make all the other variables work like GraphicalObject's x and y
        this.iwidth = width; this.iheight = height; this.icolor = color; this.ilineThickness = lineThickness;
    }
}


/* class to create a filled rectangle
    x, y is the top, left of the rectangle
    x, y, width, height are all numbers
    color = color of the fill
*/
class FilledRect extends GraphicalObject {
    constructor(x = 0, y = 0, width = 20, height = 20, color = "black") {
        super(x,y);
        this.iwidth = width; this.iheight = height; this.icolor = color;
    }
}

/* class to create a straight line object
    color = color of the line, 
    x1, y1, x2, y2, lineThickness are all numbers
    do not access x,y,width, height of a line since need to be calculated, use getBoundingBox instead.
*/
class Line extends GraphicalObject {
    constructor(x1 = 0, y1 = 0, x2 = 20, y2 = 20, color = "black", lineThickness = 1) {
        super(0,0); //have to calculate the correct x,y for the call to super
        this.ix1 = x1; this.iy1 = y1; this.ix2 = x2; this.iy2 = y2; this.icolor = color; this.ilineThickness = lineThickness;
    }
}

/* class to create an image
    imageFile is a string of the name of the file, can be local file or URL
    x, y are position of the image
    if the height and width are undefined, then they are gotten from the image's width and height
*/
class Icon extends GraphicalObject {
    constructor(imageFile = undefined, x = 0, y = 0, width=undefined, height=undefined) {
        super(x,y);
        this.iwidth = width; this.iheight = height; this.iimageFile = imageFile;
    }
}

/*  class to create text or strings on the screen
    text is a string to be displayed
    x, y are the coordinates of the baseline of the string
    font is string that defines an appropriate font
    color = color of the text
    do not access width, height of a Text since needs to be calculated, use getBoundingBox instead.
    ctx is the context of the Canvas object. This is needed to calculate the size. It is needed in constructor
       since it must work to ask for the size before the object is drawn.
*/
class Text extends GraphicalObject {
    constructor(text = "test", x = 0, y = 0, font = "", color = "black", ctx) {
        super(x,y);
        this.itext = text; this.ifont = font; this.icolor = color; this.ictx = ctx;
    }
}

/* main group superclass */
class Group extends GraphicalObject {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x,y);
        this.iwidth = width; 
        this.iheight = height;
        this.children = []; //can't have a constraint on the children
    }
    
    /* 
      adds the child to the group. 
      child must be a GraphicalObject.
      Returns false and does nothing if child is in a different group, returns true if successful
    */
    addChild(child) { return false; } 

    /* 
      removes the child from the group. 
      child must be a GraphicalObject.
      Returns false and does nothing if child was not in the group.
      returns true if successfully removed.
    */
    removeChild(child) { return false; }

    /* brings the child to the front. Returns false if child was not in the group, otherwise returns true
    */
    bringChildToFront(child) { return false; }
    
    /* calculates the width and height to just fit all the children, and sets the group to that size.
        returns new [width, height] as an array.
    */
    resizeToChildren() {}

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    parentToChild(x, y) {}

    /* converts the parameter x,y coordinates and returns a point [x, y] array
    */
    childToParent(x, y) {}
}

/* implements the standard Group interface, as defined above.
*/
class SimpleGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super(x,y,width,height);
    }
}

/* LayoutGroup sets the x,y of each child so they are layed out in a row or column,
depending on the layout parameter. 
There is offset distance between each child object, which can be negative.
*/
const HORIZONTAL = 0;
const VERTICAL = 1;

class LayoutGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100, layout = HORIZONTAL, offset = 10) {
        super(x,y,width,height);
        this.ilayout = layout; //should support constraint on the layout
    }
}

/* ScaledGroup does not change the parameters of its children, but they are all displayed
smaller or bigger depending on the scaleX and scaleY parameters. 
If >1 then bigger, if <1.0 then smaller.
*/
class ScaledGroup extends Group {
    constructor(x = 0, y = 0, width = 100, height = 100, scaleX = 2.0, scaleY = 2.0) {
        super(x,y,width,height);
        this.iscaleX = scaleX; this.iscaleY = scaleY; // these can be constrained too
    }
}