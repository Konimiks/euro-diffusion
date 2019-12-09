const getOutput = require('./src/index');
getOutput('./data/dataset2').then(res => {
	//console.log(res);
	for(let i = 0; i < res.length; i++) {
		console.log(`Case Number ${i+1}`);
		if(res[i] instanceof Error) {
			console.log(res[i].message);
		}
		let tmp = [];
		for (key in res[i]) {
			tmp.push({ countryName: key, days: res[i][key]});
		}
		tmp.sort((a, b) => {
			if (a.days !== b.days) return a.days - b.days;
			else {
				if (a.countryName > b.countryName) {
					return 1;
				}
				if (a.countryName < b.countryName) {
					return -1;
				}
				return 0;
			}
		});
		for(let j = 0; j < tmp.length; j++) {
			console.log(`${tmp[j].countryName} ${tmp[j].days}`);
		}
	}

});