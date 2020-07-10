function add(a, b) {
	var bolo = a + b;
	alert(bolo);
	return a + b;
}

function add10(a) {
	//TODO type checking
	var bolo = a + 10;
	alert(bolo);
	return a + 10;
}

function genRand() {
	// Return a random number between 1 and 100
	var myNum = Math.floor(Math.random() * 100 + 1);
	alert("HI!");
	alert(myNum);
	return myNum;
}

function functionName( s ){
	alert('Hello, ' + s + '!');
}