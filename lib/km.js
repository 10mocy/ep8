const request = require('request');
require('date-utils');

module.exports = () => {
    /* リクエスト用日付データ生成 */
    const date = new Date();
    const time = date.toFormat('YYYYMMDDHH24MISS');
  
    /* リクエスト用データ作成 */
    const options = {
      url: `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`,
      method: 'GET',
      json: true
    }
  
    /* リクエスト */
    request(options, (error, response, body) => {
      if(body.result.message === '') {
        return body;
      } else {
        return false;
      }
    });
  }