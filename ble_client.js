const noble = require('noble-mac');

let SEEN={}

function bleError(error) { 
    console.log("ble error" + error);
}

function foundPreph(p) { 
    //    console.log("found preph"); console.log(p);
    console.log('Found: ' + p.uuid);
    if (SEEN[p.uuid]) { 
	console.log('seen before');
    } else { 
	SEEN[p.uuid] = 1;
	console.log('new');
    }

    console.log( p.advertisement);
    console.log('---');
}

function beginScan() {
    var allowDuplicates = false;
    noble.startScanning([], allowDuplicates, bleError); // any service UUID, allow duplicates
}

noble.on('stateChange', beginScan);

noble.on('discover', foundPreph);
