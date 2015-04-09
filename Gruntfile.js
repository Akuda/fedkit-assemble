'use strict';

module.exports = function(grunt) {

  // Time the grunt task
  require('time-grunt')(grunt);

  // Load all grunt tasks & assemble
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  grunt.initConfig({
    // Read needed files
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),

    // Clean files
    clean: {
      dist: [
        '<%= site.dist %>',
      ],
    },

    // Assemble - Build HTML
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.distAssets %>',
        partials: '<%= site.partials %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',
        data: '<%= site.data %>',
      },
      site: {
        src: '<%= site.pages %>',
        dest: '<%= site.dist %>/'
      }
    },

    // Compile SASS
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/scss/',
          src: ['**/*.scss'],
          dest: '<%= site.distAssets %>/css',
          ext: '.css'
        }],
        options: {
          sourcemap: true,
        }
      },
      prd: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/scss/',
          src: ['**/*.scss'],
          dest: '<%= site.distAssets %>/css',
          ext: '.css'
        }],
        options: {
          sourcemap: false,
        }
      }
    },

    // Change to rem units
    px_to_rem: {
      dev: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
        options: {
          fallback: true,
          fallback_existing_rem: true,
          map: true,
          ignore: ['content']
        }
      },
      prd: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
        options: {
          fallback: true,
          fallback_existing_rem: true,
          map: false
        }
      },
    },

    // Autoprefix CSS
    autoprefixer: {
      dev: {
        options: {
          browsers: ['last 2 versions', 'Firefox ESR', 'ie 8', 'ie 9'],
          map: true,
        },
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
      },
      prd: {
        options: {
          browsers: ['last 2 versions', 'Firefox ESR', 'ie 8', 'ie 9'],
          map: false,
        },
        files: [{
          expand: true,
          flatten: true,
          src: '<%= site.distAssets %>/css/*.css',
          dest: '<%= site.distAssets %>/css/'
        }],
      }
    },

    // Minify CSS
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= site.distAssets %>/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= site.distAssets %>/css',
          ext: '.css'
        }]
      }
    },

    // jsHint custom JS
    jshint: {
      files: ['<%= site.srcAssets %>/js/modules/*.js']
    },

    // Uglify JS
    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          preserveComments: 'all',
          beautify: true,
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: {
          '<%= site.distAssets %>/js/head.js': ['<%= site.srcAssets %>/js/head/*.js'],
          '<%= site.distAssets %>/js/head-oldie.js': ['<%= site.srcAssets %>/js/head-oldie/*.js'],
          '<%= site.distAssets %>/js/site.js': [
            '<%= site.srcAssets %>/js/globals.js',
            '<%= site.srcAssets %>/js/vendor/*.js',
            '<%= site.srcAssets %>/js/plugins/*.js',
            '<%= site.srcAssets %>/js/modules/*.js',
            '<%= site.srcAssets %>/js/main.js',
          ]
        }
      },
      prd: {
        options: {
          mangle: true,
          beautify: false,
          preserveComments: 'some'
        },
        files: {
          '<%= site.distAssets %>/js/head.js': ['<%= site.srcAssets %>/js/head/*.js'],
          '<%= site.distAssets %>/js/head-oldie.js': ['<%= site.srcAssets %>/js/head-oldie/*.js'],
          '<%= site.distAssets %>/js/site.js': [
            '<%= site.srcAssets %>/js/globals.js',
            '<%= site.srcAssets %>/js/vendor/*.js',
            '<%= site.srcAssets %>/js/plugins/*.js',
            '<%= site.srcAssets %>/js/modules/*.js',
            '<%= site.srcAssets %>/js/main.js',
          ]
        }
      },
    },

    // Image minification
    imagemin: {
      dynamic: {
        options: {
        },
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= site.distAssets %>/img/'
        }]
      }
    },

    // Copy files
    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= site.srcAssets %>/fonts/',
          src: ['**/*'],
          dest: '<%= site.distAssets %>/fonts/'
        }]
      },
      files: {
        files: [{
          expand: true,
          cwd: '<%= site.src %>/files/',
          src: ['**/*'],
          dest: '<%= site.dist %>/'
        }]
      },
    },

    // Watch for changes
    watch: {
      js: {
        files: ['<%= site.srcAssets %>/js/**/*.js'],
        tasks: ['jshint', 'uglify:dev'],
      },
      scss: {
        files:['<%= site.srcAssets %>/scss/**/*.scss'],
        tasks:['sass:dev', 'px_to_rem:dev', 'autoprefixer:dev'],
      },
      img: {
        files: ['<%= site.srcAssets %>/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
      },
      assemble: {
        files: ['<%= site.templates %>/**/*', '_config.yml'],
        tasks: ['assemble'],
      },
      fonts: {
        files: ['<%= site.srcAssets %>/fonts/**/*'],
        tasks: ['copy:fonts'],
      },
      files: {
        files: ['<%= site.src %>/files/**/*'],
        tasks: ['copy:files'],
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= site.distAssets %>/css/*.css',
            '<%= site.distAssets %>/js/*.js',
            '<%= site.distAssets %>/img/**/*.{png,jpg,gif}',
            '<%= site.dist %>/*.html'
          ]
        },
        options: {
          server: '<%= site.dist %>',
          watchTask: true
        }
      }
    }
  });

  // Tasks
  grunt.registerTask('dev', [
    'clean:dist',
    'assemble',
    'sass:dev',
    'px_to_rem:dev',
    'autoprefixer:dev',
    'jshint',
    'uglify:dev',
    'imagemin',
    'copy',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('prd', [
    'clean:dist',
    'assemble',
    'sass:prd',
    'px_to_rem:prd',
    'autoprefixer:prd',
    'cssmin',
    'jshint',
    'uglify:prd',
    'imagemin',
    'copy'
  ]);

  grunt.registerTask('default', 'dev');
  grunt.registerTask('reset', ['clean:dist']);
};
