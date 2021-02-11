const https = require("https");
const path = require("path");
const fs = require("fs");
const PaytmChecksum = require("../../paytm/cheksum");
const PaytmConfig = require("../../paytm/config");

export default async function handler(req, res) {
  console.log(req.body);
  const { email, amount } = req.body;

  var orderId = "RSGI" + Math.floor(Math.random(6) * 1000000);

  const paytmParams = {};

  paytmParams.body = {
    requestType: "Payment",
    mid: PaytmConfig.PaytmConfig.mid,
    websiteName: PaytmConfig.PaytmConfig.website,
    orderId: orderId,
    callbackUrl: "http://localhost:3000/shop/checkout",
    txnAmount: {
      value: amount,
      currency: "INR",
    },
    userInfo: {
      custId: email,
    },
  };

  PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    PaytmConfig.PaytmConfig.key
  ).then(function (checksum) {
    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {
      /* for Staging */
      hostname: "securegw-stage.paytm.in",

      /* for Production */
      // hostname: 'securegw.paytm.in',

      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${PaytmConfig.PaytmConfig.mid}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on("data", function (chunk) {
        response += chunk;
      });

      post_res.on("end", function () {
        response = JSON.parse(response);
        // console.log("txnToken:", response);
        const txnToken = response.body.txnToken;
        // console.log(txnToken);
        res.send({ txnToken: txnToken, orderId: orderId });
      });
    });

    post_req.write(post_data);
    post_req.end();
  });
}
