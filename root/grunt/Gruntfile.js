module.exports = function (grunt) {
    
    var eyeglass = require("eyeglass");

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('../{%= metadatajson %}'),
        
        config: {
            projectFolder: '{%= name %}',
        },
        
        paths: {
            custom: 'R:/IKCLoja/Genesis/Repository/<%= config.projectFolder %>/locales/custom/'            
        },

        //TASK's - SASS
        sass: {
            // Compilar o css base do projeto
            base: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: '../sass/1_config/start/',
                    src: ["**/*.scss"],
                    dest: '../css/',
                    ext: '.css'
                }]
            },
            // Compilar todos os modulos para dentro do projeto
            allModules: {
                options: {
                    style: 'compressed',
                    sourcemap: 'auto'
                },
                files: [{
                    expand: true,
                    cwd: '../sass/3_declaration/',
                    src: ["**/*_*.scss"],
                    dest: '../css/components/',
                    ext: '.css'
                }]
            },
            // Compilar modulos isolados
            modules: {
                options: {
                    style: 'compressed',
                    sourcemap: 'auto'
                },
                files: exportModules()
            }
        },

        //TASK's - COPY
        copy: {
            // Mover um ou mais componentes para o R
            css_components: {
                files: copyComponents()
            },
            // Mover o font awesome5 para o R:
            fontawesome:{
                expand: true,
                cwd: '../sass/1_config/start/config/fontawesome/',
                src: ['**'],
                dest: '../css/config/fontawesome/'
            },
            // [TEMP] Mover os templates core para dentro do projeto
            core: {
                files: moveCore()
            },
            // [TEMP] Mover os templates de banners para dentro do projeto
            banners: {
                files: moveBanners()
            },
            // [TEMP] Mover as views dos modulos selecionados
            views: {
                files: moveViews()
            },
            // Mover pacote CSS para o R
            css_to_dev:{
                expand: true,
                cwd: '../css/',
                src: ['**'],
                dest: '<%=paths.custom%>css/'
            },
            // Mover imagens para o R
            img_to_dev:{
                expand: true,
                cwd: '../img/',
                src: ['**', '!**/*.db'],
                dest: '<%=paths.custom%>img/'
            },
            // Mover js para o R
            js_to_dev:{
                expand: true,
                cwd: '../js/',
                src: ['**'],
                dest: '<%=paths.custom%>js/'
            },
        },

        //TASK - WATCH
        watch: {
            config: {
                files: ['Gruntfile.js', '*.json'],
                tasks: ['w'],
                options: {
                    reload: true
                }
            },
            js: {
                files: ['../js/*.js'],
                tasks: ['copy:js_to_dev', 'ftp-deploy:put_js']
            },
            img: {
                files: ['../img/*'],
                tasks: ['copy:img_to_dev', 'ftp-deploy:put_img']
            },
            scss: {
                files: '../sass/**/*.scss',
                tasks: ['export_module']
            },
        },

        //TASK - DEPLOY FTP HOMOLOG
        'ftp-deploy': {
            //Adiciona todo css base no ambiente de homologação
            put_css: {
                auth: {
                    host: '200.229.205.140',
                    port: 21,
                    authKey: 'homolog',
                    autPath: './.ftpconfig'
                },
                src: '../css/',
                dest: '/Genesis/Repository/<%= config.projectFolder %>/locales/custom/css/',
                exclusions: ['<%=paths.custom%>**/.DS_Store', '<%=paths.custom%>**/Thumbs.db']
            },
            //Adiciona um componente especifico (ou mais) em homologação
            put_component: {
                auth: {
                    host: '200.229.205.140',
                    port: 21,
                    authKey: 'homolog',
                    autPath: './.ftpconfig'
                },
                src: '../css/components/',
                dest: '/Genesis/Repository/<%= config.projectFolder %>/locales/custom/css/components/',
                exclusions: ['<%=paths.custom%>**/.DS_Store', '<%=paths.custom%>**/Thumbs.db']
            },
            //Adiciona as imagens do projeto em homologação
            put_img: {
                auth: {
                    host: '200.229.205.140',
                    port: 21,
                    authKey: 'homolog',
                    autPath: './.ftpconfig'
                },
                src: '../img/',
                dest: '/Genesis/Repository/<%= config.projectFolder %>/locales/custom/img/',
                exclusions: ['<%=paths.custom%>**/.DS_Store', '<%=paths.custom%>**/Thumbs.db']
            },
            //Adiciona os scripts do projeto em homologação
            put_js: {
                auth: {
                    host: '200.229.205.140',
                    port: 21,
                    authKey: 'homolog',
                    autPath: './.ftpconfig'
                },
                src: '../js/',
                dest: '/Genesis/Repository/<%= config.projectFolder %>/locales/custom/js/',
                exclusions: ['<%=paths.custom%>**/.DS_Store', '<%=paths.custom%>**/Thumbs.db']
            },
        },

        //TASK's - CLEAN
        clean: {
            options: {
                force: true
            },
            css: {
                files: [{
                    dot: true,
                    src: [
                        '../css',
                    ]
                }]
            },
        },
    });

    //Task START - Task inicial para primeiro deploy do projeto.
    grunt.registerTask('start',[
        'sass:base',          //1º Cria a base do CSS
        'copy:fontawesome',   //2º Copia o fontawesom 5 para a pasta css
        'copy:core',          //3º [TEMP] Copia os templates core para dentro do projeto 
        'copy:banners',       //4º [TEMP] Copia os templates de banner para dentro do projeto 
        'sass:allModules',    //5º Compila todos os modulos para um primeiro deploy
        'copy:views',         //6º Move as views dos components selecionados para dentro do projeto
        'copy:css_to_dev',    //7º Move a estrtura inicial CSS para o R
        'copy:img_to_dev',    //8º Move a estrtura inicial IMG para o R  
        'copy:js_to_dev',     //9º Move a estrtura inicial JS para o R 
        'ftp-deploy:put_css', //10º Move a estrtura inicial CSS para o FTP de Homologação
        'ftp-deploy:put_img', //11º Move a estrtura inicial IMG para o FTP de Homologação 
        'ftp-deploy:put_js',  //12º Move a estrtura inicial JS para o FTP de Homologação 
        'clean:css',          //13º Limpa a pasta css para evitar upload desnecessário
        'watch'               //14º Inicia o watch do projeto              
    ]);

    //Task Export Module - Task para exportar um ou mais modulos especificos
    grunt.registerTask('export_module',[
        'copy:core',                 //1º [TEMP] Copia o cor para o projeto
        'sass:modules',              //2º Compila o modulo informado no deploy.json
        'copy:css_components',       //3º Move o CSS do modulo para o R
        'ftp-deploy:put_component',  //4º Move o CSS do modulo para o FTP de homologação
        'clean:css'                  //5º Limpa a pasta css/components para evitar upload desnecessário
    ]);

    //Task WATCH - Task para deploy do projeto
    grunt.registerTask('w', ['watch']);

};


