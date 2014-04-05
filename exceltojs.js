/*
 *  date: 2014/04/05
 *  author: senli
 *  comment: 转换language.xlsx为language.js
 * */

var fs = require('fs');
var xlsx = require('node-xlsx');
var _  = require('underscore');
var child = require('child_process');
ls = child.exec('logname');

ls.stdout.on('data',function(data){
  var usr_name = data.replace(/\r|\n/g,'');
  //path lauguage.xlsx
  var __dirname = '';
  var file_buffer = fs.readFileSync(__dirname + './lauguage.xlsx');
  var xlsx_file_obj = xlsx.parse( file_buffer ); 

  var json = {"values": []};
  var values = json.values;
  _.each(xlsx_file_obj.worksheets, function(sheet, index){
    var sheet_data = sheet.data;
    if(index > 0)return;
    try{
      _.each(sheet_data, function(row, row_index ){
        //如果第一列的值不为空
        if(row_index > 0){
            var obj = {};
            var value = _.isObject(row[0]) ? row[0].value:'',
            comment = _.isObject(row[1]) ? row[1].value:'',
            translation = _.isObject(row[2]) ? row[2].value:'';
            obj.value = value;
            obj.comment = comment;
            obj.translation = translation;
            values.push(obj);
        }
      });
    }catch(e){
      console.log( e.message );
    }
  });
  var option = {
    flags:'w',
    encodeing:'utf-8',
    mode:'0666'
  };
  var fw_stream_cn = fs.createWriteStream( __dirname + './lauguage.js',option);
  fw_stream_cn.write( 'var Languages = {};(function(){ Languages.zhcn = ' + JSON.stringify(json) + '})();');
});
