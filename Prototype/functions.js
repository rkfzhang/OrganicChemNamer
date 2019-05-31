height = 1000;
width = 700;

function renderCarbonChain(length) {
	let canvas = document.getElementById("canvas");
	canvas.style.height = height;
	canvas.style.width = width;

	let x = 0;
	let y = 100;
	let size = width / length;

	for (let i = 0; i < length; i++) {
		canvas.innerHTML += `<line x1="${x}" y1="${y}" x2="${x + size}" y2="${y += (i % 2 == 0 ? size : -size)}" style="stroke:rgb(0,0,0); stroke-width:2" />`;
		x += size;
	}
}

$(document).ready(function() {
	renderCarbonChain(20);
})