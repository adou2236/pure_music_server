const cheerio = require('cheerio');
var request = require('request');
var https=require("https");
var http = require('http');
var logger = require('../modules/logger')


function getRealUrl(music_id){

    const fakeUrl = `https://www.hifini.com/thread-${music_id}.htm`
    // const fakeUrl = `http://www.7btjia.com/forum-index-fid-8.htm`
    request(fakeUrl, {
        headers:{"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit 537.36 (KHTML, like Gecko) Chrome"
}}, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            analysisPage(body);
        } else {
            logger.error('get page error url => ' + fakeUrl, err);
        }
    })
    
}



function analysisPage(body) {
    var items;
    var url;
    var $ = cheerio.load(body);
    // 抽出列表 li
    items = $('.card-body p');
    itemCount = items.length;
    items.map(function(i, item) {
        item = $(item);
    });
}

function normalRes({status=200,message='success',data={}}){
    return {
        status:status,//返回状态
        message:message,//状态描述
        data:data//具体值
    }
};


module.exports = {getRealUrl,normalRes }