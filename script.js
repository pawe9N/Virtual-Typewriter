var offset_data;
var stateOfCapsLock = false;
var focusedInput;
var intervalHandler;
var numbersAndSpecialsState = false;
var limitedWidth;

initialization();
window.addEventListener('resize', function(){
	limitedWidth = window.innerWidth - container.offsetWidth * 1.3;
});

function initialization(){

	addingInputs();
	var container = document.getElementById('container');
	creatingDivs();
	
}

function creatingDivs(){
	let newContainer = document.createElement('div');
	newContainer.id = "container";
	newContainer.width = 560 + "px";
	newContainer.height = 240 + "px";
	newContainer.setAttribute('draggable', true);
	document.body.appendChild(newContainer);

	container.addEventListener('dragstart', dragStart, false); 
	document.body.addEventListener('dragover', dragOver, false); 
	document.body.addEventListener('drop', drop, false); 

	let newCapsLock = document.createElement('div');
	newCapsLock.innerHTML = "CapsLock";
	newCapsLock.id = "capslock";
	container.appendChild(newCapsLock);
	newCapsLock.addEventListener('click', function(){
		capslock();
		focusedInput.focus();
	});

	let newKeyboard = document.createElement('div');
	newKeyboard.id = "keyboard";
	container.appendChild(newKeyboard);
	
	let newBackspace= document.createElement('div');
	newBackspace.innerHTML = "Backspace";
	newBackspace.id = "backspace";
	container.appendChild(newBackspace);
	newBackspace.addEventListener('click', function(){
		if(focusedInput.selectionStart == focusedInput.selectionEnd){
			backspace();
		}else{
			markedBackspace();
		}
	});
	newBackspace.addEventListener('mousedown', function(){
		backspacePressed();
	});
	newBackspace.addEventListener('mouseup', function(){
		backspacePressedOut();
	});

	let closeButton = document.createElement('div');
	closeButton.innerHTML = "Close";
	closeButton.id = 'closeButton';
	container.appendChild(closeButton);
	closeButton.addEventListener('click', function(){
		container.style.display = 'none';
	})

	let googleButton = document.createElement('a');
	googleButton.innerHTML = "Google";
	googleButton.id = 'googleButton';
	googleButton.href = "https://google.com";
	container.appendChild(googleButton);

	let numberAndSpecialsButton = document.createElement('div');
	numberAndSpecialsButton.innerHTML = "Specials";
	numberAndSpecialsButton.id = 'numberAndSpecialsButton';
	container.appendChild(numberAndSpecialsButton);
	numberAndSpecialsButton.addEventListener('click', function(){
		if(numbersAndSpecialsState){
			numberAndSpecialsButton.innerHTML = "Specials";
			numbersAndSpecialsState = false;
			newCapsLock.style.display = "block";
			showingKeyboard();
			focusedInput.focus();
		}
		else{
			numberAndSpecialsButton.innerHTML = "Letters";
			numbersAndSpecialsState = true;
			newCapsLock.style.display = "none";
			showingKeyboard();
			focusedInput.focus();
		}
	});
}

function addingInputs(){
	let	inp = document.querySelectorAll('input[type=text]');
	addingListenersToInputs(inp);
	let	inp1 = document.querySelectorAll('input[type=search]');
	addingListenersToInputs(inp1);
	let	inp2 = document.querySelectorAll('input[type=""]');
	addingListenersToInputs(inp2);
	let	inp3 = document.querySelectorAll('input[type=email]');
	addingListenersToInputs(inp3);
	let	inp4 = document.querySelectorAll('input[type=password]');
	addingListenersToInputs(inp4);
	let	inp5 = document.querySelectorAll('input[type=number]');
	addingListenersToInputs(inp5);
	let	inp6 = document.querySelectorAll('input[type=url]');
	addingListenersToInputs(inp6);
	let	inp7 = document.querySelectorAll('input:not([type])');
	addingListenersToInputs(inp7);
}

