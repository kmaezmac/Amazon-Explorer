/**
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Run `npm install` locally before executing following code with `node sampleSearchItemsApi.js`

/**
 * This sample code snippet is for ProductAdvertisingAPI 5.0's SearchItems API
 * For more details, refer:
 * https://webservices.amazon.com/paapi5/documentation/search-items.html
 */
const express = require('express'); 
const cors = require('cors'); // ← 追加
require('dotenv').config();
// const process = require('process');
const app = express();
app.use(cors()); // ← CORSを許可
var ProductAdvertisingAPIv1 = require('./src/index');

var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

defaultClient.accessKey = process.env.ACCESS_KEY;
defaultClient.secretKey = process.env.SECRET_KEY;

/**
 * PAAPI Host and Region to which you want to send request.
 * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
 */
defaultClient.host = process.env.HOST;
defaultClient.region = process.env.REGION;

var api = new ProductAdvertisingAPIv1.DefaultApi();

// Request Initialization

var searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

/** Enter your partner tag (store/tracking id) and partner type */
searchItemsRequest['PartnerTag'] =  process.env.PARTNER_TAG;
searchItemsRequest['PartnerType'] = 'Associates';

/** Specify Keywords */
// searchItemsRequest['Keywords'] = 'Harry Potter';

/**
 * Specify the category in which search request is to be made
 * For more details, refer: https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
 */
// searchItemsRequest['SearchIndex'] = 'Books';

/** Specify item count to be returned in search result */
searchItemsRequest['ItemCount'] = 10;

searchItemsRequest['SortBy'] = "Featured";
/**
 * Choose resources you want from SearchItemsResource enum
 * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
 */
searchItemsRequest['Resources'] = ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price'];

// twitter用 kindle以外
function onSuccess(data) {
  console.log('API called successfully.');
  var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
  let responses =[];
  // console.log('Complete Response: \n' + JSON.stringify(searchItemsResponse, null, 1));
  if (searchItemsResponse['SearchResult'] !== undefined) {
    console.log(searchItemsResponse['SearchResult']['Items'].length)
    // console.log('Printing First Item Information in SearchResult:');
    for(var i = 0; i < searchItemsResponse['SearchResult']['Items'].length; i++){
      var item_0 = searchItemsResponse['SearchResult']['Items'][i];
      if (item_0 !== undefined) {
        // if (item_0['ASIN'] !== undefined) {
        //   console.log('ASIN: ' + item_0['ASIN']);
        // }
        if (item_0['DetailPageURL'] !== undefined &&
            item_0['ItemInfo'] !== undefined &&
            item_0['ItemInfo']['Title'] !== undefined &&
            item_0['ItemInfo']['Title']['DisplayValue'] !== undefined &&
            item_0['Offers'] !== undefined &&
            item_0['Offers']['Listings'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['Savings'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['Savings']['Percentage'] !== undefined
        ) {
          var url = item_0['DetailPageURL'];
          var title = item_0['ItemInfo']['Title']['DisplayValue'];
          var percentage = item_0['Offers']['Listings'][0]['Price']['Savings']['Percentage']
          var response = {
            url:url,
            title:title,
            percentage:percentage
          }
          console.log('DetailPageURL: ' + url);
          console.log('Title: ' + title);
          console.log('Percentage: ' + percentage);
          responses.push(response);
        }
      }
    }
  }
  if (searchItemsResponse['Errors'] !== undefined) {
    console.log('Errors:');
    console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
    console.log('Printing 1st Error:');
    var error_0 = searchItemsResponse['Errors'][0];
    console.log('Error Code: ' + error_0['Code']);
    console.log('Error Message: ' + error_0['Message']);
  }
  return responses;
}

function onError(error) {
  console.log('Error calling PA-API 5.0!');
  console.log('Printing Full Error Object:\n' + JSON.stringify(error, null, 1));
  console.log('Status Code: ' + error['status']);
  if (error['response'] !== undefined && error['response']['text'] !== undefined) {
    console.log('Error Object: ' + JSON.stringify(error['response']['text'], null, 1));
  }
}

app.get("/", (req, res) => {
  try {
      console.log("ログ定期実行")
      res.status(200).json({ message: "ok" });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "API error", detail: error });
  }
});

