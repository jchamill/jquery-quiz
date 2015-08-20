module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner : '/*!\n' +
        ' * <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
        ' * License: <%= pkg.license %>\n' +
        ' */\n\n'
    },
    uglify: {
      options : {
        banner : '<%= meta.banner %>'
        //report: 'gzip'
      },
      dist: {
        files: {
          'dist/jquery.quiz-min.js': ['src/jquery.quiz.js']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/jquery.quiz-min.css': ['src/jquery.quiz.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', [
    'uglify',
    'cssmin'
  ]);

};