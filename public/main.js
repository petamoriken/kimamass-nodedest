(function() {
	var milkcocoa = new MilkCocoa("https://io-gi5ewcnl9.mlkcca.com");
	var mouseDataStore = milkcocoa.dataStore("mouse");

	var mouse = [], mouseImage = new Image();
	window.mouse = mouse;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	//mouse.src = "";

	var myId = (function(){
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}   
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
	})();

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

		//console.log(mouse);
	});

	// onload
	window.addEventListener("DOMContentLoaded", function() {
		var canvas = document.getElementById("main");
		var width = canvas.width, height = canvas.height;
		var ctx = canvas.getContext("2d");

		// send
		canvas.addEventListener("mousemove", function(e) {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			mouseDataStore.send({x: x, y: y, id: myId});
		});

		requestAnimationFrame(drawMouse);
		function drawMouse() {
			ctx.clearRect(0, 0, width, height);
			mouse.forEach(function(data) {
				if(data.id !== myId)
					ctx.beginPath();
					ctx.rect(data.x, data.y, 10, 10);
					ctx.stroke();
			});
			requestAnimationFrame(drawMouse);
		}

	});

})();