function addingListenersToInputs(querySelectors){
	for(i=0; i<querySelectors.length; i++){

		if(querySelectors[i].type == "email" || 
			querySelectors[i].type == "number" ||
			querySelectors[i].type == "password"){
			querySelectors[i].type = "text";
		}

		querySelectors[i].addEventListener('mousemove', function(){
			stateOfCapsLock = event.getModifierState('CapsLock');
		});
		querySelectors[i].addEventListener('focus', function(){
			if(focusedInput != this){
				focusedInput = this;
				let rect = focusedInput.getBoundingClientRect();
				container.style.top = rect.bottom + "px";
				container.style.left = rect.left + "px";
				focusedInput.style.backgroundColor = "#f9f6f2";	
			}
			container.style.display = "flex";
			showingKeyboard();
			setWriting();
		})
		querySelectors[i].addEventListener('blur', function(){
			if(focusedInput != this)
				this.style.backgroundColor = "white";
		})
		querySelectors[i].addEventListener('keydown', function (event){
			let key = String.fromCharCode(event.keyCode);

			switch(event.keyCode){
				case 8: key = "backspace"; break;
				case 20: key = "capslock"; break;
				case 27: key = "closeButton"; break;
				case 32: key = "space"; break;
			}
			
			showKeyDown(key);
		});
		querySelectors[i].addEventListener('keyup', function (event){
			clearKeyUp(event);
		});
	}
}

function showingKeyboard(){
	let chosenTypeOfLetters;
	let numberOfLetters;
	let greatQWERTY = "QWERTYUIOP{}ASDFGHJKL:\"|ZXCVBNM<>?";
	let smallQWERTY = "qwertyuiop[]asdfghjkl;'\\zxcvbnm,./";
	let numbersAndSpecials = "1234567890-=~!@#$%^&*()_+ęóąłżźćń";

	if(numbersAndSpecialsState){
		chosenTypeOfLetters = numbersAndSpecials;
		numberOfLetters = numbersAndSpecials.length;
	}
	else{
		if(stateOfCapsLock == false){
			chosenTypeOfLetters = smallQWERTY;
			numberOfLetters = smallQWERTY.length;
		}else{
			chosenTypeOfLetters = greatQWERTY;
			numberOfLetters = greatQWERTY.length;
		}
	}

	let keys = "";
	let key;
	for(var i = 0; i < numberOfLetters; i++)
	{
		key = chosenTypeOfLetters.charAt(i);
		if((key.charCodeAt(0) >= 48) && (key.charCodeAt(0) <= 57) ||
		   (key.charCodeAt(0) >= 65) && (key.charCodeAt(0) <= 90) ||
		   (key.charCodeAt(0) >= 97) && (key.charCodeAt(0) <= 122)){
				keys += "<div class='letter'>"+ key +"</div>";
		}
		else{
			keys += "<div class='letter special'>"+ key +"</div>";
		}

		if(i==11)
	   		 keys += "<div style='clear: both;'>";
		else if(i==23)
			 keys += "<div class='bottom' style='clear: both;'>";
		else if(i==numberOfLetters-1){
			keys += "<div class='bottom' style='clear: both;'>";
			keys += "<div class='letter' id='space'>Space</div>";
		}
	}
	document.getElementById('keyboard').innerHTML = keys;

	limitedWidth = window.innerWidth - container.offsetWidth * 1.3;
}

function setWriting(){
	let allLetters = document.getElementsByClassName("letter");
	for(let i = 0; i < allLetters.length; i++){
		allLetters[i].addEventListener('click', function(){
			sound();
			writingFromKeyobard(this);
		});
	}
}

function writingFromKeyobard(clickedLetter){
	let whereIsSelector = focusedInput.value.slice(0, focusedInput.selectionStart).length;
	let partOfInputBeforeSelector = focusedInput.value.substr(0, whereIsSelector);
	let partOfInputAfterSelecetor = focusedInput.value.substr(whereIsSelector);
	focusedInput.value = partOfInputBeforeSelector;

	switch(clickedLetter.innerHTML){
		case "&lt;": focusedInput.value += "<"; break;
		case "&gt;": focusedInput.value += ">"; break;
		case "Space": focusedInput.value += " "; break;
		case "&amp;": focusedInput.value += "&"; break;
		default: focusedInput.value += clickedLetter.innerHTML; break;
	}
	
	focusedInput.value += partOfInputAfterSelecetor;
	focusedInput.focus();
	focusedInput.setSelectionRange(whereIsSelector + 1,whereIsSelector + 1);
}

