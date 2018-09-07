const request = require('sync-request');
require('date-utils');

module.exports = () => {
    /* リクエスト用日付データ生成 */
    const date = new Date();
    const time = date.toFormat('YYYYMMDDHH24MISS');
  
    /* リクエスト */
    const res = request(
        'GET',
        `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/20180907181150.json`
    );
    const body = JSON.parse(res.getBody());
    if(body.result.message === '') {
        console.log(`km : exist eq data`);
        return body;
    } else {
        console.log(`km : eq data not found`);
        return false;
    }
  }