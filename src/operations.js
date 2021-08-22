/*=================================================================================
 [Settings]
=================================================================================*/

// Maximum Input Digits
let inputMaxDigits = 13;

// Haptic Feedback
let haptic = true; // Enable haptic feedback for supported devices [true=Enabled | false=Disabled]
let hapticDuration = 5; // Duration of haptic feedback in miliseconds

/*===============================================================================*/

/*=================================================================================
 [Functions]
=================================================================================*/

// Register Global Variables
let numX = 0;
let operation = 0;
let operationSign = '';

let afterCalc = false;
let selectSign = false;
let dot = false;

let display = document.getElementById('display');
let info = document.getElementById('info');

// Operations
function operations(type, param2) {
	if (haptic)
		navigator.vibrate(hapticDuration);
	
	let numZ = Number(display.textContent);
	
	switch (type) {
		// Operation: Input
		case 'input': {
			let numZ = display.textContent;
			
			if (numZ.length >= inputMaxDigits)
				return;
			
			if (numZ == numX && selectSign) {
				numZ = '';
			}
			
			if (afterCalc) {
				afterCalc = false;
				display.innerHTML = param2;
			} else {
				if (numZ.includes('0.')) {
					display.innerHTML = numZ + param2;
				} else if (numZ == 0 && param2 == 0) {
					display.innerHTML = '0';
				} else {
					if (numZ == 0) {
						display.innerHTML = param2;
					} else {
						display.innerHTML = numZ + param2;
					}
				}
			}
		}
		break;
		
		// Operation: Percent
		case 'percent': {
			display.innerHTML = numX * numZ / 100;
		}
		break;
		
		// Operation: Divide By One
		case 'divideByOne': {
			display.innerHTML = 1 / numZ;
		}
		break;
		
		// Operation: Point
		case 'point': {
			if (dot)
				return;
			
			display.innerHTML = `${numZ}.`;
			dot = true;
		}
		break;
		
		// Operation: Pow
		case 'pow': {
			display.innerHTML = Math.pow(numZ, 2);
		}
		break;
		
		// Operation: Sqr
		case 'sqr': {
			display.innerHTML = Math.sqrt(numZ);
		}
		break;
		
		// Operation: Undo
		case 'undo': {
			numZ = numZ.toString();
			dot = false;
			
			if (afterCalc) {
				info.innerHTML = '';
				return;
			}
			
			if (numZ == 'Infinity')
				numZ = '0';
			
			numZ = numZ.slice(0, -1);
			
			if (numZ.length < 1)
				display.innerHTML = '0';
			else
				display.innerHTML = numZ;
		}
		break;
		
		// Operation: Clean
		case 'clean': {
			display.innerHTML = '0';
			info.innerHTML = '';
			numX = 0;
			operation = 0;
			operationSign = '';
			afterCalc = false;
			selectSign = false;
			dot = false;
		}
		break;
		
		// Operation: Clean Entry
		case 'cleanE': {
			display.innerHTML = '0';
	
			if (afterCalc) {
				info.innerHTML = '';
				numX = 0;
				operation = 0;
				operationSign = '';
				afterCalc = false;
				selectSign = false;
				dot = false;
			}
		}
		break;
		
		// Operation: Change Sign
		case 'changeSign': {
			if(numZ < 0) {
				numZ = Math.abs(numZ);
			} else {
				numZ = -Math.abs(numZ);
			}
			
			display.innerHTML = numZ
			
			if (afterCalc) {
				info.innerHTML = numZ;
			}
		}
		break;
		
		// Operation: Select Sign
		case 'selectSign': {
			if (!selectSign)
				numX = Number(display.textContent);
			
			operation = param2;
			
			switch(operation) {
				case 1: operationSign = '+'; break;
				case 2: operationSign = '-'; break;
				case 3: operationSign = '*'; break;
				case 4: operationSign = '/'; break;
			}
			
			selectSign = true;
			dot = false;
			
			info.innerHTML = `${numX} ${operationSign}`;
		}
		break;
		
		// Operation: Calculate
		case 'calculate': {
			//if (!selectSign)
				//return;
			
			numX = new Decimal(numX);
			numZ = new Decimal(numZ);
			let infoNum = 0;
			
			switch(operation) {
				case 1: infoNum = numX.add(numZ); break;
				case 2: infoNum = numX.sub(numZ); break;
				case 3: infoNum = numX.mul(numZ); break;
				case 4: infoNum = numX.div(numZ); break;
			}
			
			display.innerHTML = infoNum;
			
			if (afterCalc)
				info.innerHTML = `${numZ} ${operationSign} ${numX} =`;
			else
				info.innerHTML += ` ${numZ} =`;

			afterCalc = true;
			selectSign = false;
		}
		break;
	}
}

/*===============================================================================*/