//CONSTANTS
//Find Buttons
var singleButton = $(".single")[0];
var doubleButton = $(".double")[0];
var tripleButton = $(".triple")[0];
var deleteButton = $(".delete")[0];
//Make Arrays (may change or remove later)
var linkType = [false,false,false,false]; //buttons
var linkTypeButtons = [singleButton,doubleButton,tripleButton,deleteButton]; //buttons
var elements = []; //all elements on screen stored here
var create = []; //stores locations to create element [element attached to, new element]
				 //this doesnt do anything but will later for links
var elementMain = null; //element being worked on
//For svg canvas
var svgNS = "http://www.w3.org/2000/svg";
var svg = $("svg")[0];
var pt = svg.createSVGPoint();




/////////////
//FUNCTIONS//
/////////////

//reset linkTypes and buttons
function resetButton() {
	for (i = 0; i < 4; i++) {
		linkType[i] = false;
		linkTypeButtons[i].style.borderStyle = 'outset';
	}		
}

//select button
function linkButton(i) {
	if (linkType[i]){
		linkType[i] = false;
		linkTypeButtons[i].style.borderStyle = 'outset';
	} else {
		resetButton();
		linkType[i] = true;
		linkTypeButtons[i].style.borderStyle = 'inset';
	}
}

//DELETE ELEMENT
function deleteElement() {
	for (i=0; i<elements.length; i++){
		if (elementMain == elements[i]) {
			elements.splice(i); //remove from list
			elementMain.remove(); //remove from canvas
			elementMain = null; //reset
			break;
		}
	}
}

//ADD NEW ELEMENT
function addElement() {
	let newElement = document.createElementNS(svgNS, 'circle'); //create
    newElement.setAttributeNS(null,"cx",create[1].x); //set attributes
    newElement.setAttributeNS(null,"cy",create[1].y);
    newElement.setAttributeNS(null,"r",5);
    newElement.setAttributeNS(null,"fill","purple");
    newElement.setAttributeNS(null,"stroke","green");
    newElement.setAttributeNS(null,"stroke-width",2);
	elements.push(newElement); //add to array
	svg.appendChild(newElement); //add to canvas
	newElement.onclick = function() { //set onclick
		elementMain = this;
		startChain();
	};
}

//start/delete chain
function startChain() {
	if (linkType[3]){	//delete button pressed
		deleteElement();
	}
	else if (linkType[0] || linkType[1] || linkType[2]){ //other buttons
		elementMain.setAttribute('fill', "pink");
		svg.addEventListener('click',mouseClick); //start on mouse click
	}
}

//mouse click actions
function mouseClick(evt) {
	var loc = cursorPoint(evt);
	create.push(loc);

	//TESTING
	/*
	let mes = loc.x + " " + loc.y;
	alert(mes);
	*/
	//

	if (create.length == 2){ //after two locations stored (origin, new)
		createLink();
		elementMain.setAttribute('fill', "purple");
		//reset temp factors
		elementMain = null;
		svg.removeEventListener('click',mouseClick); //remove on click
		create = [];
	}

}

//gets cursor point
function cursorPoint(evt){
	pt.x = evt.clientX; pt.y = evt.clientY;
	return pt.matrixTransform(svg.getScreenCTM().inverse());
}

//DO THIS LATER
function deleteLink(){

}

//DO THIS LATER
function createLink() {
	addElement();
	//addLink();
}


























//First Commands
let firstElement = $("circle")[0]; //first elements
elements.push(firstElement);

firstElement.onclick = function() { //set onclick for first elements
	elementMain = this;
	startChain();
};


//SET ONCLICKS
singleButton.onclick = function() {linkButton(0)};
doubleButton.onclick = function() {linkButton(1)};
tripleButton.onclick = function() {linkButton(2)};
deleteButton.onclick = function() {linkButton(3)};

//TESTING
var testButton = $(".test")[0];
testButton.onclick = function() {
	alert(linkType);
}

//BUGS
//Delete button doesnt always work
