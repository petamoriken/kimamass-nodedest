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
	var stage = milkcocoa.dataStore("stage");

	stage.on("set", function(data){ 
		console.log(data);
	});
	stage.set("now", {value: random(3)});

})();

function random(max) {
	return ((Math.random() * max) |0) + 1;
}