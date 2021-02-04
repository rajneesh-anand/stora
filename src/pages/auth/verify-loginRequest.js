import React from "react";
import Link from "next/link";
import { Row, Col } from "antd";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import { EmptyCart } from "../../icons/emptycart";

export default function VerifyLogin() {
  return (
    <LayoutOne title="Verify Account" description="Shoes Coat Fan mobile">
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
              <h3>We have sent a verification link at your email address.</h3>
              <h2>Kindly login to your email and verify. Thank You </h2>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutOne>
  );
}