// kindle以外
const nodes =[
  "2151981051", //ノートパソコン
  "2422738051", //コーヒー・紅茶・お茶・粉末ドリンク
  "71589051", //ビール・発泡酒
  "71443051", //水・ミネラルウォーター
  "2221074051", //メンズバッグ・財布
  "2221070051", //メンズシューズ
  "2131417051", //メンズ服＆ファッション小物
  "2221071051", //レディースシューズ
  "2131478051", //レディース服
  "5519723051", //レディースジュエリー
  "5267102051", //ヘアケア・カラー・スタイリング
  "5267100051", //スキンケア・ボディケア
  "169911011", //衛生用品・ヘルスケア
  "4159907051", //コンタクトレンズ・メガネ
  "170563011", //日用品
  "124048011", //家電
  "16428011", //家具
  "13938521", //食器・グラス・カトラリー
  "13938481", //キッチン用品
  "13945171", //バス・トイレ・洗面用品
  "2378086051", //寝具
  "2127212051", //ペット用品
  "160384011", //ドラッグストア
  "2188762051", //パソコン
  "2151982051", //ディスプレイ
  "2151996051", //無線・有線LANルーター
  "2152014051", //タブレット
  "6747004051", //ゲーミングパソコン
  "2151978051", //マウス
  "2151977051", //パスコン用キーボード
  "333009011", //メンズ腕時計
  "344845011", //ベビー＆マタニティ
  "561958", //DVD
  "562020", //アニメ
  "637394", //ゲーム
  "13299531", //おもちゃ
  "2277721051", //ホビー
  "2123629051", //楽器・音響機器
  "680359011", //男性アイドル
  "2408695051", //Amazonデバイス
  "2275256051", //Kindle本
  "637644", //ビジネス・オフィス用ソフト
  "637666", //オペレーティングシステム
  "689132", //PCゲーム
  "2189604051", //カードゲーム・トランプ
  "14315441", //ゴルフ
  "14315411", //アウトドア洋品
  "14315451", //サッカー・フットサル用品
  "87805051", //野球用品
  "14315521", //釣り
  "2201158051", //登山・クライミング用品
  "14315501", //フィットネス・トレーニング
  "2129358051", //J-POP
  "2129364051", //ヒップホップ
  "13945061", //インテリア
  "10391353051", //プラモデル・模型
  "3113755051", //アイドル・芸能人グッズ
  "2189388051", //アニメ・萌えグッズ
  "2189356051", //フィギュア・コレクタードール
  "2130105051", //カラオケ機器
  "89088051", //筆記具
  "89084051", //オフィス家具・収納
  "89086051", //オフィス機器
  "2496781051", //デジタル文具
  "89085051", //ノート・紙製品
  "3187998051", //ファイル・バインダー
  "89083051", //事務用品
  "89202051", //印鑑・スタンプ
  "89087051", //学習用品
  "89089051", //封筒・はがき・レター用品
  "89090051", //手帳・カレンダー
  "89443051", //梱包材
  "13384021", //雑誌
  "466296", //エンターテイメント
  "2748677051", //カレンダー
  "466298", //コンピュータ・IT
  "500592", //タレント写真集
  "492152", //ノンフィクション
  "466282", //ビジネス・経済
  "492054", //投資・金融・会社経営
  "3148931", // 教育・学参・受験
  "466290", //科学・テクノロジー
  "466302", //語学・辞事典・年鑑
  "492228", //資格・検定
  "2045111051", //洗車・お手入れ用品
  "2045022051", //カーアクセサリ
  "2129987051", //ピアノ・キーボード
  "2130095051", //DJ機材
  "2129862051", //ギター

]

// twitter用 kindle以外
app.get("/search", (req, res) => {
  try {
    searchItemsRequest['BrowseNodeId'] = nodes[Math.floor(Math.random()* nodes.length)];
    api.searchItems(searchItemsRequest).then(
      function(data) {
        var responses = onSuccess(data);
        var randomResponse = responses[Math.floor(Math.random() * (responses.length))];
        if(randomResponse == undefined
          || randomResponse.percentage == undefined
          || randomResponse.url == undefined
          || randomResponse.title == undefined
        )
        {
          return;
        }
        var tweetText = "【" + randomResponse.percentage +"%オフ" + "】 " + randomResponse.url + randomResponse.title.substring(0,90) + " #タイムセール #Amazon #PR"
        var response = {
          tweetText:tweetText
        }
        res.send(JSON.stringify(response));
      },
      function(error) {
        onError(error);
      }
    );
  } catch (err) {
      console.log(err);
  }
});

