function add(a, b) {
	var bolo = a + b;
	alert(bolo);
	return a + b;
}

function add10(a) {
	//TODO type checking
	var bolo = Number(a) + 10;
	if (isNaN(bolo)) {
		alert('Warning: You did not enter a valid number!')
	} else {
		alert(a + ' + 10 = ' + bolo);
	}
	return a + 10;
}

function genRand() {
	// Return a random number between 1 and 100
	var myNum = Math.floor(Math.random() * 100 + 1);
	alert("HI!");
	//alert(myNum); //This doesn't work
	return myNum;
}

function functionName( s ){
	alert('Hello, ' + s + '!');
}