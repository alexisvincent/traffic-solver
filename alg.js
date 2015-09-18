var fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function(err, data) {
	if(err) throw err;
	
	var size = parseInt(process.argv[3]);
	
	parseData(data, size);
	optimize(size);
	printResults();
});

var supply, 
	demand, 
	fixed, 
	cost,
	optimized;

var TOTAL_COST = 0,
	TOTAL_STOCK = 0,
	TOTAL_DEMAND = 0,
	TOTAL_DELIVERED = 0;

function parseData(data, size) {
	lines = data.split('\n');
	
	supply = buildMatrix(lines.slice(0, 1))[0];
	demand = buildMatrix(lines.slice(1, 2))[0];
	fixed = buildMatrix(lines.slice(2, 2 + size));
	cost = buildMatrix(lines.slice( 3 + size, 3 + 2*size));

	TOTAL_STOCK = supply.reduce(function(acc, val) {
		return acc + val;
	});
	
	TOTAL_DEMAND = demand.reduce(function(acc, val) {
		return acc + val;
	});
}

function buildMatrix(lineArray) {
	return lineArray.map(function(line) {
		return line.match(/\d+/g).map(function(num) {
			return parseInt(num);
		});
	});
}

function optimize2(size) {
	while(!isStable(supply) || !isStable(demand)) {
	}
}

function findMin(array) {
	
	minX = -1;
	minY = -1;
	min = 1000000000;

	for(y=0; y<array.length;y++) {
		for(x=0; x<array.length;x++) {
			if(array[y][x] < min) {
				min = array[y][x];
				minX = x;
				minY = y;
			}
		}
	}

	return {
		x: minX,
		y: minY
	};
}

function isStable(array) {
	if (array.reduce(function(acc, val) {
			return acc | val > 0;
	})) return false;
	return true;
}

function optimize(size) {
	var notYetZero = false;
	
	optimized = [];

	for(i=0;i<size;i++) {
		optimized[i] = [];
	}

	for(i=0;i<size;i++) {
		for(j=0;j<size;j++) {
			optimized[i][j] = 0;
		}
	}

	do {
		notYetZero = false;
		
		for (s = 0; s < size; s++) {
				if (supply[s] !== 0) {
					j = -1;
					ammount = 0;
					minCost = 10000000000;
					for (d = 0; d < 15; d++)
						if (demand[d]!== 0) {
							send = Math.min(supply[s], demand[d]);
							sendCost = send * cost[s][d];
							sendCost = sendCost + fixed[s][d];
							if (minCost > sendCost) {
								minCost = sendCost;
								ammount = send;
								j = d;
							}
						}
					if (j != -1) {
						optimized[j][s] = ammount;
						supply[s] -= ammount;
						demand[j] -= ammount;
						TOTAL_COST += minCost; 
						TOTAL_DELIVERED += ammount;
					}
				}
			}
			
			for (i = 0; i < size; i++) {
				if (supply[i] !== 0 || demand[i] !== 0) {
					notYetZero = true;
					break;
				}
			}
	} while (notYetZero);
}

function printResults() {
	console.log(optimized);
	console.log(TOTAL_COST);
}
