const request = require('sync-request');
const iconv = require('iconv-lite');
const xml2js = require("xml2js");

exports.km = () => {
  /* リクエスト用日付データ生成 */
  const date = new Date();
  const time = date.toFormat('YYYYMMDDHH24MISS');

  /* リクエスト */
  const res = request(
    'GET',
    `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`
  );
  const body = JSON.parse(res.getBody());
  if(body.result.message === '') {
    // console.log(`km : exist eq data`);
    return body;
  } else {
    // console.log(`km : eq data not found`);
    return false;
  }
}
  
exports.nhkeq = () => {
  return new Promise(
    (resolve, reject) => {
      const res = request(
        'GET',
        'http://www3.nhk.or.jp/sokuho/jishin/data/JishinReport.xml'
      );
      const buf = new Buffer(res.getBody(), 'binary');
      const nhkeq_xml = iconv.decode(buf, 'Shift_JIS');
      xml2js.parseString(nhkeq_xml, (err, result) => {
        const url = result.jishinReport.record[0].item[0].$.url;
        const res = request(
          'GET',
          url
        );
        const buf = new Buffer(res.getBody(), 'binary');
        const nhkeq_xml = iconv.decode(buf, 'Shift_JIS');
        xml2js.parseString(nhkeq_xml, (err, result) => {
          const eq_data = result.Root.Earthquake[0];
          resolve(eq_data);
        });
      });
    }
  );
}