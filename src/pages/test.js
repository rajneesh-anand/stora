import React from "react";

export default function test() {
  async function displayRazorpay() {
    const result = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const order = await result.json();
    //   return sighting;

    // const result = await axios.post("http://localhost:5000/payment/orders");
    console.log(order);

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = order;

    const options = {
      key: "rzp_test_ZiTzWfVF6kfxi6", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Soumya Corp.",
      description: "Test Transaction",
      //   image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount: amount,
        };

        const result = await fetch("/api/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const data1 = await result.json();
        console.log(data1);

        // const result = await axios.post(
        //   "http://localhost:5000/payment/success",
        //   data
        // );

        // alert(result.data.msg);
      },
      prefill: {
        name: "Soumya Dey",
        email: "SoumyaDey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div>
      <header>
        <p>Buy React now!</p>
        <button className="App-link" onClick={displayRazorpay}>
          Pay ₹500
        </button>
      </header>
    </div>
  );
}
