var fs = require('fs');

let schemaLoader = {}
const models_path = __dirname + '/../models'

schemaLoader.loadSchemas = () => {
	fs.readdirSync(models_path).forEach(function (file) {
	  if (~file.indexOf('.js')) require(models_path + '/' + file)
	})
}

module.exports = schemaLoader;
