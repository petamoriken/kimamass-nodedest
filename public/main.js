(function() {
	var milkcocoa = new MilkCocoa("https://io-gi5ewcnl9.mlkcca.com");
	var mouseDataStore = milkcocoa.dataStore("mouse"), clickDataStore = milkcocoa.dataStore("click");

	var mouse = [], cursorImage = new Image();

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var myId = (function() {
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}   
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	})();

	var stage = null;

	// cursor Image のロード
	cursorImage.src = "img/cursor.gif";

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

		// draw
		requestAnimationFrame(draw);
		function draw() {
			// clear
			ctx.clearRect(0, 0, width, height);

			// draw stage
			switch(stage) {
				case null:
				case 1:
				case 2:
				case 3:
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

	});

})();