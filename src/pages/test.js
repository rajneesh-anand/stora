import React, { useState } from "react";

export default function test() {
  const [visible, setVisible] = useState(false);
  const [txToken, setToken] = useState(undefined);
  const [mid, setMid] = useState(undefined);
  const [orderId, setOrderId] = useState(undefined);
  const [gotRes, setGotRes] = useState(false);
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

  const handlePaytmSubmit = async (e) => {
    let data = {
      custId: "CUSTD1234",
      mobile: "77777777 777777",
      email: "test@test.com",
    };

    fetch("/api/paynow", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setToken(data.token);
        setMid(data.mid);
        setOrderId(data.orderId);
        setGotRes(true);
        document.getElementById("redFrom").submit();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <header>
        <button className="App-link" onClick={sendOrderMail}>
          Send Mail
        </button>
        <button onClick={handlePaytmSubmit}>Paytm</button>
      </header>
      <Hiddenfrom mid={mid} orderId={orderId} token={txToken} />
    </div>
  );
}

const Hiddenfrom = (props) => {
  console.log(props);
  return (
    <div>
      <form
        id="redFrom"
        method="post"
        action={
          "https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=" +
          props.mid +
          "&orderId=" +
          props.orderId
        }
        name="paytm"
      >
        <input type="hidden" name="mid" value={props.mid} />
        <input type="hidden" name="orderId" value={props.orderId} />
        <input type="hidden" name="txnToken" value={props.token} />
      </form>
    </div>
  );
};
