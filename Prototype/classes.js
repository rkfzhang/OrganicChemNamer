// Element class (node)
class Element {

	// initialize Element (str, str)
	constructor(name, symbol) {
		this.name = name;
		this.symbol = symbol;
		this.links = [];
	}

	link(element) {
		this.links.push(element);
	}

	print() {
		let string = this.symbol + " :";

		for (let i = 0; i < this.links.length; i++) {
			string += " " + this.links[i].symbol;
		}

		console.log(string);
	}
}

class parser {
	// utility class for parsing
	// use static methods
}

// Compound class (graph)
class Compound {

	// initialize Compound (str)
	constructor(name) {
		this.name = name;
	}

	create() {
		// parses name and creates compound as a graph where nodes are elements
		// should be a list of elements (where the elements link forms a graph)
	}

	print() {
		console.log(name);
	}

}

let a = new Element("a", "A");
let b = new Element("b", "B");
let c = new Element("c", "C");

a.link(b);
a.link(c);
c.link(b);

a.print();
b.print();
c.print();