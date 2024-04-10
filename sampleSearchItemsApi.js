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
require('dotenv').config();
// const process = require('process');
const app = express();
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
  } catch (err) {
      console.log(err);
  }
  res.send('get');
});

// kindle以外
const nodes =[
  "2151981051",
  "2422738051",
  "71589051",
  "71443051",
  "2221074051",
  "2221070051",
  "2131417051",
  "2221071051",
  "2131478051",
  "5519723051",
  "5267102051",
  "5267100051",
  "169911011",
  "4159907051",
  "170563011",
  "124048011",
  "16428011",
  "13938521",
  "13938481",
  "13945171",
  "2378086051",
  "2127212051",
  "160384011"
]

// twitter用 kindle以外
app.get("/search", (req, res) => {
  try {
    searchItemsRequest['BrowseNodeId'] = nodes[Math.floor(Math.random()* nodes.length)];
    api.searchItems(searchItemsRequest).then(
      function(data) {
        var responses = onSuccess(data);
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

// twitter用 kindle
function onSuccess2(data) {
  console.log('API called successfully.');
  var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
  let responses =[];
  if (searchItemsResponse['SearchResult'] !== undefined) {
    console.log(searchItemsResponse['SearchResult']['Items'].length)
    for(var i = 0; i < searchItemsResponse['SearchResult']['Items'].length; i++){
      var item_0 = searchItemsResponse['SearchResult']['Items'][i];
      if (item_0 !== undefined) {
        if (item_0['DetailPageURL'] !== undefined &&
            item_0['ItemInfo'] !== undefined &&
            item_0['ItemInfo']['Title'] !== undefined &&
            item_0['ItemInfo']['Title']['DisplayValue'] !== undefined &&
            item_0['Offers'] !== undefined &&
            item_0['Offers']['Listings'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price'] !== undefined &&
            item_0['Offers']['Listings'][0]['Price']['Amount'] !== undefined
        ) {
          var url = item_0['DetailPageURL'];
          var title = item_0['ItemInfo']['Title']['DisplayValue'];
          var price = item_0['Offers']['Listings'][0]['Price']['Amount']
          var response = {
            url:url,
            title:title,
            price:price
          }
          console.log('DetailPageURL: ' + url);
          console.log('Title: ' + title);
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

// twitter用 kindle
app.get("/search2", (req, res) => {
  try {
    const kindles =[
      "24580150051",
      "3550442051",
      "8136408051",
      "2291657051",
      "3251934051"
  ]
    searchItemsRequest['BrowseNodeId'] = kindles[Math.floor(Math.random()* kindles.length)];
    api.searchItems(searchItemsRequest).then(
      function(data) {
        var responses = onSuccess2(data);
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
            item_0['ItemInfo']['Title']['Manufacturer'] !== undefined &&
            item_0['ItemInfo']['Title']['Manufacturer']['DisplayValue'] !== undefined &&
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
          var maker = item_0['ItemInfo']['Title']['Manufacturer']['DisplayValue'];
          var image = item_0['Images']['Primary']['Medium']['URL'];
          var price = item_0['Offers']['Listings'][0]['Price']['DisplayAmount'];
          var response = {
            url:url,
            title:title,
            discount:discount,
            maker:maker,
            image:image,
            price:price,
          }
          console.log('DetailPageURL: ' + url);
          console.log('Title: ' + title);
          console.log('Discount: ' + discount);
          console.log('Maker: ' + maker);
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