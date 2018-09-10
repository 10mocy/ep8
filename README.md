# ep8
> 揺れが来る前に知る、備える。

## 特徴
- オープンソースのDiscord Bot
- 簡単に導入できる
- Twitterに依存しない地震速報

## 導入方法
### オンプレミスで使用する場合
1. [Release](https://github.com/neiropw/ep8/releases)から最新の安定板をダウンロード
1. 任意のディレクトリに配置し、`npm install`を実行
1. `config/discord.example.js`をコピーし、`config/discord.js`を作成
1. [Discord Developers Portal](https://discordapp.com/developers/applications/)で生成したトークンを所定の場所に記入
1. チャンネル定義情報を記入
1. ディレクトリに移動し、`node src/app`を実行

## 謝辞
### データ利用
- 地震速報の受信には、[国立研究開発法人防災科学技術研究所](http://www.bosai.go.jp/)のデータを使用しています。
- NHK地震速報の受信には、[NHK地震情報](http://www3.nhk.or.jp/sokuho/jishin/)を利用しています。
    - 参考 : [NHKの地震情報を掻っ攫う方法 - Qiita](https://qiita.com/ot1r/items/aff63d49273ef8be5993)

## 開発協力
- [音色ねいろ(nirot1r)](https://github.com/nirot1r)
