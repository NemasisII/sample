$(function(){

    var getReport = function(start, end, cb){
        var db = getConnection();
        var sql = 'select o.icd10, icd.name,' +
            'count(*) as total ' +
            'from ovstdiag as o ' +
            'left join icd101 as icd on icd.code = o.icd10 ' +
            'where o.vstdate between ? and ? ' +
            'group by o.icd10 ' +
            'order by total desc limit ? ';
        db.raw(sql,[start, end, 10])
            .then(function(rows){
                cb(null,rows[0])
            })
            .catch(function(err){
                cb(err);
            })
    };

    $('#btnShow').on('click',function(err){

        var startDate = $('#txtStartDate').val();
        var endDate = $('#txtEndDate').val();

        getReport(startDate,endDate,function(err, rows){
            if(err) console.log(err);
            else{
                var config = {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: '10 อันดับโรค'
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: 'ครั้งที่รับบริการ'
                        }
                    },
                    series: [{
                        name: 'ครั้ง',
                        data: []
                    }]
                };
                var config2 = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '10 อันดับโรค'
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: 'ครั้งที่รับบริการ'
                        }
                    },
                    series: [{
                        name: 'ครั้ง',
                        data: []
                    }]
                };
                config.xAxis.categories = [];
                config.series[0].data = [];

                config2.xAxis.categories = [];
                config2.series[0].data = [];

                $.each(rows,function(i, v){
                    config.xAxis.categories.push(v.icd10);
                    config.series[0].data.push(v.total);
                    config2.xAxis.categories.push(v.icd10);
                    config2.series[0].data.push(v.total);
                });

                $('#chart1').highcharts(config);

                $('#chart2').highcharts(config2);

            }
        });

    });

});