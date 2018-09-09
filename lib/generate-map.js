require('date-utils')

const async = require('async')
const gm = require('gm')
const request = require('request')
const fs = require('fs')

module.exports = () => new Promise(resolve => {
  // const dt = new Date('2018/09/08 01:28:31')
  const dt = new Date()
  const date = dt.toFormat('YYYYMMDD')
  const time = dt.toFormat('YYYYMMDDHH24MISS')
  console.log(date, time)

  const tempDir = './temp'
  const tempImage = `${tempDir}/layer.gif`
  const eqImage = `${tempDir}/eq.gif`

  const imagepathArary = [
    {name: 'base', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/CommonImg/base_map_w.gif', path: `${tempDir}/base.gif`},
    {name: 'estshindo', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/EstShindoImg/eew/${date}/${time}.eew.gif', path: `${tempDir}/estshindo.gif`},
    {name: 'ps', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/PSWaveImg/eew/${date}/${time}.eew.gif', path: `${tempDir}/ps.gif`},
    {name: 'rtshindo', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/${date}/${time}.jma_s.gif', path: `${tempDir}/rtshindo.gif`}
  ]

  // ダウンロード
  async.each(imagepathArary, (image, callback) => {
    request(
      { method: 'GET', url: image.url, encoding: null },
      (error, response, body) => {
        if(!error && response.statusCode === 200){
          console.log(`lib.generate_map : downloaded ${image.name}`)
          fs.writeFileSync(image.path, body, 'binary')
          callback()
        }
      }
    )
  },
  () => {
  // 合成
    gm(imagepathArary[1].path)
      .resize('352', '400')
      .composite(imagepathArary[2].path)
      .geometry('+0+0')
      .quality(100)
      .write(tempImage, err => {
        console.log('lib.generate_map : composited estshindo + ps')
        if(err) {
          console.log(err)
        }
        gm(tempImage)
          .composite(imagepathArary[3].path)
          .resize('352', '400')
          .geometry('+0+0')
          .quality(100)
          .write(tempImage, err => {
            console.log('lib.generate_map : composited layer + rtshindo')
            if(err) {
              console.log(err)
            }
            gm(imagepathArary[0].path)
              .composite(tempImage)
              .resize('352', '400')
              .geometry('+0+0')
              .quality(100)
              .write(eqImage, err => {
                console.log('lib.generate_map : composited base + layer')
                if(err) {
                  console.log(err)
                }
                imagepathArary.forEach(image => {
                  fs.unlink(image.path, err => {
                    if(err) {
                      console.log(err)
                    }
                  })
                })
                fs.unlink(tempImage, err => {
                  console.log('lib.generate_map : unlinked')
                  if(err) {
                    console.log(err)
                  }
                })
                console.log('lib.generate_map : done!')
                resolve(eqImage)
              })
          })
      })
  })

})