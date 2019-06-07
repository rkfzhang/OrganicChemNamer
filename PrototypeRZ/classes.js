
//Element
class Element {
	//initialize
	constructor(name, symbol) {
		this.name = name;
		this.symbol = symbol;
	}

	//print properties
	print() {
		console.log(this.name + "|" + this.symbol);
	}
}

//Test Cases
let a = new Element("a", "A");
let b = new Element("b", "B");
let c = new Element("c", "C");
a.print(); //a|A
b.print(); //b|B
c.print(); //c|C


//Compound
class Compound {

	//initialize
	constructor(element, id) {
		this.element = element;
		this.links = [];
		this.id = id;
		this.endpoint = true;
		this.type = "";
	}

	//add new Elements
	addElement(compound) {
		this.links.push(compound);
		compound.links.push(this);
	}

	setEndpoint(b){ //Need to change
		this.endpoint = b;
	}

	setType(t) { //Need to change
		this.type = t;
	}
}

//Fix this
class OrganicCompound {

	//initialize
	constructor(compound) {
		this.links = compound;
		this.compounds = [];
	}

	addElement(compound, target) {
		this.compounds.push(compound);
	}


}
