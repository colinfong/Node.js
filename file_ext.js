module.exports = function (dir, ext, callback) {
		var fs = require('fs');
		var ret = [];
		fs.readdir(dir, function count_dir(err, list){
			if(err) return callback(err);
			for(i = 0; i < list.length; i++) {
				if(list[i].includes("." + ext)) {
			 		var split =  list[i].split(".");
			 		if(split[split.length-1] === ext) {
			 			ret.push(list[i]);
			 		}
			 	}
			}
			callback(null, ret);
		});
	}
