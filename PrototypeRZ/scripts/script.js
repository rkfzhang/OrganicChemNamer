var linkType = [false,false,false];
		var singleButton = $(".single")[0];
		var doubleButton = $(".double")[0];
		var tripleButton = $(".triple")[0];
		var linkTypeButtons = [singleButton,doubleButton,tripleButton];
		function resetButton() {
			for (i = 0; i < 3; i++) {
				linkType[i] = false;
				linkTypeButtons[i].style.borderStyle = 'outset';
			}		
		}

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
		singleButton.onclick = function() {linkButton(0)};
		doubleButton.onclick = function() {linkButton(1)};
		tripleButton.onclick = function() {linkButton(2)};


		var testButton = $(".test")[0];
		testButton.onclick = function() {
			alert(linkType);
		}