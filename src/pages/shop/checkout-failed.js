import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Button, Row, Col } from "antd";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import { EmptyCart } from "../../icons/emptycart";

export default function CheckoutFailed() {
  const checkoutState = useSelector((state) => state.checkoutReducer);
  return (
    <LayoutOne title="Checkout Failed" description="Shoes Coat Fan mobile">
      <Container>
        <Row type="flex" align="middle" style={{ height: "60vh" }}>
          <Col>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <EmptyCart />
            </div>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h4>{checkoutState.message}</h4>
              <h4>Oops ! We didn't receive your payment.</h4>

              <Link href="/">
                <a>Try Again</a>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutOne>
  );
}
