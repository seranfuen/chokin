/// <binding BeforeBuild='copy' />
var gulp = require('gulp');
var gutil = require('gulp-util');

var paths = {
    bower: "./bower_components/",
    lib: "./Scripts/"
};

gulp.task("copy", function () {
    var bower = {
        "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "angular": "angular/angular.min.js",
        "jquery": "jquery/dist/*.{js,map}",
        "jquery-validation": "jquery-validation/jquery.validate.js",
        "jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js",
        "respond": "respond/dest/respond.min.js",
        "bootbox": "bootbox.js/bootbox.js"
    }

    for (var destinationDir in bower) {
        //gutil.log(bower[destinationDir] + "--->" + destinationDir);
        gulp.src(paths.bower + bower[destinationDir])
          .pipe(gulp.dest(paths.lib + destinationDir));
    }
});