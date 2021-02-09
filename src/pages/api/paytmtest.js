const Paytm = require("paytm-pg-node-sdk");

export default async function handler(req, res) {
  //   var reqBody = JSON.parse(req.body);
  const { name, email, mobile, address, pin, amount } = req.body;

  try {
    var env = Paytm.LibraryConstants.STAGING_ENVIRONMENT;

    var mid = "zWEMTK89662017572077";
    var key = "4GNIZVo6#kP6FYhF";
    var website = "WEBSTAGING";
    //   var client_id = "C15";

    var callbackUrl = "https://stora-eight.vercel.app/shop/checkout";

    Paytm.MerchantProperties.setCallbackUrl(callbackUrl);
    Paytm.MerchantProperties.setCallbackUrl(callbackUrl);

    Paytm.MerchantProperties.initialize(env, mid, key, website);
    // If you want to add log file to your project, use below code
    Paytm.Config.logName = "[PAYTM]";
    Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
    Paytm.Config.logfile = "/path/log/file.log";

    var orderId = "RSGI" + Math.floor(Math.random(6) * 1000000);
    var channelId = Paytm.EChannelId.WEB;
    var txnAmount = Paytm.Money.constructWithCurrencyAndValue(
      Paytm.EnumCurrency.INR,
      amount
    );
    var userInfo = new Paytm.UserInfo(email);
    userInfo.setAddress(address);
    userInfo.setEmail(email);
    userInfo.setFirstName(name);
    userInfo.setMobile(mobile);
    userInfo.setPincode(pin);

    var goodsInfo = new Paytm.GoodsInfo();
    goodsInfo.setMerchantGoodsId("goods_id1");
    goodsInfo.setMerchantShippingId("shipping_id1");
    goodsInfo.setSnapshotUrl("snapshot_url");
    goodsInfo.setDescription("desc");
    goodsInfo.setCategory("category");
    goodsInfo.setQuantity("qty");
    goodsInfo.setUnit("unit");
    goodsInfo.setPrice(
      Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, "1.00")
    );

    var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(
      channelId,
      orderId,
      txnAmount,
      userInfo
    );

    var paymentDetail = paymentDetailBuilder.build();

    Paytm.Payment.createTxnToken(paymentDetail).then((response) => {
      if (response instanceof Paytm.SDKResponse) {
        console.log("\nRaw Response:\n", response.getJsonResponse());
      }

      console.log(
        "\nRESPONSE RECEIVED IN DEMOAPP: ",
        response.getResponseObject()
      );
      const txnToken = response.getResponseObject().body.txnToken;
      res.send({ txnToken: txnToken, orderId: orderId });
    });
  } catch (e) {
    console.log("Exception caught: ", e);
    Paytm.LoggingUtil.addLog(
      Paytm.LoggingUtil.LogLevel.INFO,
      "DemoApp",
      "Exception caught: ",
      e
    );
    return Promise.reject(e);
  }
}
