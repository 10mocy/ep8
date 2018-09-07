const request = require('sync-request');
const iconv = require('iconv-lite');
const xml2js = require("xml2js");

module.exports = () => {
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