const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');

// mix.js('resources/js/app.js', 'public/js');

mix.browserSync({
    open: false,
    files: [
        'app/**/*',
        'public/**/*',
        'resources/views/**/*.blade.php',
        'routes/**/*'
    ],
    proxy: 'http://192.168.10.10',
});

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"]
    },
    watchOptions: {
        ignored: /node_modules/
    }
});

mix.options({
    uglify: {
        uglifyOptions: {
            compress: {
                drop_console: true
            }
        }
    },
});

mix.babel(['resources/js/auth/login.js', 'resources/js/api.js'], 'public/assets/js/auth/login.js').version();

mix.babel([
    'resources/js/api.js',
    'resources/js/ws.js',
    'resources/js/main.js',
], 'public/assets/js/all.js').version();

mix.babel([
    'resources/js/services/warehouse.js'
], 'public/assets/js/services/warehouse.js').version();

mix.babel([
    'resources/js/services/cars.js'
], 'public/assets/js/services/cars.js').version();

mix.babel([
    'resources/js/services/map.js'
], 'public/assets/js/services/map.js').version();

mix.babel([
    'resources/js/services/reports.js'
], 'public/assets/js/services/reports.js').version();

mix.babel([
    'resources/js/services/ripe.js'
], 'public/assets/js/services/ripe.js').version();

mix.babel([
    'resources/js/services/rma.js'
], 'public/assets/js/services/rma.js').version();

mix.babel([
    'resources/js/services/rwdz.js'
], 'public/assets/js/services/rwdz.js').version();

mix.babel([
    'resources/js/services/wiki.js'
], 'public/assets/js/services/wiki.js').version();

mix.babel([
    'resources/js/services/manage.js'
], 'public/assets/js/services/manage.js').version();

mix.babel([
    'resources/js/services/ekw.js'
], 'public/assets/js/services/ekw.js').version();

mix.babel([
    'resources/js/services/dashboard.js'
], 'public/assets/js/services/dashboard.js').version();

mix.babel([
    'resources/js/services/contractors.js'
], 'public/assets/js/services/contractors.js').version();

mix.babel([
    'resources/js/services/calendar.js'
], 'public/assets/js/services/calendar.js').version();

mix.babel([
    'resources/js/services/bok.js'
], 'public/assets/js/services/bok.js').version();

mix.babel([
    'resources/js/services/bhp.js'
], 'public/assets/js/services/bhp.js').version();

mix.babel([
    'resources/js/services/profile.js'
], 'public/assets/js/services/profile.js').version();

mix.babel([
    'resources/js/services/availability.js'
], 'public/assets/js/services/availability.js').version();

mix.babel([
    'resources/js/services/nodes.js'
], 'public/assets/js/services/nodes.js').version();

mix.babel([
    'resources/js/services/doc.js'
], 'public/assets/js/services/doc.js').version();

mix.babel([
    'resources/js/services/absence.js'
], 'public/assets/js/services/absence.js').version();

mix.babel([
    'resources/js/services/wfm.js'
], 'public/assets/js/services/wfm.js').version();

mix.babel([
    'resources/js/auth/password.js',
    'resources/js/api.js',
], 'public/assets/js/auth/password.js').version();
