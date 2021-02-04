import { Button, Checkbox, Row, Col } from "antd";
import { useRouter, withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { removeAllFromCart } from "../../redux/actions/cartActions";
import { useEffect } from "react";
import parse from "urlencoded-body-parser";
import Link from "next/link";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import { formatCurrency } from "../../common/utils";
import { signIn, getSession, useSession } from "next-auth/client";
import { EmptyCart } from "../../icons/emptycart";

export default function checkoutComplete({ rData }) {
  const dispatch = useDispatch();
  const [session, loading] = useSession();

  const checkoutState = useSelector((state) => state.checkoutReducer);
  console.log(rData);

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
              {/* <h4>{checkoutState.message}</h4> */}
              <h1>Thank you for purchasing products from us</h1>
              <h3>Your Order Number - {checkoutState.orderID}</h3>
              <h3>We highly regards our customers </h3>
              <h1>Your order will be shipped </h1>

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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req } = context;
  const data = await parse(req);

  return {
    props: { rData: data },
  };
}
