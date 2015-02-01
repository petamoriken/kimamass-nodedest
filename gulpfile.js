var gulp = require("gulp"),
	pngquant = require("imagemin-pngquant"),
	zopflipng = require("imagemin-zopfli");

gulp.task("image", function() {
	gulp.src("img/**")
		.pipe(pngquant({speed: 1})())
		.pipe(zopflipng({more: true})())
		.pipe(gulp.dest("public/img"));
});