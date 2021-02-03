import { Form, Input, Button, Checkbox, Row, Col, Select } from "antd";
import classNames from "classnames";
import Slider from "react-slick";
import { useRouter, withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import react, { useState } from "react";
import parse from "urlencoded-body-parser";

import Link from "next/link";

import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import { formatCurrency } from "../../common/utils";
import { signIn, getSession, useSession } from "next-auth/client";

export default function checkoutComplete({ rData }) {
  const router = useRouter();
  const [session, loading] = useSession();

  const checkoutState = useSelector((state) => state.checkoutReducer);
  console.log(rData);

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

  if (!loading && !session) {
    router.push("/");
    return null;
  }

  return (
    <LayoutOne title="Checkout completed">
      <Container>
        <div className="checkout-complete">
          <div className="checkout-complete-summary">
            <h3>{checkoutState.message}</h3>
            <div className="checkout-complete-summary__table">
              <div className="checkout-complete-summary__table-item">
                <h5>Order Number</h5>
                <p>120</p>
              </div>
              <div className="checkout-complete-summary__table-item">
                <h5>Date</h5>
                <p>12 August 2020</p>
              </div>
              <div className="checkout-complete-summary__table-item">
                <h5>Total</h5>
                <p>{formatCurrency(200)}</p>
              </div>
              <div className="checkout-complete-summary__table-item">
                <h5>Payment methods</h5>
                <p>Check payment</p>
              </div>
            </div>
          </div>
          <div className="checkout-complete-details">
            <h3>Order Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Stay-Matte Sheer Pressed x 1</td>
                  <td className="bold">{formatCurrency(100)}</td>
                </tr>
                <tr>
                  <td>Subtotal</td>
                  <td className="bold">{formatCurrency(100)}</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td>Free ship</td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>Check Payments</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="bold">{formatCurrency(100)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Link href="/">
          <a>KEEP SHOPING</a>
        </Link>
        <Button onClick={sendOrderMail}>Send mail</Button>
      </Container>
    </LayoutOne>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req } = context;
  const data = await parse(req);

  return {
    props: { rData: data },
  };
}
// checkoutComplete.getInitialProps = async (ctx) => {
//   const { req } = ctx;
//   const data = await parse(req);
//   console.log(data);
//   return { responsedata: data };
// };
