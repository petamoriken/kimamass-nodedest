var path = require('path'),
	MilkCocoa = require("./milkcocoa"),

	express = require('express'),
	logger = require('morgan'),
//	multer = require('multer'),
	app = express();

// init
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
//app.use(multer({ inMemory: true }));

// return frontend
app.use(express.static(path.join(__dirname, "public")));

// listener
app.listen(app.get("port"));

// milkcocoa
(function() {
	var milkcocoa = new MilkCocoa("https://io-gi5ewcnl9.mlkcca.com");
	var stageDataStore = milkcocoa.dataStore("stage"), mouseDataStore = milkcocoa.dataStore("mouse"), clickDataStore = milkcocoa.dataStore("click");
	var stage = null, progress = 0;

	/*
	stageDataStore.get("now", function(data) {
		stage = data.value;
	});
	*/

	stageDataStore.query().done(function(data) {
		stage = data[0].value;
	});

	mouseDataStore.on("send", function(data) {

	});

	/*
	clickDataStore.on("send", function(data) {
		switch(stage) {
			case 1:
				++progress;
				if(progress === 100) {
					progress = 0;
					stage = 2;
					stageDataStore.set("now", {value: 2});
				}
				break;
			default:
				break;
		}

	});
*/

})();

function random(max) {
	return ((Math.random() * max) |0) + 1;
}