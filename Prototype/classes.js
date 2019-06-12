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

	// retrives all branches aside from main parent
	static getBranches(sections) {
		let branches = [];
		let length = sections.length;
		let tmp = parser.longestChain(sections);
		let size = tmp[0];
		let parentIndex = tmp[1];

		for (let i = 0; i < length;) {
			if (typeof sections[i] != "string" && i != parentIndex - 1) {
				branches.push([sections[i + 1], sections[i]]);
				i += 2;
			}
			else {
				i++;
			}
		}
		branches.push(["length", size]);

		if (parentIndex >= 1) {
			branches.push([sections[parentIndex], sections[parentIndex - 1]]);
		}
		else {
			branches.push([sections[parentIndex], 1]);
		}
		return branches;
	}

	// parses the parent branch (make sure parent is last element)
	static parseParent(dataArray) {
		let length = dataArray.length;
		let parent = dataArray[length - 1];

		const carbonBranch = ["methyl", "ethyl", "propyl", "butyl", "pentyl", "hexyl", "heptyl", "octyl", "nonyl", "decyl"];

		const alkylHalides = ["fluoro", "chloro", "bromo", "iodo"];

		const carbonBonds = ["ene", "yne", "en", "yn"];

		const functionalS = ["amine", "thiol", "ol", "one", "al", "nitrile", "amide", "oate", "oic acid"];

		const functionalP = ["amino", "mercapto", "hydroxy", "oxo", "formyl", "cyano", "carbamoyl", "carboxy"];

		const allGroups = [carbonBranch, alkylHalides, carbonBonds, functionalS, functionalP];
		let allGroupsLength = allGroups.length;

		let possibleBranches = [];

		for (let i = 0; i < allGroupsLength; i++) {
			parser.arrayIncludes(allGroups[i], parent[0], possibleBranches);
		}

		let possibleBranchesLength = possibleBranches.length;

		if (possibleBranchesLength > 0) {
			let firstBranch = parser.arrayFirstSubstring(possibleBranches, parent[0]);
			dataArray.push([possibleBranches[firstBranch], parent[1]]);
			parser.removeIndex(possibleBranches, firstBranch);
			let possibleBranchesLength = possibleBranches.length;

			for (let i = 0; i < possibleBranchesLength; i++) {
				dataArray.push([possibleBranches[i], [1]]);
			}
		}

		parser.removeIndex(dataArray, length - 1);

	}

	// finds the first substring index in array that appears in string
	static arrayFirstSubstring(array, string) {
		let min = -1;
		let index = -1;
		let length = array.length;

		for (let i = 0; i < length; i++) {
			let at = string.indexOf(array[i]);

			if (at != -1) {
				if (index == -1 || index > at) {
					index = at;
					min = i;
				}
			}
		}
		return min;

	}

	// checks if any array element is a substring of string (appends to output array)
	static arrayIncludes(array, string, output) {
		let length = array.length;

		for (let i = 0; i < length; i++) {

			if (string.includes(array[i])) {
				output.push(array[i]);
				string = string.replace(array[i], "");
			}
		}
	}

	// removes array element at index
	static removeIndex(array, index) {
		array.splice(index, 1);
	}

	// adjusts all elements to its proper branch name
	static polishData(dataArray) {
		let length = dataArray.length;

		for (let i = 0; i < length; i++) {

			switch (dataArray[i][0]) {
				case "ene":
				case "en":
					dataArray[i][0] = "alkene";
				case "yne":
				case "yn":
					dataArray[i][0] = "alkyne";
				case "ol":
				case "hydroxy":
					dataArray[i][0] = "alcohol";
			}
		}
	}

	// https://www.masterorganicchemistry.com/2011/02/14/table-of-functional-group-priorities-for-nomenclature/

}

// Compound class (graph)
class Compound {

	// initialize Compound (str)
	constructor(name) {
		this.name = name;
		this.rawData = [];
	}

	create() {
		// parses name and creates compound as a graph where nodes are elements
		// should be a list of elements (where the elements link forms a graph)

		const sections = parser.formatData(this.name);
		let dataArray = parser.getBranches(sections); //2D array to store all branch data
		parser.parseParent(dataArray);
		parser.polishData(dataArray);
		console.log(dataArray);

		this.rawData = dataArray;

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

let compTest1 = new Compound("5,8,4-trifluoro-2,3-diheptyl-3-methyl-1-hexene-5-yne");
compTest1.create();

let compTest2 = new Compound("2,3-dimethylhexane-5-yne");
compTest2.create();

let compTest3 = new Compound("1,1-difluoro-2-methylbut-1,3-diene");
compTest3.create();

let compTest4 = new Compound("2,3-difluorochloroethylmethylbutene");
compTest4.create();

let compTest5 = new Compound("ethane");
compTest5.create();

let compTest6 = new Compound("2,3,5-trimethyl-4-propylheptane");
compTest6.create();

let compTest7 = new Compound("3-butenoic acid");
compTest7.create();

let compTest8 = new Compound("2,2,6,6,7-pentamethyloctane");
compTest8.create();

let compTest9 = new Compound("5-oxohexanoic acid");
compTest9.create();

let compTest10 = new Compound("2-methyl-1-penten-3-yne");
compTest10.create();

let compTest11 = new Compound("3-butyn-2-ol");
compTest11.create();



// example cases to consider:
// ethane
// 1-hexene-4-yne-2-ol
// 2,3-dimethylhexane-5-yne
// 3-methyl-1-hexene-5-yne
// 1,1-difluoro-2-methylbut-1,3-diene
// 2-fluorohexane
// 5,8,4-trifluoro-2,3-diheptyl-3-methyl-1-hexene-5-yne
// 1,2,3,4,4-pentachlorobutane
// 1,2,2,3,4,4-hexachlorobutane
// 2,3-difluorochloromethylbutane

// NOTE: use string.includes(substring) to make life easier (ES6)