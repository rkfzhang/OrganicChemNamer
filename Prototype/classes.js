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

		//NOTE: Does not work if name is in shorten form (not including -1-) FIX LATER

		// initial values
		let dataArray = []; //2D array to store all branch data

		const section = this.name.split("-");
		let index = section.length - 1; // for tracking current position of section

		const carbonSuffix = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
		const carbonSuffixLength = carbonSuffix.length;

		const alkylHalides = ["fluoro", "chloro", "bromo", "iodo"];
		const alkylHalidesLength = alkylHalides.length;

		// check for triple bond
		if (section[index] === "yne") {
			var longestChain = section[index - 2];
			dataArray.push(["tripleBond", section[index - 1]]);
			index -= 2;
		}
		else {
			var longestChain = section[index];
		}

		// check for double bond
		const strChainLength = longestChain.length;

		if (longestChain.substring(strChainLength - 3, strChainLength) === "ene") {
			dataArray.push(["doubleBond", section[index - 1]]);
		}

		// check for carbon chain length
		let carbonChain = -1;

		for (let z = index; z >= 0; z--) {

			for (let i = carbonSuffixLength - 1; i >= 0; i--) {
			
				if (section[z].includes(carbonSuffix[i])) {

					carbonChain = i + 1;
					longestChain = section[z];
					index = z;
					break;
				}
			}
			if (carbonChain != -1) {
				break;
			}
		}

		dataArray.push(["carbonChain", carbonChain]);

		// check for carbon branch
		let carbonBranch = -1;

		for (let i = carbonChain - 2; i >= 0; i--) {
		
			if (longestChain.includes(carbonSuffix[i])) {

				if (carbonBranch == -1) {
					carbonBranch = i;
				}
				else if (carbonSuffix[i].length > carbonSuffix[carbonBranch].length) {
					carbonBranch = i;
				}
			}
		}

		if (carbonBranch != -1) {
			dataArray.push([carbonSuffix[carbonBranch] + "yl", section[index - 1]]);;
		}

		

		
		// check for alkyl halides
		for (let i = alkylHalidesLength - 1; i >= 0; i--) {
		
			if (longestChain.includes(alkylHalides[i])) {
				dataArray.push([alkylHalides[i], section[index - 1]]);
			}
		}

		// for debugging
		console.log(longestChain);
		this.print();
		console.log(dataArray);

	}

	print() {
		console.log(this.name);
	}

}

let a = new Element("a", "A");
let b = new Element("b", "B");
let c = new Element("c", "C");

/*
a.link(b);
a.link(c);
c.link(b);

a.print();
b.print();
c.print();
*/

let compTest = new Compound("3-methyl-1-hexene-5-yne");
compTest.create();

// example cases to consider:
// 1-hexene-4-yne-2-ol
// 2,3-dimethylhexane-5-yne
// 3-methyl-1-hexene-5-yne
// 1,1-difluoro-2-methyl-but-1,3-diene
// 2-fluorohexane

// NOTE: use string.includes(substring) to make life easier (ES6)