module.exports = function( grunt ) {
    // Project configuration.
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                src: [ 'js/evendar.js', 'js/jquery.hammer.js' ],
                dest: 'build/js/evendar.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'build/css/evendar.min.css': 'css/evendar.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: [ 'js/evendar.js' ],
                tasks: [ 'uglify', 'jsObfuscate' ]
            },
            styles: {
                files: [ 'css/*.scss' ],
                tasks: 'sass'
            },
            docs: {
                files: [ 'readme.md', 'docs/includes/template.html' ],
                tasks: 'markdown'
            }
        },
        markdown: {
            all: {
                files: [ {
                    expand: true,
                    src: 'readme.md',
                    dest: 'docs/',
                    ext: '.html'
                } ],
                options: {
                    template: 'docs/includes/template.html',
                    autoTemplate: true,
                    autoTemplateFormat: 'html'
                }
            }
        },
        jsObfuscate: {
            default: {
                files: {
                    'build/js/evendar.obf.js': 'build/js/evendar.min.js'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'output/evendar.zip'
                },
                files: [ {
                    src: [ 'css/**' ],
                    dest: '/',
                }, {
                    src: [ 'build/**' ],
                    dest: '/'
                }, {
                    src: [ 'js/**' ],
                    dest: '/'
                }, {
                    src: [ 'docs/**' ],
                    dest: '/'
                }, {
                    src: [ 'gruntfile.js', '.gitignore', '.jshintrc', 'package.json', 'readme.md', 'CHANGELOG' ],
                    dest: '/'
                }, ]
            },
            screenshots: {
                options: {
                    archive: 'output/screenshots.zip'
                },
                files: [ {
                    expand: true,
                    cwd: 'toolbox/screenshots/',
                    src: [ '*.png', '!inline.png', '!thumbnail.png' ],
                    dest: '/'
                } ]
            },
        },
        copy: {
            main: {
                expand: true,
                cwd: 'toolbox',
                src: ['inline.png','thumbnail.png'],
                dest: 'output/',
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'build/css/*.min.css',
                        'build/js/*.min.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    },
                    startPath: "docs/single-test.html"
                }
            },
            docs: {
                bsFiles: {
                    src : [
                        'docs/**/*'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    },
                    startPath: "docs/readme.html"
                }
            }
        }
    } );
    grunt.loadNpmTasks( 'grunt-markdown' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'js-obfuscator' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-browser-sync' );
    grunt.registerTask( 'min', [ 'uglify', 'jsObfuscate', 'sass', 'markdown', 'compress', 'copy' ] );
    grunt.registerTask( 'default', [ 'uglify', 'jsObfuscate', 'sass', 'markdown', 'compress', 'copy' ] );
    grunt.registerTask( 'watcher', ['browserSync:dev', 'watch']);
    grunt.registerTask( 'watchdocs', ['browserSync:docs', 'watch']);

};
