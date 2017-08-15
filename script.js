let newContainer = document.createElement('div');
newContainer.id = "container";
document.body.appendChild(newContainer);

var container = document.getElementById('container');
var stateOfCapsLock = false;
var focusedInput;
var intervalHandler;

Initialization();

function Initialization(){
	let newCapsLock = document.createElement('div');
	newCapsLock.innerHTML = "CapsLock";
	newCapsLock.id = "capslock";
	container.appendChild(newCapsLock);
	newCapsLock.addEventListener('click', function(){
		CapsLock();
	});

	let newKeyboard = document.createElement('div');
	newKeyboard.id = "keyboard";
	container.appendChild(newKeyboard);

	let	allInputs = document.querySelectorAll('input[type=text]');
	for(i=0; i<allInputs.length; i++){
		allInputs[i].addEventListener('focus', function(){
			focusedInput = this;
			focusedInput.style.backgroundColor = "yellow";
			Keyboard();
			SetWriting();
		})
		allInputs[i].addEventListener('blur', function(){
			this.style.backgroundColor = "white";
		})
	}

	let newBackspace= document.createElement('div');
	newBackspace.innerHTML = "Backspace";
	newBackspace.id = "backspace";
	container.appendChild(newBackspace);
	newBackspace.addEventListener('click', function(){
		Backspace();
	});
	newBackspace.addEventListener('mousedown', function(){
		Backspace2();
	});
	newBackspace.addEventListener('mouseup', function(){
		Backspace2out();
	});
}

function Keyboard(){
	container.style.display = "flex";

	/*let rect = focusedInput.getBoundingClientRect();
	container.style.top = rect.bottom + "px";
	container.style.left = rect.left + "px";*/

	let chosenTypeOfLetters;
	let numberOfLetters;
	let greatQWERTY = "QWERTYUIOP{}ASDFGHJKL:\"|ZXCVBNM<>?";
	let smallQWERTY = "qwertyuiop[]asdfghjkl;'\\zxcvbnm,./";

	if(stateOfCapsLock == false){
		chosenTypeOfLetters = smallQWERTY;
		numberOfLetters = smallQWERTY.length;
	}else{
		chosenTypeOfLetters = greatQWERTY;
		numberOfLetters = greatQWERTY.length;
	}

	let keys = "";
	let key;
	for(var i=0; i<numberOfLetters; i++)
	{
		key = chosenTypeOfLetters.charAt(i);
		keys += "<div class='litera'>"+key+"</div>";
		if(i==11) keys+="<div style='clear: both;'>";
		else if(i==23) keys+="<div class='bottom' style='clear: both;'>";
		else if(i==numberOfLetters-1){
			keys+="<div class='bottom' style='clear: both;'>";
			keys+="<div class='litera' id='space'>Space</div>";
		}
	}
	document.getElementById('keyboard').innerHTML = keys;
}

function SetWriting(){
	let allLetters = document.getElementsByClassName("litera");
	for(let i = 0; i < allLetters.length; i++){
		allLetters[i].addEventListener('click', function(){
			Sound();
			WritingFromKeyboard(this);
		});
	}
}

function WritingFromKeyboard(clickedLetter){
	let whereIsSelector = focusedInput.value.slice(0, focusedInput.selectionStart).length;
	let partOfInputBeforeSelector = focusedInput.value.substr(0, whereIsSelector);
	let partOfInputAfterSelecetor = focusedInput.value.substr(whereIsSelector);
	focusedInput.value = partOfInputBeforeSelector;

	if(clickedLetter.innerHTML == "&lt;"){
		focusedInput.value += "<";
	}else if(clickedLetter.innerHTML == "&gt;"){
		focusedInput.value += ">";
	}else if(clickedLetter.innerHTML == "Space"){
		focusedInput.value += " ";
	}else{
		focusedInput.value += clickedLetter.innerHTML;
	}

	focusedInput.value += partOfInputAfterSelecetor;
	focusedInput.focus();
	focusedInput.setSelectionRange(whereIsSelector + 1,whereIsSelector + 1);
}

function CapsLock(){
	Sound();
	if(stateOfCapsLock){
		stateOfCapsLock = false;
	}else{
		stateOfCapsLock = true;
	}
	Keyboard();
	focusedInput.focus();
}

function Backspace(){
	Sound();
	let whereIsSelector = focusedInput.value.slice(0, focusedInput.selectionStart).length;
	let partOfInputBeforeSelector = focusedInput.value.substring(0, whereIsSelector-1);
	let partOfInputAfterSelecetor = focusedInput.value.substring(whereIsSelector, focusedInput.value.length);
	focusedInput.value = partOfInputBeforeSelector + partOfInputAfterSelecetor;
	focusedInput.focus();
	focusedInput.setSelectionRange(whereIsSelector-1,whereIsSelector-1);
}

function Backspace2(){
	intervalHandler = setInterval(function(){
		Backspace();
	},200);
}

function Backspace2out(){
	clearInterval(intervalHandler);
}

function Sound(){
	let audio = new Audio("https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3");
	audio.play();
}