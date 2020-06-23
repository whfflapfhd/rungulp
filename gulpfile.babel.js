import gulp from 'gulp';
import gpug from 'gulp-pug'; // pug용 모듈
import del from 'del'; // 삭제 모듈
import ws from 'gulp-webserver'; // 웹서버 모듈
import sass from 'gulp-sass'; // sass 모듈
import gimg from 'gulp-image'; // 이미지 압축 모듈
import autop from 'gulp-autoprefixer'; // css 오토프리픽스 모듈
import minifyCss from 'gulp-csso'; // css minify 모듈
import uglify from 'gulp-uglify'; // js minify모듈
import bro from 'gulp-bro'; // JS ES6 컴파일 with babel
import babelify from 'babelify';  // JS ES6 컴파일 with babel
import gh from 'gulp-gh-pages';
sass.compiler = require("node-sass");

const routes = {
    pug : {
        watch : 'src/**/*.pug',
        src : 'src/*.pug',
        dest : "build"
    },
    img : {
        src : 'src/img/*',
        dest : 'build/img'
    },
    scss : {
        watch : 'src/scss/**/*.scss',
        src : 'src/scss/style.scss',
        dest : 'build/css'
    },
    js : {
        watch : 'src/js/**/*.js',
        src : 'src/js/main.js',
        dest : 'build/js'
    }
};
const pug = () => 
    gulp.src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));

const img = () => 
    gulp.src(routes.img.src)
    .pipe(gimg())
    .pipe(gulp.dest(routes.img.dest));

const style = () =>
    gulp.src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autop({
        browsers : ["last 2 versions"]
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp.src(routes.js.src)
    .pipe(bro({
        //transform : [babelify.configure({ presets : ["@babel/preset-env"]}),["uglifyify", {global:true}]]
        transform : [babelify.configure({ presets : ["@babel/preset-env"]})]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(routes.js.dest));

const clean = () => del(["build", ".publish"]);

const webserver = () =>
    gulp.src("build")
    .pipe(ws({livereload:true, open:true}));

const gitDeploy = () =>
    gulp.src("build/**/*")
    .pipe(gh());

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, style);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, style, js]);
const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const depoly = gulp.series([build, gitDeploy, clean]);