var offset_data;

		let newContainer = document.createElement('div');
		newContainer.id = "container";
		newContainer.width = 560+"px";
		newContainer.height = 240+ "px";
		newContainer.setAttribute('draggable', true);
		document.body.appendChild(newContainer);

		var container = document.getElementById('container');

		var stateOfCapsLock = false;
		var focusedInput;
		var intervalHandler;

		Initialization();

		var dm = document.getElementById('container'); 
		dm.addEventListener('dragstart',drag_start,false); 
		document.body.addEventListener('dragover',drag_over,false); 
		document.body.addEventListener('drop',drop,false); 

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
			addingListenersToInputs(allInputs);
			let	inp1 = document.querySelectorAll('input[type=search]');
			addingListenersToInputs(inp1);

			let	inp2 = document.querySelectorAll('input[type=""]');
			addingListenersToInputs(inp2);
			


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

		function addingListenersToInputs(querySelectors){
			for(i=0; i<querySelectors.length; i++){
					querySelectors[i].addEventListener('focus', function(){
					if(focusedInput != this){
						focusedInput = this;
						let rect = focusedInput.getBoundingClientRect();
						container.style.top = rect.bottom + "px";
						container.style.left = rect.left + "px";
					}
					focusedInput.style.backgroundColor = "yellow";	
					container.style.display = "flex";
					Keyboard();
					SetWriting();
				})
				querySelectors[i].addEventListener('blur', function(){
					this.style.backgroundColor = "white";
				})
				querySelectors[i].addEventListener('keydown', function (event){
					let key = String.fromCharCode(event.keyCode);
					if(event.keyCode == 8){
						key = "backspace";
					}
					ShowKeyDown(key);
				});
				querySelectors[i].addEventListener('keyup', function (event){
					ClearKeyUp(event);
				});
			}
		}

		function Keyboard(){
			

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

		function ShowKeyDown(key){
			let allLetters = document.getElementsByClassName("litera");
			let letter;
			if(key == "backspace" ){
				let backspace = document.getElementById('backspace');
				backspace.style.backgroundColor = "#aa7f4b";
				backspace.style.boxShadow = "0 6px #666";
				backspace.style.opacity = "0.9";
				Sound();
			}
			else{
				for(i = 0; i<allLetters.length; i++){
					letter = allLetters[i].innerHTML.toUpperCase();
					if(letter == key){
						allLetters[i].style.backgroundColor = "#aa7f4b";
						allLetters[i].style.boxShadow = "0 6px #666";
						allLetters[i].style.opacity = "0.9";
						Sound();
						break;
					}
				}
			}
		}

		function ClearKeyUp(event){
			let key = String.fromCharCode(event.keyCode);
				if(event.keyCode == 8){
				key = "backspace";
			}

			let allLetters = document.getElementsByClassName("litera");
			let letter;
			if(key == "backspace" ){
				let backspace = document.getElementById('backspace');
				backspace.style.backgroundColor = "#ccac86";
				backspace.style.boxShadow = "0 6px #999";
				backspace.style.opacity = "1";
				Sound();
			}
			else{
				for(i = 0; i<allLetters.length; i++){
					letter = allLetters[i].innerHTML.toUpperCase();
					if(letter == key){
						allLetters[i].style.backgroundColor = "#ccac86";
						allLetters[i].style.boxShadow = "0 6px #999";
						allLetters[i].style.opacity = "1";
						break;
					}
				}
			}
		}


	function drag_start(event) {
	    var style = window.getComputedStyle(event.target, null);
	    offset_data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
	    event.dataTransfer.setData("text/plain",offset_data);
	} 
	function drag_over(event) { 
	    var offset;
	    try {
	        offset = event.dataTransfer.getData("text/plain").split(',');
	    } 
	    catch(e) {
	        offset = offset_data.split(',');
	    }
	    var dm = document.getElementById('container');

	    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	    event.preventDefault(); 
	    return false; 
	} 
	function drop(event) { 
	    var offset;
	    try {
	        offset = event.dataTransfer.getData("text/plain").split(',');
	    } 
	    catch(e) {
	        offset = offset_data.split(',');
	    }
	    var dm = document.getElementById('container');

	    console.log((event.clientX + parseInt(offset[0],10)));
	     if( (event.clientX + parseInt(offset[0],10)) < 1460 ){
	     	dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	    }else
	     dm.style.left =  1459 + "px";
	    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';


	    event.preventDefault();
	    return false;
	} 