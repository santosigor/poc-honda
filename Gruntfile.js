module.exports = function(grunt) {

	const sass = require('node-sass');

	// Config
	grunt.initConfig({

		sass: {
      options: {
        implementation: sass
      },
      dist: {
        files: {
        	'src/css/structure.css': 'src/scss/structure/structure.scss',
          'src/css/poc-honda.css': 'src/scss/poc-honda.scss'
        }
      }
    },

    concat: {
			// js: {
			// 	src: ['src/js/poc-honda.js',
			// 				// 'src/js/lib/plugins/*.js',
			// 				// 'src/js/lib/jquery.min.js'
			// 			],
			// 	dest: 'dist/js/poc-honda.min.js'
			// },
			css: {
				src: ['src/css/structure.css', 
							'src/css/lib/plugins/*.css',
							'src/css/poc-honda.css'
						],
				dest: 'dist/css/poc-honda.min.css'
			}
		},

    uglify: {
	    my_target: {
	      files: {
	        'dist/js/poc-honda.min.js': ['dist/js/poc-honda.min.js']
	      }
	    }
	  },

	  cssmin: {
		  options: {
		    mergeIntoShorthands: false,
		    roundingPrecision: -1
		  },
		  target: {
		    files: {
		      'dist/css/poc-honda.min.css': ['dist/css/poc-honda.min.css']
		    }
		  }
		},

		connect: {
			sever: {
				options: {
					hostname: 'localhost',
					port: 3000,
					livereload: true
				}
			}
		},

		watch: {
			options: {
				livereload: true,
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				}
			},
			sass: {
	      files: ['src/scss/**/*.scss'],
	      tasks: ['sass', 'concat:css', 'cssmin']
	    },
	    scripts: {
	      files: ['src/js/**/*.js']
	    },
	    html: {
        files: ['*.html']
    	}
		}

	});

	// Load plugins
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register tasks
	grunt.registerTask('default', ['connect', 'watch']);

};