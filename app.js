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
	var stage = null, progress = 0, mouse = [];

	/*
	stageDataStore.get("now", function(data) {
		stage = data.value;
	});
	*/
	
	stageDataStore.query().done(function(data) {
		stage = data[0].value;
	});

	// mouse data の受け取り (1000ms 動かない mouse は消す)
	mouseDataStore.on("send", function(data) {
		var val = data.value;
		
		mouse.forEach(function(obj, index) {
			if(obj.id === val.id) {
				mouse.splice(index, 1);
			}
		});
		mouse.push(data.value);

		// stage 2
		if(stage === 2) {
			var flag1 = false, flag2 = false, flag3 = false;

			mouse.forEach(function(data) {
				var x = data.x, y = data.y;
				if(x > 130 && x < 185 && y > 350 && y < 420)	flag1 = true;
				if(x > 300 && x < 355 && y > 380 && y < 450)	flag2 = true;
				if(x > 460 && x < 515 && y > 350 && y < 420)	flag3 = true;
			});

			if(flag1 && flag2 && flag3) {
				stage = 1;
				stageDataStore.set("now", {value: 1});
			}

			flag1 = flag2 = frag3 = false;
		}

		setTimeout(removeMouseObject, 1000);
		function removeMouseObject() {
			mouse.forEach(function(obj, index) {
				if(obj === val) {
					mouse.splice(index, 1);
				}
			});
		}
	});

	
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

})();

function random(max) {
	return ((Math.random() * max) |0) + 1;
}