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
	static split(element, string) {

	}
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

		const section = this.name.split("-");
		let index = section.length - 1;

		// check for triple bond
		if (section[index] === "yne") {
			var longestChain = section[index - 2];
			var tripleBond = section[index - 1] //ie [2,3]
			index -= 2;
		}
		else {
			var longestChain = section[index];
			var tripleBond = -1;
		}

		// check for double bond
		const strChainLength = longestChain.length;

		if (longestChain.substring(strChainLength - 3, strChainLength) === "ene") {
			var doubleBond = section[index - 1]; //ie [2,3]
		}
		else {
			var doubleBond = -1;
		}

		// check for carbon chain length
		const carbonSuffix = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
		const carbonSuffixLength = carbonSuffix.length;

		for (let i = 0; i < carbonSuffixLength; i++) {
		
			if (carbonSuffix[i] === longestChain.substring(0, carbonSuffix[i].length)) {
				var carbonChain = i + 1;
				break;
			}
		}

		console.log("Name:");
		console.log(this.name);
		console.log("Triple bond:");
		console.log(tripleBond);
		console.log("Double bond:");
		console.log(doubleBond);
		console.log("Carbon length:");
		console.log(carbonChain);

	}

	print() {
		console.log(this.name);
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

let compTest = new Compound("1,3-hexdiene-5-yne");
compTest.create();