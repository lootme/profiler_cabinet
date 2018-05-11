var fs = require("fs");
fs.readdirSync('./models').filter(function(file) {
		return (file.indexOf(".") !== 0 && file.indexOf("API.js") < 0);
	}).forEach(function(file) {
		console.log("associate model file:", file);
	});