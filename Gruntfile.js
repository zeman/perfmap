module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		wrap: {
			basic: {
				src: ['build/perfmap.js'],
				dest: 'build/perfmap.js',
				options: {
					wrapper: ['\n;(function(window, document, undefined){\n\'use strict\';\n', '\nwindow.perfMap = perfMap;\n})(window, document);\nperfMap.init();']
				}
			}
		},
		concat: {
			options: {
				stripBanners: true
			},
			dist: {
				src: 'src/**/*.js',
				dest: 'build/perfmap.js'
			}
		},
		jshint: {
			src: ['src/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		jasmine: {
			// Your project's source files
			src: 'src/**/*.js',
			options: {
				specs: 'specs/**/*spec.js'
			}
		},
		lenient: {
			src: 'build/perfmap.js',
			dest: 'build/perfmap.js'
		}
	});

	// Register tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wrap');
	grunt.loadNpmTasks('grunt-lenient');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Default task.
	grunt.registerTask('default', ['jshint', 'jasmine', 'concat:dist']);
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('build', ['concat:dist', 'lenient', 'wrap:basic']);

};