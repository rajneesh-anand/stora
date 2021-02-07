import {
  Form,
  Input,
  Button,
  Modal,
  Radio,
  Row,
  Col,
  Select,
  Collapse,
  Typography,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  checkoutSuccess,
  checkoutFail,
} from "../../redux/actions/checkoutAction";

import { formatCurrency } from "../../common/utils";
import { calculateTotalPrice } from "../../common/shopUtils";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import productData from "../../data/product.json";
import Product from "../../components/product/Product";
import Loading from "../../components/other/Loading";
import { EmptyCart } from "../../icons/emptycart";
import { PayTMIcon } from "../../icons/paytmIcon";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/client";
const AuthMenu = dynamic(() => import("../auth/signin"));

const paymentData = [
  {
    name: "Direct Bank Transfer",
    content:
      "With so many different ways today to find information online, it can sometimes be hard to know where to go to first.",
  },
  {
    name: "Cheque Payment",
    content:
      "With so many different ways today to find information online, it can sometimes be hard to know where to go to first.",
  },
  {
    name: "PayPal",
    content:
      "With so many different ways today to find information online, it can sometimes be hard to know where to go to first.",
  },
];

const stateData = ["BIHAR", "DELHI"];

export default function checkout() {
  const { Option } = Select;
  const { Panel } = Collapse;
  const router = useRouter();
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartReducer);
  const globalState = useSelector((state) => state.globalReducer);
  const { currency, locales } = globalState.currency;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingCharge, setShippingCharge] = useState(50);
  const [visible, setVisible] = useState(false);
  const [txToken, setToken] = useState(undefined);
  const [mid, setMid] = useState(undefined);
  const [orderId, setOrderId] = useState(undefined);
  const [gotRes, setGotRes] = useState(false);
  const [session, loading] = useSession();
  const [totalCartValue, setTotalCartValue] = useState(
    calculateTotalPrice(cartState)
  );

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    address_two: "",
    locality: "",
    city: "",
    pin: "",
    state: "",
    country: "India",
  });

  const settings = {
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleOnlyNumbers = (e) => {
    const regex = new RegExp("^[0-9]*$");
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(pressedKey)) {
      e.preventDefault();
      return false;
    }
  };

  const isValid = () => {
    const { name, mobile, address, city, pin, state } = data;
    if (
      name === "" ||
      mobile === "" ||
      address === "" ||
      city === "" ||
      pin === "" ||
      state === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handlePaytmSubmit = async (e) => {
    if (isValid()) {
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
    }
  };

  async function displayRazorpay() {
    const result = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalCartAmount: totalCartValue }),
    });
    const order = await result.json();

    // console.log(order);

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = order;

    const options = {
      key: "rzp_test_izUIYNmO8F2EMo", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "BLOGGER....",
      description: "Test Transaction",
      image: "/assets/images/logo-dark.png",
      order_id: order_id,
      handler: async function (response) {
        const orderdata = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount: amount,
          name: data.name,
          email: session.user.email ? session.user.email : session.user.name,
          mobile: data.mobile,
          address: data.address,
          address_two: data.address_two,
          locality: data.locality,
          city: data.city,
          pin: data.pin,
          state: data.state,
          country: data.country,
          order_status: "order_placed",
          items_placed: cartState,
        };

        const result = await fetch("/api/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderdata),
        });

        const resultJson = await result.json();
        // console.log(resultJson);

        if (resultJson.msg === "success") {
          dispatch(
            checkoutSuccess(
              resultJson.orderId,
              resultJson.amount,
              resultJson.msg,
              cartState
            )
          );
          router.push("/shop/checkout-success");
        } else {
          dispatch(checkoutFail(resultJson.msg));
          router.push("/shop/checkout-failed");
        }
      },
      prefill: {
        name: "Name",
        email: "Email",
        contact: "Contact",
      },
      notes: {
        address: "Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const handleSubmit = (e) => {
    if (isValid()) {
      const body = {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        address_two: data.address_two,
        locality: data.locality,
        city: data.city,
        pin: data.pin,
        state: data.state,
        country: "India",
      };
      displayRazorpay();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleState = (val, e) => {
    setData({
      ...data,
      state: val,
    });
  };

  const handleTotal = (e) => {
    e.preventDefault();
    setPaymentMethod(e.target.value);
    e.target.value == "Shipping"
      ? setShippingCharge(50.0)
      : setShippingCharge(0);
  };
  useEffect(() => {
    let cartTotal = calculateTotalPrice(cartState);
    // let shipping = shippingCharge;
    let total = cartTotal;
    setTotalCartValue(total.toFixed(2));
  }, [shippingCharge][session]);
  return (
    <LayoutOne title="Checkout">
      {totalCartValue > 0 ? (
        loading ? (
          <Loading />
        ) : !session ? (
          <Container>
            <Row type="flex" align="middle" style={{ height: "60vh" }}>
              <Col>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h4>Kindly Login to place your order !</h4>
                  <Button type="primary" onClick={showModal}>
                    LOGIN
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <div className="checkout">
            <div className="checkout-top">
              <Container>
                <Row gutter={{ xs: 0, lg: 70 }}>
                  <Col span={24} lg={15} xl={15}>
                    <Collapse
                      bordered={false}
                      // activeKey={[activeKey]}
                      defaultActiveKey={["1"]}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      className="site-collapse-custom-collapse"
                    >
                      <Panel
                        header="SHIPPING ADDRESS "
                        key="1"
                        className="site-collapse-custom-panel"
                        disabled={true}
                      >
                        <Form
                          name="basic"
                          initialValues={{ remember: true }}
                          // onFinish={onFinish}
                          // onFinishFailed={onFinishFailed}
                          id="checkout-form"
                          layout="vertical"
                          className="checkout-form"
                        >
                          <Row gutter={{ xs: 10, sm: 15, md: 10, lg: 24 }}>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter your name !",
                                  },
                                ]}
                              >
                                <Input
                                  name="name"
                                  onChange={handleChange}
                                  // placeholder="Please enter your name !"
                                  value={data.name}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Mobile/Telephone"
                                name="mobile"
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter contact number",
                                  },
                                ]}
                              >
                                <Input
                                  name="mobile"
                                  onChange={handleChange}
                                  // placeholder="Contact Number"
                                  value={data.mobile}
                                  onKeyPress={handleOnlyNumbers}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter shipping address !",
                                  },
                                ]}
                              >
                                <Input
                                  name="address"
                                  onChange={handleChange}
                                  placeholder="House No./Block/Street"
                                  value={data.address}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Address Line 2 (Optional)"
                                name="address_two"
                                rules={[
                                  {
                                    required: false,
                                    message: "Please enter your address",
                                  },
                                ]}
                              >
                                <Input
                                  name="address_two"
                                  onChange={handleChange}
                                  value={data.address_two}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Landmark / Locality (Optional)"
                                name="landmark"
                                rules={[
                                  {
                                    required: false,
                                    message: "Please enter locality!",
                                  },
                                ]}
                              >
                                <Input
                                  name="locality"
                                  onChange={handleChange}
                                  value={data.locality}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8} md={8} xs={24}>
                              <Form.Item
                                label="City"
                                name="city"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter your city!",
                                  },
                                ]}
                              >
                                <Input
                                  name="city"
                                  onChange={handleChange}
                                  value={data.city}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4} md={4} xs={8}>
                              <Form.Item
                                label="PIN"
                                name="pincode"
                                rules={[
                                  {
                                    required: true,
                                    // pattern: new RegExp("^[0-9]*$"),
                                    message: "Postal code !",
                                  },
                                ]}
                              >
                                <Input
                                  name="pin"
                                  onChange={handleChange}
                                  value={data.pin}
                                  onKeyPress={handleOnlyNumbers}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12} md={12} xs={16}>
                              <Form.Item
                                label="State"
                                name="state"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select state!",
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select State"
                                  optionFilterProp="children"
                                  onChange={handleState}
                                  onSelect={(value, event) =>
                                    handleState(value, event)
                                  }
                                  // onFocus={onFocus}
                                  // onBlur={onBlur}
                                  // onSearch={onSearch}
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {stateData.map((city) => (
                                    <Option key={city} value={city}>
                                      {city}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={12} md={12} xs={24}>
                              <Form.Item
                                label="Country"
                                name="country"
                                rules={[
                                  {
                                    required: false,
                                    message: "Please enter country !",
                                  },
                                ]}
                              >
                                <Input
                                  name="country"
                                  onChange={handleChange}
                                  value={data.country}
                                  placeholder="India"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      </Panel>
                    </Collapse>
                  </Col>
                  <Col
                    span={24}
                    lg={8}
                    xl={8}
                    style={{ paddingLeft: "5px", paddingRight: "14px" }}
                  >
                    <div className="checkout-total">
                      <h3 className="checkout-title">YOUR ORDER</h3>
                      <div className="checkout-total__table">
                        <div className="divider" />
                        <table className="checkout-total__table-calculate">
                          <tbody>
                            {cartState.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {item.name}
                                  <span> x {item.cartQuantity}</span>
                                </td>
                                <td>
                                  {item.discount
                                    ? formatCurrency(
                                        item.price - item.discount,
                                        locales,
                                        currency
                                      )
                                    : formatCurrency(
                                        item.price,
                                        locales,
                                        currency
                                      )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="divider" />

                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <Radio.Group
                                  name="radiogroup"
                                  defaultValue={"Shipping"}
                                >
                                  <Radio onClick={handleTotal} value="Shipping">
                                    Shipping Charge*
                                  </Radio>
                                  <Radio
                                    onClick={handleTotal}
                                    value="LocalPickup"
                                  >
                                    Pick Items @ Store
                                  </Radio>
                                </Radio.Group>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="divider" />
                        <table
                          style={{
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: "500",
                            // textTransform: "uppercase",
                            color: "black",
                            fontSize: "20px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td>Sub Total</td>
                              <td>
                                {formatCurrency(
                                  calculateTotalPrice(cartState),
                                  locales,
                                  currency
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Shipping </td>
                              <td>
                                {shippingCharge > 0
                                  ? formatCurrency(
                                      shippingCharge,
                                      locales,
                                      currency
                                    )
                                  : "Free"}
                              </td>
                            </tr>
                            <tr>
                              <td>Total Amount </td>
                              <td>
                                {formatCurrency(
                                  totalCartValue,
                                  locales,
                                  currency
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="divider" />
                        <Button
                          form="checkout-form"
                          htmlType="submit"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "0",
                            marginTop: "8px",
                            width: "100%",
                            height: "42px",
                            fontSize: "20px",
                          }}
                          onClick={handleSubmit}
                        >
                          PAY WITH RAZORPAY
                        </Button>

                        <Button
                          form="checkout-form"
                          htmlType="submit"
                          onClick={handlePaytmSubmit}
                          style={{
                            display: "flex",
                            padding: "0",
                            marginTop: "8px",
                            width: "100%",
                            height: "60px",
                            justifyContent: "center",
                          }}
                        >
                          <p
                            style={{ paddingRight: "15px", paddingTop: "15px" }}
                          >
                            PAY WITH
                          </p>
                          <img
                            src={"/assets/images/paytm.png"}
                            alt="paytm_logo"
                          />
                        </Button>

                        <Hiddenfrom
                          mid={mid}
                          orderId={orderId}
                          token={txToken}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="checkout-bottom">
              <Container>
                <h5>Discount When Purchased Together</h5>
                <div className="checkout-related-products">
                  <Slider {...settings}>
                    {productData.slice(0, 8).map((item, index) => (
                      <div className="slider-item" key={index}>
                        <Product data={item} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </Container>
            </div>
          </div>
        )
      ) : (
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
                <h4>
                  You haven't added anything in your cart yet. Start adding the
                  products you like.
                </h4>

                <Link href="/">
                  <a>ADD ITEMS</a>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      )}
      <Modal
        footer={null}
        afterClose={handleCancel}
        onCancel={handleCancel}
        visible={visible}
        width={400}
        centered
        maskClosable={false}
      >
        <AuthMenu />
      </Modal>
    </LayoutOne>
  );
}

const Hiddenfrom = (props) => {
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
