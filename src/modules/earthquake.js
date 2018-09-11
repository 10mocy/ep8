const EventEmitter = require('events').EventEmitter

require('date-utils')
const request = require('sync-request')
const iconv = require('iconv-lite')
const xml2js = require('xml2js')

/**
 * 地震情報を受信する
 */
module.exports = class Earthquake extends EventEmitter {

  constructor() {

    super()

    this.existKyoshin = { }
    this.existNHK = [ ]
    this.startupTime = (new Date()).toFormat('YYYYMMDDHH24MISS')

  }

  start() {

    const self = this

    setInterval(() => self._kyoshin(), 500)
    setInterval(() => self._nhk(), 1500)

    this.emit('start')

  }

  _kyoshin() {

    const date = new Date()
    const time = date.toFormat('YYYYMMDDHH24MISS')

    const res = request(
      'GET',
      `http://www.kmoni.bosai.go.jp/new/webservice/hypo/eew/${time}.json`
    )
    const body = JSON.parse(res.getBody())

    if(body.result.message === '') {
      
      // 過去に同じ地震(report_id)がなかった時の処理
      if(!(body.report_id in this.existKyoshin)) {
        this.existKyoshin[body.report_id] = []
      }

      // 過去に同じ報(report_num)を処理していたらスキップする
      if(this.existKyoshin[body.report_id].indexOf(body.report_num) !== -1) return
      this.existKyoshin[body.report_id].push(body.report_id)

      // データをエミットする
      this.emit('kyoshin', body)

    }

  }

  _nhk() {

    const res = request(
      'GET',
      'http://www3.nhk.or.jp/sokuho/jishin/data/JishinReport.xml'
    )
    const buf = Buffer.from(res.getBody())
    const nhkeqXml = iconv.decode(buf, 'Shift_JIS')

    xml2js.parseString(nhkeqXml, (err, result) => {

      const url = result.jishinReport.record[0].item[0].$.url
      const res = request('GET', url)
      const buf = Buffer.from(res.getBody())
      const nhkeqXml = iconv.decode(buf, 'Shift_JIS')

      xml2js.parseString(nhkeqXml, (err, result) => {

        const eqData = result.Root.Earthquake[0]
        const eqDetailData = eqData.$
        const eqTime = (new Date(eqDetailData.Time)).toFormat('YYYYMMDDHH24MISS')

        // 起動時間の前に発表された情報をスキップする
        if(eqTime < this.startupTime) return

        // データがベータ情報だったらスキップする
        // (震源情報が空文字列になっていることを利用している)
        if(eqDetailData.Epicenter === '') return

        // 過去に同じ地震(eqData.$.Id)を処理していたらスキップする
        if(this.existNHK.indexOf(eqDetailData.Id) !== -1) return
        this.existNHK.push(eqDetailData.Id)

        this.emit('nhk', eqData)

      })

    })

  }

}
