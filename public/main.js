(function() {
	var milkcocoa = new MilkCocoa("https://io-gi5ewcnl9.mlkcca.com");
	var stageDataStore = milkcocoa.dataStore("stage"), mouseDataStore = milkcocoa.dataStore("mouse"), clickDataStore = milkcocoa.dataStore("click");

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var mouse = [], cursorImage = new Image(), closedDoorImage = new Image(), openDoorImage = new Image();

	var myId = (function() {
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}   
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	})();

	var localStage = null, globalStage = null, opening = 0;

	// Image のロード
	cursorImage.src = "img/cursor.gif";
	closedDoorImage.src = "img/door1.png";
	openDoorImage.src = "img/door2.png";

	// globalStage の受け取り
	stageDataStore.get("now", function(data) {
		globalStage = data.value;
	});
	stageDataStore.on("set", function(data) {
		globalStage = data.value;
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

		setTimeout(removeMouseObject, 1000);
		function removeMouseObject() {
			mouse.forEach(function(obj, index) {
				if(obj === val) {
					mouse.splice(index, 1);
				}
			});
		}
	});

	// onload
	window.addEventListener("DOMContentLoaded", function() {

		var canvas = document.getElementById("game");
		var width = canvas.width, height = canvas.height;
		var ctx = canvas.getContext("2d");

		// send
		canvas.addEventListener("mousemove", function(e) {
			var rect = e.target.getBoundingClientRect();
			var x = e.pageX - rect.left, y = e.pageY - rect.top;
			mouseDataStore.send({x: x, y: y, id: myId});
		});

		canvas.addEventListener("click", function(e) {
			var rect = e.target.getBoundingClientRect();
			var x = e.pageX - rect.left, y = e.pageY - rect.top;

			console.log(x, y);

			if(opening)
				return;

			switch(localStage) {
				case null:
					if(x > 295 && x < 460 && y > 45 && y < 310) {
						opening = 1;
					}
					break;
				case 1:
					if(x > 295 && x < 460 && y > 95 && y < 360) {
						clickDataStore.send({x: x, y: y, id: myId});
					}
					break;
				case 2:
			}

		});

		// draw
		requestAnimationFrame(draw);
		function draw() {

			if(localStage !== null && localStage !== globalStage) {
				opening = 1;
			}

			if(opening >= 2) {

				if(opening <= 10) {
					ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
				}
				ctx.fillRect(0, 0, width, height);

				++opening;
				if(opening === 50) {
					opening = 0;
				}

			} else {

				// clear
				ctx.clearRect(0, 0, width, height);

				// draw stage
				switch(localStage) {
					case null:
						if(opening === 0) {
							ctx.drawImage(closedDoorImage, (width - 300) / 2, (height - 300 - 100) / 2);
						} else if(opening === 1) {
							ctx.drawImage(openDoorImage, (width - 300) / 2, (height - 300 - 100) / 2);
							startOpening();
						}
						break;

					case 1:
						if(opening === 0) {
							ctx.drawImage(closedDoorImage, (width - 300) / 2, (height - 300) / 2);
						} else if(opening === 1) {
							ctx.drawImage(openDoorImage, (width - 300) / 2, (height - 300) / 2);
							startOpening();
						}
						break;

					case 2:
				}

			}

			// mouse draw
			mouse.forEach(function(data) {
				if(data.id !== myId) {
					ctx.drawImage(cursorImage, data.x|0, data.y|0);
				}
			});

			// repeat
			requestAnimationFrame(draw);
		}

		function startOpening() {
			setTimeout(function() {
				opening = 2;
				localStage = globalStage;
			}, 1000);
		}

	});

})();