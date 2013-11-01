/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */\n',
      
    // Task configuration.
    concat: {
      dist: { src: ['src/js/*.js'], dest: 'dist/script.js' }
    },
    uglify: {
      dist: { files: { 'dist/script.min.js': '<%= concat.dist.dest %>' } }
    },
    less: {
      dist: { files: { "dist/style.css": "src/style/style.less" } }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true, flatten: true, filter: 'isFile',
            src: ['src/*.html'], dest: 'dist/'
          },
          {
            expand: true, flatten: true,
            src: ['src/fonts/*'], dest: 'dist/fonts/',
          },
          {
            expand: true, flatten: true,
            src: ['res/*'], dest: 'dist/res/',
          }
        ]
      }
    },
    watch: {
      less: { files: ['src/style/*.less'], tasks: ['less'] },
      livereload: {
        options: { livereload: true },
        files: ['src/*'], tasks: ['concat', 'uglify', 'copy']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify', 'less', 'copy', 'watch']);

};
