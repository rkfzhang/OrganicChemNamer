//CONSTANTS
var linkType = [false,false,false,false];
var singleButton = $(".single")[0];
var doubleButton = $(".double")[0];
var tripleButton = $(".triple")[0];
var deleteButton = $(".delete")[0];
var linkTypeButtons = [singleButton,doubleButton,tripleButton,deleteButton];
var elements = [];
var create = [];
var elementMain = null;
var svgNS = "http://www.w3.org/2000/svg";




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

function deleteElement() {
	for (i=0; i<elements.length; i++){
		if (elementMain == elements[i]) {
			elements.splice(i);
			elementMain.remove();
			elementMain = null;
			break;
		}
	}
}
function createLink() {
	addElement();
	//addLink();
}

function addElement() {
	let newElement = document.createElementNS(svgNS, 'circle');
    newElement.setAttributeNS(null,"cx",create[1].x);
    newElement.setAttributeNS(null,"cy",create[1].y);
    newElement.setAttributeNS(null,"r",5);
    newElement.setAttributeNS(null,"fill","purple");
    newElement.setAttributeNS(null,"stroke","green");
    newElement.setAttributeNS(null,"stroke-width",2);
	elements.push(newElement);
	svg.appendChild(newElement);
	newElement.onclick = function() {
		elementMain = this;
		startChain();
	};
}

function startChain() {
	if (linkType[3]){
		deleteElement();
	}
	else if (linkType[0] || linkType[1] || linkType[2]){
		elementMain.setAttribute('fill', "pink");
		svg.addEventListener('click',mouseClick);
	}
}



function mouseClick(evt) {
	var loc = cursorPoint(evt);
	let mes = loc.x + " " + loc.y;
	create.push(loc);
	alert(mes);
	if (create.length == 2){
		createLink();
		elementMain.setAttribute('fill', "purple");
		elementMain = null;
		svg.removeEventListener('click',mouseClick);
		create = [];
	}

}






var svg = $("svg")[0];
var pt = svg.createSVGPoint();

function cursorPoint(evt){
	pt.x = evt.clientX; pt.y = evt.clientY;
	return pt.matrixTransform(svg.getScreenCTM().inverse());
}

/*svg.addEventListener('click',function(evt){
	if (create) {
		var loc = cursorPoint(evt);
		let mes = loc.x + " " + loc.y;
		alert(mes);
		create = false;
		// Use loc.x and loc.y here
	}
});*/









//First Commands
let firstElement = $("circle")[0];
elements.push(firstElement);

firstElement.onclick = function() {
	elementMain = this;
	startChain();
	/*alert("hi");
	this.style.fill = "pink";
	elementMain = firstElement;*/
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