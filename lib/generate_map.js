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

  const temp_dir = './temp'
  const temp_image = `${temp_dir}/layer.gif`
  const eq_image = `${temp_dir}/eq.gif`

  const imagepath_arary = [
    {name: 'base', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/CommonImg/base_map_w.gif', path: `${temp_dir}/base.gif`},
    {name: 'estshindo', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/EstShindoImg/eew/${date}/${time}.eew.gif', path: `${temp_dir}/estshindo.gif`},
    {name: 'ps', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/PSWaveImg/eew/${date}/${time}.eew.gif', path: `${temp_dir}/ps.gif`},
    {name: 'rtshindo', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/${date}/${time}.jma_s.gif', path: `${temp_dir}/rtshindo.gif`}
  ]

  // ダウンロード
  async.each(imagepath_arary, (image, callback) => {
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
    gm(imagepath_arary[1].path)
      .resize('352', '400')
      .composite(imagepath_arary[2].path)
      .geometry('+0+0')
      .quality(100)
      .write(temp_image, err => {
        console.log('lib.generate_map : composited estshindo + ps')
        if(err) {
          console.log(err)
        }
        gm(temp_image)
          .composite(imagepath_arary[3].path)
          .resize('352', '400')
          .geometry('+0+0')
          .quality(100)
          .write(temp_image, err => {
            console.log('lib.generate_map : composited layer + rtshindo')
            if(err) {
              console.log(err)
            }
            gm(imagepath_arary[0].path)
              .composite(temp_image)
              .resize('352', '400')
              .geometry('+0+0')
              .quality(100)
              .write(eq_image, err => {
                console.log('lib.generate_map : composited base + layer')
                if(err) {
                  console.log(err)
                }
                imagepath_arary.forEach(image => {
                  fs.unlink(image.path, function (err) {
                    if(err) {
                      console.log(err)
                    }
                  })
                })
                fs.unlink(temp_image, function (err) {
                  console.log('lib.generate_map : unlinked')
                  if(err) {
                    console.log(err)
                  }
                })
                console.log('lib.generate_map : done!')
                resolve(eq_image)
              })
          })
      })
  })

})