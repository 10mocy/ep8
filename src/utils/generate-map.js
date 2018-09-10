require('date-utils')

const log = require('./log')

const async = require('async')
const gm = require('gm')
const request = require('request')
const fs = require('fs')

module.exports = () => new Promise(resolve => {
  // const dt = new Date('2018/09/08 01:28:31')
  const dt = new Date()
  dt.setSeconds(dt.getSeconds() -3)
  const date = dt.toFormat('YYYYMMDD')
  const time = dt.toFormat('YYYYMMDDHH24MISS')
  log(date, time)

  const tempDir = './temp'
  const tempImage = `${tempDir}/layer.gif`
  const eqImage = `${tempDir}/eq.gif`

  const imagepathArary = [
    {name: 'base', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/CommonImg/base_map_w.gif', path: `${tempDir}/base.gif`},
    {name: 'estshindo', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/EstShindoImg/eew/${date}/${time}.eew.gif`, path: `${tempDir}/estshindo.gif`},
    {name: 'ps', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/PSWaveImg/eew/${date}/${time}.eew.gif`, path: `${tempDir}/ps.gif`},
    {name: 'acmap', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/acmap_s/${date}/${time}.acmap_s.gif`, path: `${tempDir}/acmap.gif`}
  ]

  // ダウンロード
  async.each(imagepathArary, (image, callback) => {
    request(
      { method: 'GET', url: image.url, encoding: null },
      (error, response, body) => {
        if(!error && response.statusCode === 200){
          log(`utils.generate-map : downloaded ${image.name}`)
          fs.writeFileSync(image.path, body, 'binary')
          callback()
        } else {
          console.log(`utils.generate-map : downloaded error ${image.name} (${response.statusCode}) (${image.url})`)
          log(`utils.generate-map : downloaded error ${image.name} (${response.statusCode}) (${image.url})`)
        }
      }
    )
  },
  () => {
  // 合成
    gm(imagepathArary[1].path)
      .resize('352', '400')
      .composite(imagepathArary[3].path)
      .geometry('+0+0')
      .quality(100)
      .write(tempImage, err => {
        log('utils.generate-map : composited estshindo + acmap')
        if(err) {
          log(err)
        }
        gm(tempImage)
          .composite(imagepathArary[2].path)
          .resize('352', '400')
          .geometry('+0+0')
          .quality(100)
          .write(tempImage, err => {
            log('utils.generate-map : composited layer + ps')
            if(err) {
              log(err)
            }
            gm(imagepathArary[0].path)
              .composite(tempImage)
              .resize('352', '400')
              .geometry('+0+0')
              .quality(100)
              .write(eqImage, err => {
                log('utils.generate-map : composited base + layer')
                if(err) {
                  log(err)
                }
                imagepathArary.forEach(image => {
                  fs.unlink(image.path, err => {
                    if(err) {
                      log(err)
                    }
                  })
                })
                fs.unlink(tempImage, err => {
                  log('utils.generate-map : unlinked')
                  if(err) {
                    log(err)
                  }
                })
                log('utils.generate-map : done!')
                resolve(true, eqImage)
              })
          })
      })
  })

})