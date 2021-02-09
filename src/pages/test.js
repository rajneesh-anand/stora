import React, { useState, useEffect } from "react";
import parse from "urlencoded-body-parser";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { checkoutSuccess, checkoutFail } from "../redux/actions/checkoutAction";
import Loading from "../components/other/Loading";

export default function test({ resData }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const cartState = useSelector((state) => state.cartReducer);

  const [paytmData, setPaytmData] = useState({
    mid: "",
    orderId: "",
    txnToken: "",
  });

  const router = useRouter();

  const checkPaymentStatus = async () => {
    if (resData.STATUS === "TXN_SUCCESS") {
      setLoading(true);
      const orderdata = {
        orderId: resData.ORDERID,
        paymentId: resData.TXNID,
        amount: resData.TXNAMOUNT,
        name: "TEST NAME",
        email: "test@test.com",
        mobile: "9876543212",
        address: "shstri nagar Delhi",
        address_two: "Address 2",
        locality: "Locality",
        city: "city",
        pin: "110052",
        state: "Delhi",
        country: "India",
        order_status: "order_placed",
        items_placed: cartState,
      };

      const result = await fetch("/api/paytmsuccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderdata),
      });

      const resultJson = await result.json();
      console.log(resultJson);
      console.log(resultJson.msg);

      if (resultJson.msg === "success") {
        dispatch(
          checkoutSuccess(
            resultJson.result.orderId,
            resultJson.result.amount,
            resultJson.msg,
            resultJson.result.items
          )
        );
        router.push("/shop/checkout-success");
        // return null;
      }
    }

    if (resData.STATUS === "TXN_FAILURE") {
      setLoading(true);
      dispatch(checkoutFail(resultJson.msg));
      router.push("/shop/checkout-failed");
      // return null;
    }
  };

  // Testing email sending

  const mailer_data = {
    email: "anand.k.rajneesh@gmail.com",
    subject: "Your Order has been placed",
  };

  const sendOrderMail = async () => {
    const result = await fetch("/api/mailer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailer_data),
    });

    const resultJson = await result.json();
    console.log(resultJson);
  };

  // Email Sending End

  const handlePaytmSubmit = async () => {
    const data = {
      name: "TEST NAME",
      email: "test@test.com",
      mobile: "9876543212",
      address: "shstri nagar Delhi",
      address_two: "Address 2",
      locality: "Locality",
      city: "city",
      pin: "110052",
      state: "Delhi",
      country: "India",
      order_status: "order_placed",
      items_placed: "shirt",
    };

    const result = await fetch("/api/paytmtest", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const resultJson = await result.json();
    setPaytmData({
      mid: "zWEMTK89662017572077",
      orderId: resultJson.orderId,
      txnToken: resultJson.txnToken,
    });
    document.getElementById("redFrom").submit();
  };

  useEffect(() => {
    if (resData) {
      checkPaymentStatus();
    }
  }, [resData]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <header>
        <button className="App-link" onClick={sendOrderMail}>
          Send Mail
        </button>
        <button onClick={handlePaytmSubmit}>Paytm</button>
      </header>
      <Hiddenfrom formData={paytmData} />
    </div>
  );
}

const Hiddenfrom = ({ formData }) => {
  return (
    <div>
      <form
        id="redFrom"
        method="post"
        action={`https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${formData.mid}&orderId=${formData.orderId}`}
        name="paytm"
      >
        <input type="hidden" name="mid" value={formData.mid} />
        <input type="hidden" name="orderId" value={formData.orderId} />
        <input type="hidden" name="txnToken" value={formData.txnToken} />
      </form>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const data = await parse(req);
  return {
    props: { resData: data },
  };
}
