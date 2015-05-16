module.exports = function(grunt) {
    grunt.initConfig(
        {
            jshint: {
                files: ['Gruntfile.js', 'src/client.js', 'src/receiver.js'],
                options: {
                    globals: {
                        jQuery: true
                    }
                }
            },
            uglify: {
                publish: {
                    files: {
                        'poker/client.min.js':      ['poker/client.js'],
                        'poker/receiver.min.js':    ['poker/receiver.js'],
                        'poker/cast_sender.min.js': ['src/lib/cast_sender.js']
                    }
                }
            },
            embed: {
                publish: {
                    files: {
                        'poker/pokerclient.html': 'src/poker.html',
                        'poker/poker.html': 'src/receiver.html'
                    }
                }
            },
            exec: {
                compile_cjsx: "./node_modules/coffee-react/bin/cjsx -cb src/client.cjsx && mv src/client.js poker"
            },
            // TODO May want to use CJSX for the receiver page too.
            // Can make some shared elements and use coffee concat grunt plugin
            browserify: {
                options: {
                    transform:  [ require('grunt-react').browserify ]
                },
                rcv: { src: 'src/receiver.jsx', dest: 'poker/receiver.js'}
            },
            less: {
                publish: {
                    files: {
                        "poker/poker.css": "less/poker.less",
                        "poker/receiver.css": "less/receiver.less"
                    }
                }
            },
            cssmin: {
                target: {
                    files: {
                        'poker/poker.min.css': ['poker/poker.css'],
                        'poker/receiver.min.css': ['poker/receiver.css']
                    }
                }
            },
            watch: {
                cjsx: {
                    files: ['src/*.cjsx'],
                    tasks: ['exec',
                            'uglify',
                            'embed']
                },
                jsx: {
                    files: ['src/*.jsx'],
                    tasks: ['browserify',
                            'uglify',
                            'embed']
                },
                css: {
                    files: ['less/*.less'],
                    tasks: ['less',
                            'cssmin',
                            'embed']
                },
                html: {
                    files: ['src/*.html'],
                    tasks: ['embed']
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-embed');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['exec',
                                   'browserify',
                                   'less',
                                   'cssmin',
                                   'uglify',
                                   'embed',
                                   'watch']);
};
