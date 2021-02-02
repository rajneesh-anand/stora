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
import { removeAllFromCart } from "../../redux/actions/cartActions";
import { formatCurrency } from "../../common/utils";
import { calculateTotalPrice } from "../../common/shopUtils";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import productData from "../../data/product.json";
import Product from "../../components/product/Product";

import dynamic from "next/dynamic";
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
  const [panelStatus, setPanelStatus] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const [totalCartValue, setTotalCartValue] = useState(
    calculateTotalPrice(cartState)
  );
  const [visible, setVisible] = useState(false);
  const [session] = useSession();

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  const logo = `http://localhost:3000/assets/images/logo-dark.png`;
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
      image: logo,
      order_id: order_id,
      handler: async function (response) {
        const orderdata = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          amount: amount,
          name: data.name,
          email: !session.user.name ? session.user.email : session.user.name,
          mobile: data.mobile,
          address: data.address,
          address_two: data.address_two,
          locality: data.locality,
          city: data.city,
          pin: data.pin,
          state: data.state,
          country: data.country,
          order_status: "order_placed",
        };

        const result = await fetch("/api/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderdata),
        });

        const resultJson = await result.json();
        console.log(resultJson);

        if (resultJson.msg === "success") {
          dispatch(
            checkoutSuccess(
              resultJson.orderId,
              resultJson.amount,
              resultJson.msg
            )
          );
          dispatch(removeAllFromCart());
          router.push("/shop/checkout-complete");
        } else {
          dispatch(checkoutFail(resultJson.msg));
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

  const onFinish = (values) => {
    router.push("/shop/checkout-complete");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onChoosePayment = useCallback(
    (key) => {
      setPaymentMethod(key);
    },
    [paymentMethod]
  );

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
    let shipping = shippingCharge;
    let total = cartTotal + shipping;
    setTotalCartValue(total.toFixed(2));
    if (!session) {
      setPanelStatus(true);
    } else {
      setPanelStatus(false);
      setActiveKey("1");
    }
  }, [shippingCharge][cartState]);
  return (
    <LayoutOne title="Checkout">
      {totalCartValue > shippingCharge ? (
        <div className="checkout">
          <div className="checkout-top">
            <Container>
              <Row gutter={{ xs: 0, lg: 70 }}>
                <Col span={24} lg={15} xl={17}>
                  {!session ? <Button onClick={showModal}>Login</Button> : ""}
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    id="checkout-form"
                    layout="vertical"
                    className="checkout-form"
                  >
                    <Collapse
                      bordered={false}
                      activeKey={[activeKey]}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      className="site-collapse-custom-collapse"
                    >
                      <Panel
                        header="SHIPPING ADDRESS "
                        key="1"
                        className="site-collapse-custom-panel"
                        disabled={panelStatus}
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
                                placeholder="Please enter your name !"
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
                                placeholder="Contact Number"
                                value={data.mobile}
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
                              label="PIN CODE"
                              name="pincode"
                              rules={[
                                {
                                  required: true,
                                  message: "Postal code !",
                                },
                              ]}
                            >
                              <Input
                                name="pin"
                                onChange={handleChange}
                                value={data.pin}
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
                                style={{}}
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
                      </Panel>
                    </Collapse>
                  </Form>

                  {/* <h3 className="checkout-title">Billing details</h3> */}
                </Col>
                <Col
                  span={24}
                  md={16}
                  lg={9}
                  xl={7}
                  style={{ paddingLeft: "5px", paddingRight: "14px" }}
                >
                  <div className="checkout-total">
                    <h3 className="checkout-title">YOUR ORDER</h3>
                    <div className="checkout-total__table">
                      <div className="divider" />
                      <table className="checkout-total__table-calculate">
                        {/* <thead>
                          <tr>
                            <th>Products</th>
                            <th>Subtoal</th>
                          </tr>
                        </thead> */}
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
                      {/* <table className="checkout-total__table-subtotal">
                      <tbody>
                        <tr>
                          <td>Subtotal</td>
                          <td>
                            {formatCurrency(
                              calculateTotalPrice(cartState),
                              locales,
                              currency
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table> */}
                      {/* <div className="divider" /> */}
                      <table className="checkout-total__table-shiping">
                        <tbody>
                          <tr>
                            <td>
                              <Radio.Group
                                name="radiogroup"
                                defaultValue={"Shipping"}
                              >
                                <Radio onClick={handleTotal} value="Shipping">
                                  Shipping*
                                </Radio>
                                <Radio
                                  onClick={handleTotal}
                                  value="LocalPickup"
                                >
                                  Pick Items @ Store
                                </Radio>
                              </Radio.Group>
                              {/* <h5>Shiping</h5>
                            <p>Shiping to United State</p> */}
                            </td>
                            {/* <td>Free</td> */}
                          </tr>
                        </tbody>
                      </table>
                      <div className="divider" />
                      <table className="checkout-total__table-total">
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
                            <td>Shipping Charge</td>
                            <td>
                              {shippingCharge > 0
                                ? formatCurrency(
                                    shippingCharge,
                                    locales,
                                    currency
                                  )
                                : "FREE"}
                            </td>
                          </tr>
                          <tr>
                            <td>Total</td>
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
                        className="checkout-functions--next"
                        form="checkout-form"
                        key="submit"
                        htmlType="submit"
                        style={{ marginBottom: 0 }}
                        onClick={handleSubmit}
                      >
                        PAY WITH RAZORPAY
                      </Button>
                      {/* <button onClick={displayRazorpay}>PAY WITH RAZORPAY</button> */}
                      {/* <Collapse
                      className="checkout-payment"
                      accordion
                      defaultActiveKey={paymentMethod}
                      ghost
                      onChange={onChoosePayment}
                    >
                      {paymentData.map((item, index) => (
                        <Panel
                          showArrow={false}
                          header={item.name}
                          key={item.name}
                          onClick={() => setPaymentMethod(item.name)}
                          extra={
                            <i
                              className={
                                paymentMethod === item.name
                                  ? "fas fa-check-square"
                                  : "fal fa-square"
                              }
                            />
                          }
                        >
                          <p>{item.content}</p>
                        </Panel>
                      ))}
                    </Collapse> */}
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
          {/* <div className="checkout-sticky">
          <Container>
            <div className="checkout-functions">
              <Button className="checkout-functions--shopping">
                <Link href={process.env.PUBLIC_URL + "/"}>
                  <a>Continue Shopping</a>
                </Link>
              </Button>
              <div className="checkout-price-finally">
                <table>
                  <tbody>
                    <tr>
                      <td>{cartState.length} items</td>
                      <td>
                        {formatCurrency(
                          calculateTotalPrice(cartState),
                          locales,
                          currency
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Total:</td>
                      <td>
                        {formatCurrency(
                          calculateTotalPrice(cartState),
                          locales,
                          currency
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button
                className="checkout-functions--next"
                form="checkout-form"
                key="submit"
                htmlType="submit"
                style={{ marginBottom: 0 }}
              >
                Next Step
              </Button>
            </div>
          </Container>
        </div> */}
        </div>
      ) : (
        <h6>No Cart Value</h6>
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
