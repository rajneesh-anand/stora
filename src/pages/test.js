import React from "react";

export default function test() {
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

  return (
    <div>
      <header>
        <button className="App-link" onClick={sendOrderMail}>
          Send Mail
        </button>
      </header>
    </div>
  );
}
