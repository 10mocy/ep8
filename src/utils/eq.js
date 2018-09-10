// const log = require('./log')

const request = require('sync-request')
const iconv = require('iconv-lite')
const xml2js = require('xml2js')

exports.km = () => {
  /* リクエスト用日付データ生成 */
  // const date = new Date('2018/09/08 01:28:31')
  const date = new Date()
  // const date = new Date()
  const time = date.toFormat('YYYYMMDDHH24MISS')

  /* リクエスト */
  const res = request(
    'GET',
    `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`
  )
  const body = JSON.parse(res.getBody())
  if(body.result.message === '') {
    // log(`utils.eq[km] : exist eq data`)
    return body
  }
  return false
}
  
exports.nhkeq = () => {
  return new Promise(
    resolve => {
      const res = request(
        'GET',
        'http://www3.nhk.or.jp/sokuho/jishin/data/JishinReport.xml'
      )
      const buf = Buffer.from(res.getBody())
      const nhkeqXml = iconv.decode(buf, 'Shift_JIS')
      
      xml2js.parseString(nhkeqXml, (err, result) => {
        const url = result.jishinReport.record[0].item[0].$.url
        const res = request(
          'GET',
          url
        )
        const buf = Buffer.from(res.getBody())
        const nhkeqXml = iconv.decode(buf, 'Shift_JIS')
        xml2js.parseString(nhkeqXml, (err, result) => {
          const eqData = result.Root.Earthquake[0]
          resolve(eqData)
        })
      })
    }
  )
}