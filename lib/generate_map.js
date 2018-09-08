const gm = require('gm');
const request = require('request');
const fs = require('fs');
module.exports = () => {

  const baseImagePath = `./temp/base-${Math.random()*100}.gif`;
  const tmpImagePath = './temp/';
  const newPath = './temp/new.gif';

  // ベース画像 ダウンロード
  request(
    { method: 'GET', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/CommonImg/base_map_w.gif', encoding: null },
    (error, response, body) => {
      if(!error && response.statusCode === 200){
        fs.writeFileSync(baseImagePath, body, 'binary');
      }
    }
  );
  
  const layer = `${tmpImagePath}layer-${Math.random()*100}.gif`;

  const temp = `${tmpImagePath}${Math.random()*100}.gif`;
  // 予想震度 ダウンロード
  request(
    { method: 'GET', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/EstShindoImg/eew/20180908/20180908012831.eew.gif', encoding: null },
    (error, response, body) => {
      if(!error && response.statusCode === 200){
        fs.writeFile(layer, body, 'binary', () => {
          // PS波 ダウンロード
          request(
            { method: 'GET', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/PSWaveImg/eew/20180908/20180908012831.eew.gif', encoding: null },
            (error, response, body) => {
              if(!error && response.statusCode === 200){
                fs.writeFile(temp, body, 'binary', () => {
                  gm(layer)
                    .composite(temp)
                    .geometry('+0+0')
                    .quality(100)
                    .write(layer, err => {
                      if(err){
                        console.log(err)
                      }
                      // リアルタイム震度 ダウンロード
                      request(
                        { method: 'GET', url: 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/20180908/20180908122718.jma_s.gif', encoding: null },
                        (error, response, body) => {
                          if(!error && response.statusCode === 200){
                            fs.writeFile(temp, body, 'binary', () => {
                              gm(layer)
                                .composite(temp)
                                .geometry('+0+0')
                                .quality(100)
                                .write(layer, err => {
                                  if(err){
                                    console.log(err)
                                  }
                                  // ベースとレイヤー 合成
                                  gm(baseImagePath)
                                    .composite(layer)
                                    .geometry('+0+0')
                                    .quality(100)
                                    .write(newPath, err => {
                                      if(err){
                                        console.log(err)
                                      }
                                    });
                                });
                            });
                          }
                        }
                      );
                    });
                });
              }
            }
          );
        });
      }
    }
  );

}