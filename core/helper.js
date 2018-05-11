var fs = require('fs');

function extend(target) {

    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
	
    return target;
	
}

// unlike nodejs readdirSync works recursive & returns file paths (not file names)
function readdirSyncR(dir) {

    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(readdirSyncR(file))
        else results.push(file)
    })
	
    return results;
	
}

function defined(obj /*, "level1", "level2", ... "levelN"*/) {

  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])/*Object.prototype.hasOwnProperty.call(obj, args[i])*/) {
		return false;
    }
    obj = obj[args[i]];
  }
  
  return true;
  
}

function objectUnique(obj) {
	return obj.filter(function(elem, pos) {
		return obj.indexOf(elem) == pos;
	});
}

function getLength(obj) {
    var length = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) length++;
    }
    return length;
};

function capitalize( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function formatDate(date, isString) {
	var isString = isString || false;
	if(isString)
		date = new Date(date);
	return date.toLocaleString('ru', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute:'2-digit'
	})
	.replace(',', '');
}

function isNumeric(input) {
	return ['string', 'number'].indexOf(typeof(input)) >= 0;
}

function getFuncName() {
	
   var name = arguments.callee.toString();
   name = name.substr('function '.length);
   name = name.substr(0, name.indexOf('('));

   return name;
}

exports.extend = extend;
exports.readdirSyncR = readdirSyncR;
exports.defined = defined;
exports.objectUnique = objectUnique;
exports.getLength = getLength;
exports.capitalize = capitalize;
exports.formatDate = formatDate;
exports.isNumeric = isNumeric;
exports.getFuncName = getFuncName;