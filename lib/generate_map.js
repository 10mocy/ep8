require('date-utils');

const discord = require('../modules/discord');
const gm = require('gm');
const request = require('request');
const fs = require('fs');

module.exports = () => {

  const date = (new Date()).toFormat('YYYYMMDD');
  const time = (new Date()).toFormat('YYYYMMDDHH24MISS');

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

  // // 予想震度 ダウンロード
  // request(
  //   { method: 'GET', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/EstShindoImg/eew/${date}/${time}.eew.gif`, encoding: null },
  //   (error, response, body) => {
  //     if(!error && response.statusCode === 200){
  //       fs.writeFile(layer, body, 'binary', () => {
  //         // PS波 ダウンロード
  //         request(
  //           { method: 'GET', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/PSWaveImg/eew/${date}/${time}.eew.gif`, encoding: null },
  //           (error, response, body) => {
  //             if(!error && response.statusCode === 200){
  //               fs.writeFile(temp, body, 'binary', () => {
  //                 gm(layer)
  //                   .composite(temp)
  //                   .geometry('+0+0')
  //                   .quality(100)
  //                   .write(layer, err => {
  //                     if(err){
  //                       console.log(err)
  //                     }
                      // リアルタイム震度 ダウンロード
                      console.log(`http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/${date}/${time}.jma_s.gif`);
                      request(
                        { method: 'GET', url: `http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/${date}/${time}.jma_s.gif`, encoding: null },
                        (error, response, body) => {
                          if(!error && response.statusCode === 200){
                            fs.writeFile(temp, body, 'binary', () => {
                              // gm(layer)
                              //   .composite(temp)
                              //   .geometry('+0+0')
                              //   .quality(100)
                              //   .write(layer, err => {
                              //     if(err){
                              //       console.log(err)
                              //     }
                                  // ベースとレイヤー 合成　(成果物 : newPath)
                                  gm(baseImagePath)
                                    .composite(temp)
                                    .geometry('+0+0')
                                    .quality(100)
                                    .write(newPath, err => {
                                      discord.client.channels
                                      .get('487259165660545036')
                                      .send({
                                        embed: {
                                          image: {
                                               url: 'attachment://new.jpg'
                                            }
                                         },
                                         files: [{
                                            attachment: newPath,
                                            name: 'new.jpg'
                                         }]
                                      });
                                      if(err){
                                        console.log(err)
                                      }
                                    });
                              }); 
                          }
                        }
                      );
      //               });
      //           });
      //         }
      //       }
      //     );
      //   });
      // }
  //   }
  // );

}