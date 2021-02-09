import { Button, Checkbox, Row, Col } from "antd";
import { useRouter, withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { removeAllFromCart } from "../../redux/actions/cartActions";
import { useEffect } from "react";

import Link from "next/link";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import { formatCurrency } from "../../common/utils";
import { signIn, getSession, useSession } from "next-auth/client";
import { EmptyCart } from "../../icons/emptycart";

export default function checkoutComplete() {
  const dispatch = useDispatch();
  const [session, loading] = useSession();
  const router = useRouter();

  const checkoutState = useSelector((state) => state.checkoutReducer);

  if (!loading && !session) {
    router.push("/");
    return null;
  }

  useEffect(() => {
    dispatch(removeAllFromCart());
  }, [session]);
  return (
    <LayoutOne title="Checkout Success" description="Shoes Coat Fan mobile">
      <Container>
        <Row type="flex" align="middle" style={{ height: "70vh" }}>
          <Col>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <EmptyCart />
            </div>
            <div
              className="offer"
              style={{
                textAlign: "center",
                paddingTop: "0",
              }}
            >
              <p>Thank you for purchasing products from us</p>
              <h3>
                Your order number{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  {checkoutState.orderID}
                </span>{" "}
                has been received
              </h3>

              <h3>Your order will be shipped </h3>

              <Link href="/">
                <a>Continue Shopping </a>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutOne>
  );
}
