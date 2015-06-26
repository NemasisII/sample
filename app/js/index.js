$(function () {

    $.material.init();

    $('#btnShow').hide();

    $('#btnHello').on('click',function(){
        $('#btnHello').removeClass('btn-success');
        $('#btnHello').addClass('btn-danger');
        $('#btnHello').fadeOut();
        $('#btnShow').fadeIn();

    });

    $('#btnShow').on('click',function(){
        var fruit = ['Apple','Grape','Pineapple','Orange'];
        var $table = $('#tblShow > tbody');

        $table.empty();

        $.each(fruit, function(i, v){
            var x = i + 1;
            $table.append(
                '<tr>' +
                    '<td>' + x + '</td>' +
                    '<td>' + v + '</td>' +
                    '<td>' +
                        '<button class="btn btn-danger btn-fab-danger" data-name="'+ v +'" data-action="btnRemove">' +
                        '<span class="fa fa-trash-o"></span> ลบข้อมูล' +
                        '</button>'+
                    '</td>' +
                '</tr>'
            );
        });
    });

    $(document).on('click','button[data-action="btnRemove"]',function(){
        var fruits = $(this).data('name');
        var tr = $(this).parent().parent();
        tr.fadeOut();
    });

    $('#btnNetwork').on('click',function(){

        var os = require('os');
        var interfaces = os.networkInterfaces();
        var ethernet = interfaces.en0[1];

        var ip = ethernet.address;
        var mask = ethernet.netmask;

        var crypto =  require('crypto');
        var pass = crypto.createHash('md5')
            .update('123456')
            .digest('hex');
        $('#myNetwork').empty();

        $('#myNetwork').append('IP : ' + ip + ' NetMask : ' + mask + '<br /> MD5(123456) = ' + pass);

    });

    $('#btnGetConfig').on('click',function(){
        var fse = require('fs-extra');
        var obj = {host:'localhost', user: 'sa', pass: 'sa', db: 'hos'};
        var config = fse.readJsonSync('./config.json');

        $('#txtHost').val(config.host);
        $('#txtUser').val(config.user);
        $('#txtPass').val(config.pass);
        $('#txtDb').val(config.db);
    });

    $('#btnSaveConfig').on('click',function(){
0
        var fse = require('fs-extra');
        var obj = {};
        obj.host = $('#txtHost').val();
        obj.user = $('#txtUser').val();
        obj.pass = $('#txtPass').val();
        obj.db = $('#txtDb').val();

        fse.writeJson('./config.json',obj,function(err){
            if(err) alert('Error');
            else {
                window.location = './index.html';
            }
        });


    });

    function helloWorld(fname,lname){
        alert('Hello World!! ' + fname + ' ' + lname);
    };

    $('#btnTestConfig').on('click',function(){
        alert('Test Connect');
    });

    $('#btnSayHi').on('click',function(){
        var txtFname = $('#txtFname').val();
        var txtLname = $('#txtLname').val();
        helloWorld(txtFname,txtLname);
    });

    var person = {};
    person.getTotal = function(cb){
        var db = getConnection();
        db('patient')
            .count('* as total')
            .then(function(rows){
                cb(null,rows[0].total);
            })
            .catch(function(err){
               cb(err);
            });
    };

    person.list = function(start,perpage,cb){
        var db = getConnection();
        db('patient as p')
            .select('p.hn','p.pname','p.fname','p.lname','p.sex','pttype.name','m.name as mstatus')
            .leftJoin('pttype as pttype','pttype.pttype','p.pttype')
            .leftJoin('marrystatus as m','m.code', 'p.marrystatus')
            .limit(perpage)
            .offset(start)
            .then(function(rows){
                cb(null,rows);
            })
            .catch(function(err){
                cb(err);
            })
    }


    $('#btnReport').on('click',function(){
        person.getTotal(function(err, total){
            if(err) alert('err');
            else{
                var perpage = 10;
                $(".pagination").paging(total, { // make 1337 elements navigatable
                    format: '[< ncnnn! >]', // define how the navigation should look like and in which order onFormat() get's called
                    perpage: perpage, // show 10 elements per page
                    lapping: 0, // don't overlap pages for the moment
                    page: 1, // start at page, can also be "null" or negative
                    onSelect: function (page) {
                        // add code which gets executed when user selects a page, how about $.ajax() or $(...).slice()?
                        var startRecord = this.slice[0];
                        person.list(startRecord,perpage,function(err,rows){
                            var $table = $('#tblList > tbody');
                            $table.empty();
                            var currentNumber = startRecord + 1;
                            $.each(rows,function(i, v){
                                var x = i + 1;
                                var sex = v.sex == '1' ? 'ชาย' : 'หญิง';
                                var html = '<tr>' +
                                    '<td>' + currentNumber++ + '</td>' +
                                    '<td>' + v.hn + '</td>' +
                                    '<td>' + v.pname + v.fname + '  ' + v.lname + '</td>' +
                                    '<td>' + sex + '</td>' +
                                    '<td>' + v.name + '</td>' +
                                    '<td>' + v.mstatus + '</td>' +
                                    '</tr>';
                                $table.append(html);

                            });
                        });
                    },
                    onFormat: function (type) {
                        switch (type) {
                            case 'block':

                                if (!this.active)
                                    return '<li class="disabled"><a href="">' + this.value + '</a></li>';
                                else if (this.value != this.page)
                                    return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';
                                return '<li class="active"><a href="#">' + this.value + '</a></li>';

                            case 'right':
                            case 'left':

                                if (!this.active) {
                                    return "";
                                }
                                return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';

                            case 'next':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&raquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&raquo;</a></li>';

                            case 'prev':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&laquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&laquo;</a></li>';

                            case 'first':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&lt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&lt;</a></li>';

                            case 'last':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&gt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&gt;</a></li>';

                            case 'fill':
                                if (this.active) {
                                    return '<li class="disabled"><a href="#">...</a></li>';
                                }
                        }
                        return "";
                    }
                });
            }
        });
    });

});