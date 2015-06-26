

    var fse = require('fs-extra');
    var getConnection = function(){
        var config = fse.readJsonSync('./config.json');
        var db = require('knex')({
            client: 'mysql',
            connection:{
                host: config.host,
                port: 3306,
                user: config.user,
                password: config.pass,
                database: config.db
            },
            debug: true

        });
        return db;
    };

