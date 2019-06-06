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

// utility class for parsing
class parser {

	// finds the longest (parent) carbon chain
	static longestChain(sections) {
		const carbonSuffix = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
		const carbonSuffixLength = carbonSuffix.length;

		let longest = 0;
		let index = 0;

		for (let i = sections.length - 1; i >= 0; i--) {
			for (let j = carbonSuffixLength - 1; j >= longest; j--) {

				if (sections[i].includes(carbonSuffix[j]) && !sections[i].includes(carbonSuffix[j] + "yl")) {
					longest = j;
					index = i;
					break;
				}
			}
		}
		return [[longest + 1], index]; // [length, index]
	}

	// removes prefix that indicates the number of occurences of branch
	// NOTE: Does not work if you use mono for prefix
	static formatData(name) {
		const prefix = ["mono", "di", "tri", "tetra", "penta", "hexa"];

		let sections = name.split("-");
		let length = sections.length;

		for (let i = 0; i < length - 1; i++) {
			if (sections[i].includes(",") || sections[i].length === 1) {
				sections[i] = parser.intSplit(sections[i]);
				sections[i + 1] = sections[i + 1].replace(prefix[sections[i].length - 1], "");
			}
		}
		console.log(sections);
		return sections;
	}

	// splits string with integers seperated by commas into array of ints
	static intSplit(string) {
		let array = string.split(",");
		return array.map(x => parseInt(x));
	}

	// appends branch to dataArray in proper format
	static dataArrayPush(dataArray, name, location) {
		dataArray.push([name, location]);
	}

	// test if the last characters of string matches subString
	static includesEnd(string, subString) {
		let subStringLength = subString.length;
		let stringLength = string.length;

		if (subStringLength > stringLength || typeof string != "string") {
			return false;
		}

		if (string.substring(stringLength - subStringLength, stringLength) === subString) {
			return true;
		}

		return false;
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

		// NOTE: Does not work if name is in shorten form (not including -1-) FIX LATER
		// NOTE: Shits pretty messy right now, will organize later...

		// Will need to modulize later...

		// initial values
		let dataArray = []; //2D array to store all branch data

		const sections = parser.formatData(this.name);
		//console.log(parser.longestChain(sections));
		let index = sections.length - 1; // for tracking current position of sections

		const carbonSuffix = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
		const carbonSuffixLength = carbonSuffix.length;

		const alkylHalides = ["fluoro", "chloro", "bromo", "iodo"];
		const alkylHalidesLength = alkylHalides.length;

		// check for triple bond
		if (sections[index] === "yne") {
			var longestChain = sections[index - 2];
			parser.dataArrayPush(dataArray, "tripleBond", sections[index - 1]);
			index -= 2;
		}
		else {
			var longestChain = sections[index];
		}

		// check for double bond
		const strChainLength = longestChain.length;

		if (longestChain.substring(strChainLength - 3, strChainLength) === "ene") {
			parser.dataArrayPush(dataArray, "doubleBond", sections[index - 1]);
		}

		// check for carbon chain length
		let tmp = parser.longestChain(sections);
		let carbonChain = tmp[0];
		index = tmp[1];

		parser.dataArrayPush(dataArray, "carbonChain", carbonChain);

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
			parser.dataArrayPush(dataArray, carbonSuffix[carbonBranch] + "yl", sections[index - 1]);
		}

		for (let z = index; z >= 0; z--) {

			for (let i = 0; i < carbonSuffixLength; i++) {

				if (parser.includesEnd(sections[z], carbonSuffix[i] + "yl")) {
					parser.dataArrayPush(dataArray, carbonSuffix[i] + "yl", sections[z - 1]);
					break;
				}
			}
		}
		
		// check for alkyl halides
		for (let i = alkylHalidesLength - 1; i >= 0; i--) {
		
			if (longestChain.includes(alkylHalides[i])) {
				parser.dataArrayPush(dataArray, alkylHalides[i], sections[index - 1]);
			}
		}

		for (let z = index; z >= 0; z--) {

			for (let i = 0; i < alkylHalidesLength; i++) {

				if (parser.includesEnd(sections[z], alkylHalides[i])) {
					parser.dataArrayPush(dataArray, alkylHalides[i], sections[z - 1]);
					break;
				}
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

let compTest = new Compound("2,3-dimethylhexane-5-yne");
compTest.create();


// example cases to consider:
// 1-hexene-4-yne-2-ol
// 2,3-dimethylhexane-5-yne
// 3-methyl-1-hexene-5-yne
// 1,1-difluoro-2-methyl-but-1,3-diene
// 2-fluorohexane
// 5,8,4-trifluoro-2,3-diheptyl-3-methyl-1-hexene-5-yne
// 1,2,3,4,4-pentachlorobutane
// 1,2,2,3,4,4-hexachlorobutane

// NOTE: use string.includes(substring) to make life easier (ES6)