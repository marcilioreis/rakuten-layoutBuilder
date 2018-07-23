/*
 * grunt-init-jquery
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Cria um template de implantação.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ deve conter o nome da pasta no servidor de desenv e' +
  'deve possuir o mesmo nome do repositório no git. _Project title_ pode conter ' +
  ' um título amigável que será lido no JSON de metadados. ' +
  '\n\n'+
  'Todas a perguntas seguidas um valor entre parênteses possuem resposta padrão que' +
  'pode ser modificado conforme a necessidade do projeto.' +
  '\n\n'+
  'Para maiores informações, por favor consulte a seguinte documentação:' +
  '\n\n'+
  'Estrutura   https://github.com/marcilioreis/rakuten-layoutBuilder/blob/master/README.md' +
  '\n\n'+
  'Templates   https://github.com/marcilioreis/rakuten-layoutBuilder/blob/master/README.md' +
  '\n\n'+
  'FAQ         https://github.com/marcilioreis/rakuten-layoutBuilder/blob/master/README.md';

// Template-specific notes to be displayed after question prompts.
exports.after = 'Agora você deve instalar as dependencias do projeto na pasta grunt ' + 
  'utilizando o comando _npm install_. Após esse passo, você poderá executar o comando ' + 
  '_grunt w_ para copiar as views e os templates escolhidos no começo dessa etapa. ' +
  'Para maiores informações sobre como instalar e configurar o grunt, por favor acesse: ' +
  ' Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('title'),
    init.prompt('description', 'Rakuten Brasil Front End Framework'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage', 'http://www.rakuten.com.br'),
    init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('core_header', 1),
    init.prompt('core_product', 1),
    init.prompt('core_footer', 1),
    init.prompt('banner_home_top', 1),
    init.prompt('banner_home_main', 1),
    init.prompt('banner_home_bottom', 1),
    /* init.prompt('core_minha_conta', 0),
    init.prompt('core_central_atend', 2),
    init.prompt('core_hproduct', 2),
    init.prompt('core_quickview', 2),
    init.prompt('core_look', 2), */
    init.prompt('page_w', '1280px'),
    init.prompt('color_primary', '#000000'),
    init.prompt('color_secondary', '#CCCCCC'),
    init.prompt('font_one', 'Lato'),
    init.prompt('font_two'),
    ],

    function (err, props) {
      // A few additional properties.
      props.metadatajson = 'metadata_' + props.name + '.json';
      props.nodepath = 'grunt/'
      props.packagejson = props.nodepath + 'package.json';
      props.corejson =  props.nodepath + 'core.json';
      props.varsjson = props.nodepath + 'vars.json';
      props.keywords = [];

      // Files to copy (and process).
      var files = init.filesToCopy(props);

      // Add properly-named license files.
      init.addLicenseFiles(files, props.licenses);

      // Actually copy (and process) files.
      init.copyAndProcess(files, props, {
        noProcess: 'sass/1_config/start/config/fontawesome/**'
      });

      // Generate metadata.json file.
      init.writePackageJSON(props.metadatajson, {
        name: props.title,
        version: props.version,
        description: props.description,
        homepage: props.homepage,
        licenses: props.licenses,
        author_name: props.author_name,
        author_email: props.author_email,
        author_url: props.author_url,
        repository: props.repository,
      });

      // Generate package.json file, used by npm and grunt.
      init.writePackageJSON(props.packagejson, {
        name: props.name,
        version: props.version,
        npm_test: '',
        // TODO: pull from grunt's package.json
        node_version: '>= 0.8.0',
        devDependencies: {
          'eyeglass': "^1.5.0",
          'grunt': '^1.0.2',
          'grunt-cli': '^1.2.0',
          "grunt-contrib-clean": "^1.1.0",
          'grunt-contrib-copy': '^1.0.0',
          'grunt-contrib-sass': '^0.9.2',
          'grunt-contrib-watch': '^1.0.1',
          'grunt-ftp-deploy': '^0.2.0',
        },
      });

      // Generate core.json file.       
      writeCoreJSON(props.corejson, {
        core_header: props.core_header,
        core_footer: props.core_footer,
        core_product: props.core_product,
        banner_home_top: props.banner_home_top,
        banner_home_main: props.banner_home_main,
        banner_home_bottom: props.banner_home_bottom
      }); 
      
      // Generate vars.json file.       
      writeVarsJSON(props.varsjson, {
        page_w: props.page_w,
        color_primary: props.color_primary,
        color_secondary: props.color_secondary,
        font_one:  props.font_one,
        font_two:  props.font_two,
      });       
      
      // Install node_modules
      //runNpmInstall(props);

      // All done!
      done();
    },

  );

  // Run npm install in project's directory and then call done if it is specified.
  // The first parameter allows to skip npm install if parameter's value is falsy (the default value is true).
  function runNpmInstall (props) {
    grunt.log.writeln('\nnpm install...');
    // Run npm install in project's directory
    grunt.util.spawn({
      grunt: true,
      cmd: 'npm', 
      args: ['install'], 
      opts: 
      {
        //cwd: props.nodepath, 
        cwd: init.destpath(props.nodepath), 
        stdio: 'inherit'
      }
    }, function(error, result, code) {
        if (done) {
          done();
        }
      }
    ); 

    // Write file.
    grunt.verbose.or.write('Installing node_modules...');
    try {
      grunt.verbose.or.ok();
    } catch (e) {
      grunt.verbose.or.error().error(e);
      throw e;
    }
    
  }
  
  function writeCoreJSON(filename, items, callback) {
    var pkg = {};

    // Covert objects to array
    var result = Object.keys(items).map(function (key) {
      return {
        name: key,
        coreVersion: items[key]
      };
    });

    for (var i = 0, len = result.length; i < len; i++) {
      var core = "core_";

      // Cores
      var arrCore = result.filter(function (val) {
        return val.name.indexOf(core) !== -1;
      });

      pkg.cores = arrCore.map(function (item) {
        return {
          name: item.name.substring(core.length),
          coreVersion: item.coreVersion
        };
      });

      // Banners
      var arrBanner = result.filter(function (val) {
        return val.name.indexOf(core) === -1;
      });

      pkg.banners = arrBanner.map(function (item) {
        return {
          name: item.name,
          coreVersion: item.coreVersion
        };
      });

    }

    // Allow final tweaks to the pkg object.
    if (callback) {
      pkg = callback(pkg, items);
    }

    // Write file.
    grunt.verbose.or.write('Writing ' + filename + '...');
    try {
      grunt.file.write(init.destpath(filename), JSON.stringify(pkg, null, '\t'));
      grunt.verbose.or.ok();
    } catch (e) {
      grunt.verbose.or.error().error(e);
      throw e;
    }
  };

  function writeVarsJSON(filename, items, callback) {
    var vars = {};

    // Page width var
    ['page_w'].forEach(function(prop) {
      if (prop in items) { 
        vars[prop] = items[prop]; 
      }
    });

    /* ['font_one', 'font_two'].forEach(function(prop) {
      if (items[prop]) {
        vars[prop] = items[prop];
      } 
    }); */

    // Covert objects to array
    var result = Object.keys(items).map(function (key) {
      return { name: key, value: items[key] };      
    });

    for (var i = 0, len = result.length; i < len; i++) {
      
      // Colors
      var color = "color";
      var arrColor = result.filter(function (val) {
        return val.name.indexOf(color) !== -1;
      });

      vars.colors = arrColor.map(function (item) {
        return { name: item.name, value: item.value };        
      });

      // Fonts
      var font = "font";
      var arrFont = result.filter(function (val) {
        if(val.value){
          return val.name.indexOf(font) !== -1;
        }  
      });

      vars.fonts = arrFont.map(function (item) {        
        return { name: item.name, value: item.value + ', sans-serif' };                
      });

    }

    // Allow final tweaks to the vars object.
    if (callback) {
      vars = callback(vars, items);
    }

    // Write file.
    grunt.verbose.or.write('Writing ' + filename + '...');
    try {
      grunt.file.write(init.destpath(filename), JSON.stringify(vars, null, '\t'));
      grunt.verbose.or.ok();
    } catch (e) {
      grunt.verbose.or.error().error(e);
      throw e;
    }
  };
  
};