function capslock(){
	sound();
	if(stateOfCapsLock){
		stateOfCapsLock = false;
	}
	else{
		stateOfCapsLock = true;
	}
	showingKeyboard();
}

function backspace(){
	sound();
	let whereIsSelector = focusedInput.value.slice(0, focusedInput.selectionStart).length;
	let partOfInputBeforeSelector = focusedInput.value.substring(0, whereIsSelector - 1);
	let partOfInputAfterSelecetor = focusedInput.value.substring(whereIsSelector, focusedInput.value.length);
	focusedInput.value = partOfInputBeforeSelector + partOfInputAfterSelecetor;
	focusedInput.focus();
	focusedInput.setSelectionRange(whereIsSelector - 1, whereIsSelector - 1);
}

function markedBackspace(){
	sound();
	let whereIsSelector = focusedInput.value.slice(0, focusedInput.selectionStart).length;
	let text = focusedInput.value;
	text = text.slice(0, focusedInput.selectionStart) + text.slice(focusedInput.selectionEnd);
	focusedInput.value = text;
	focusedInput.focus();
	focusedInput.setSelectionRange(whereIsSelector, whereIsSelector);
}

function backspacePressed(){
	intervalHandler = setInterval(function(){
		if(focusedInput.value != "")
			backspace();
		else
			backspacePressedOut();
	},200);
}

function backspacePressedOut(){
	clearInterval(intervalHandler);
}

function sound(){
	let audio = new Audio("https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3");
	audio.play();
}

function showKeyDown(key){
	let allLetters = document.getElementsByClassName("letter");
	let letter;
	if(key == "backspace" ){
		let backspace = document.getElementById('backspace');
		backspace.classList.add("shadow");
		sound();
	}
	else if(key == "capslock"){
		let caps = document.getElementById('capslock');
		caps.classList.add("shadow");
		capslock();
		focusedInput.focus();
	}
	else if(key == "space"){
		let space = document.getElementById('space');
		space.classList.add("shadow");
		sound();
	}
	else if(key == "closeButton"){
		container.style.display = "none";
	}
	else{
		for(i = 0; i<allLetters.length; i++){
			letter = allLetters[i].innerHTML.toUpperCase();
			if(letter == key){
				allLetters[i].classList.add("shadow");
				sound();
				break;
			}
		}
	}
}

function clearKeyUp(event){
	let key;

	switch(event.keyCode){
		case 8: key = "backspace"; break;
		case 20: key = "capslock"; break;
		case 27: key = "closeButton"; break;
		case 32: key = "space"; break;
	}
	
	let allLetters = document.getElementsByClassName("letter");
	let letter;
	if(key == "backspace" ){
		let backspace = document.getElementById('backspace');
		backspace.classList.remove("shadow");
	}
	else if(key == "capslock" ){
		let capslock = document.getElementById('capslock');
		capslock.classList.remove("shadow");
	}
	else if(key == "space" ){
		let space = document.getElementById('space');
		space.classList.remove("shadow");
	}
	else if(key == "closeButton"){
		let closeButton = document.getElementById('closeButton');
		closeButton.classList.remove("shadow");
	}
	else{
		key = String.fromCharCode(event.keyCode);

		for(i = 0; i<allLetters.length; i++){
			letter = allLetters[i].innerHTML.toUpperCase();
			if(letter == key){
				allLetters[i].classList.remove("shadow");
				break;
			}
		}
	}
}

function dragStart(event) {
	let style = window.getComputedStyle(event.target, null);
	offset_data = (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY);
	event.dataTransfer.setData("text/plain",offset_data);
} 

function dragOver(event) { 
	let offset;

	try {
	    offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
	    offset = offset_data.split(',');
	}

	container.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
	container.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
	event.preventDefault(); 
	return false; 
} 

function drop(event) { 
	let offset;

	try {
	    offset = event.dataTransfer.getData("text/plain").split(',');
	}
	catch(e) {
	    offset = offset_data.split(',');
	}
	
	if( (event.clientX + parseInt(offset[0], 10)) < limitedWidth){
	 	container.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
	}
	else{
		container.style.left =  limitedWidth + "px";
	}
	
	container.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
	event.preventDefault();
	return false;
} 