function moveCore() {
    var json = require('./core.json');
    var cores = json.cores;
    var files = [];
    for (var core in cores) {
        files.push({
            expand: true,
            cwd: "../sass/0_core/" + cores[core].name + "/" + cores[core].coreVersion + "/",
            src: "*.scss",
            dest: "../sass/2_deploy/core/"
        });
    };
    return files;
};

function moveViews() {
    var json = require('./core.json');
    var cores = json.cores;
    var files = [];
    for (var core in cores) {
        files.push({
            expand: true,
            cwd: "../sass/0_core/" + cores[core].name + "/" + cores[core].coreVersion + "/views/",
            src: "**",
            dest: "../views/" + cores[core].name + "/"
        });
    };
    return files;
};

function moveBanners() {
    var json = require('./core.json');
    var banners = json.banners;
    var files = [];
    for (var banner in banners) {
        files.push({
            src: "../sass/0_core/banners/" + banners[banner].coreVersion + "/_core_banners.scss",
            dest: "../sass/2_deploy/core/" + banners[banner].name + "/_core_banners.scss" 
        });
    };
    return files;
};

function copyComponents() {
    var json = require('./deploy.json');
    var components = json.deploy;
    var files = [];
    for (var component in components) {
        if (components[component].name == "*") {
            files.push({
                expand: true,
                cwd: '../css/components/',
                src: ['**'],
                dest: '<%=paths.custom%>css/components/'
            });
        } else {
            files.push({
                expand: true,
                cwd: '../css/components/' + components[component].name + '/',
                src: ['**'],
                dest: '<%=paths.custom%>css/components/' + components[component].name + '/'
            });
        }
    }
    return files;
}

function exportModules() {
    var json = require('./deploy.json');
    var components = json.deploy;
    var files = [];
    for (var component in components) {
        files.push({
            expand: true,
            cwd: '../sass/3_declaration/',
            src: ["**/*_" + components[component].name + ".scss"],
            dest: '../css/components/',
            ext: '.css'
        });
    }
    return files;
}