// twitter用 kindle
// function onSuccess2(data) {
//   console.log('API called successfully.');
//   var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
//   let responses =[];
//   if (searchItemsResponse['SearchResult'] !== undefined) {
//     console.log(searchItemsResponse['SearchResult']['Items'].length)
//     for(var i = 0; i < searchItemsResponse['SearchResult']['Items'].length; i++){
//       var item_0 = searchItemsResponse['SearchResult']['Items'][i];
//       if (item_0 !== undefined) {
//         if (item_0['DetailPageURL'] !== undefined &&
//             item_0['ItemInfo'] !== undefined &&
//             item_0['ItemInfo']['Title'] !== undefined &&
//             item_0['ItemInfo']['Title']['DisplayValue'] !== undefined &&
//             item_0['Offers'] !== undefined &&
//             item_0['Offers']['Listings'] !== undefined &&
//             item_0['Offers']['Listings'][0]['Price'] !== undefined &&
//             item_0['Offers']['Listings'][0]['Price']['Amount'] !== undefined
//         ) {
//           var url = item_0['DetailPageURL'];
//           var title = item_0['ItemInfo']['Title']['DisplayValue'];
//           var price = item_0['Offers']['Listings'][0]['Price']['Amount']
//           var response = {
//             url:url,
//             title:title,
//             price:price
//           }
//           console.log('DetailPageURL: ' + url);
//           console.log('Title: ' + title);
//           console.log('Price: ' + price);
//           responses.push(response);
//         }
//       }
//     }
//   }
//   if (searchItemsResponse['Errors'] !== undefined) {
//     console.log('Errors:');
//     console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
//     console.log('Printing 1st Error:');
//     var error_0 = searchItemsResponse['Errors'][0];
//     console.log('Error Code: ' + error_0['Code']);
//     console.log('Error Message: ' + error_0['Message']);
//   }
//   return responses;
// }

// twitter用 kindle
// app.get("/search2", (req, res) => {
//   try {
//     const kindles =[
//       "24580150051",
//       "3550442051",
//       "8136408051",
//       "2291657051",
//       "3251934051"
//   ]
//     searchItemsRequest['BrowseNodeId'] = kindles[Math.floor(Math.random()* kindles.length)];
//     api.searchItems(searchItemsRequest).then(
//       function(data) {
//         var responses = onSuccess2(data);
//         res.send(JSON.stringify(responses));
//       },
//       function(error) {
//         onError(error);
//       }
//     );
//   } catch (err) {
//       console.log(err);
//   }
// });

// ブログ用 kindle以外
function onSuccess3(data) {
  console.log('API called successfully.');
  var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
  let responses =[];
  if (searchItemsResponse['SearchResult'] !== undefined) {
    console.log(searchItemsResponse['SearchResult']['Items'].length)
    for(var i = 0; i < searchItemsResponse['SearchResult']['Items'].length; i++){
      var item_0 = searchItemsResponse['SearchResult']['Items'][i];
      if (item_0 !== undefined) {
        if (item_0['DetailPageURL'] !== undefined &&
            item_0['Images'] !== undefined &&
            item_0['Images']['Primary'] !== undefined &&
            item_0['Images']['Primary']['Medium'] !== undefined &&
            item_0['Images']['Primary']['Medium']['URL'] !== undefined &&
            item_0['ItemInfo'] !== undefined &&
            item_0['ItemInfo']['Title'] !== undefined &&
            item_0['ItemInfo']['Title']['DisplayValue'] !== undefined &&
            item_0['Offers'] !== undefined &&
            item_0['Offers']['Listings'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['DisplayAmount'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['Savings'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['Savings']['DisplayAmount'] !== undefined
        ) {
          var url = item_0['DetailPageURL'];
          var title = item_0['ItemInfo']['Title']['DisplayValue'];
          var discount = item_0['Offers']['Listings'][0]['Price']['Savings']['DisplayAmount'];
          var image = item_0['Images']['Primary']['Medium']['URL'];
          var price = item_0['Offers']['Listings'][0]['Price']['DisplayAmount'];
          var response = {
            url:url,
            title:title,
            discount:discount,
            image:image,
            price:price,
          }
          console.log('DetailPageURL: ' + url);
          console.log('Title: ' + title);
          console.log('Discount: ' + discount);
          console.log('Image: ' + image);
          console.log('Price: ' + price);
          responses.push(response);
        }
      }
    }
  }
  if (searchItemsResponse['Errors'] !== undefined) {
    console.log('Errors:');
    console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
    console.log('Printing 1st Error:');
    var error_0 = searchItemsResponse['Errors'][0];
    console.log('Error Code: ' + error_0['Code']);
    console.log('Error Message: ' + error_0['Message']);
  }
  return responses;
}

// ブログ用 kindle以外
app.get("/search3", (req, res) => {
  try {
    searchItemsRequest['BrowseNodeId'] = nodes[Math.floor(Math.random()* nodes.length)];
    api.searchItems(searchItemsRequest).then(
      function(data) {
        var responses = onSuccess3(data);
        res.send(JSON.stringify(responses));
      },
      function(error) {
        onError(error);
      }
    );
  } catch (err) {
      console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);