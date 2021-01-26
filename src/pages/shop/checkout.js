import {
  Form,
  Input,
  Button,
  Checkbox,
  Radio,
  Row,
  Col,
  Select,
  Collapse,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useState, useCallback } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

import { formatCurrency } from "../../common/utils";
import { calculateTotalPrice } from "../../common/shopUtils";
import LayoutOne from "../../components/layouts/LayoutOne";
import Container from "../../components/other/Container";
import productData from "../../data/product.json";
import Product from "../../components/product/Product";

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
  const cartState = useSelector((state) => state.cartReducer);
  const globalState = useSelector((state) => state.globalReducer);
  const { currency, locales } = globalState.currency;
  const [paymentMethod, setPaymentMethod] = useState("Direct Bank Transfer");

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
  return (
    <LayoutOne title="Checkout">
      <div className="checkout">
        <div className="checkout-top">
          <Container>
            <Row gutter={{ xs: 0, lg: 70 }}>
              <Col span={24} lg={15} xl={17}>
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  id="checkout-form"
                  layout="vertical"
                  className="checkout-form"
                >
                  <Collapse
                    bordered={true}
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    className="site-collapse-custom-collapse"
                  >
                    <Panel
                      header="Personal Information"
                      key="1"
                      className="site-collapse-custom-panel"
                    >
                      <Row gutter={{ xs: 10, sm: 15, md: 10, lg: 24 }}>
                        <Col span={8} md={8} xs={24}>
                          <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Enter your name !",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Your Name" />
                          </Form.Item>
                        </Col>
                        <Col span={6} md={6} xs={24}>
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
                            <Input placeholder="Contact Number" />
                          </Form.Item>
                        </Col>
                        <Col span={10} md={10} xs={24}>
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: "Please enter email address!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Your Email Address" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Panel>

                    <Panel
                      header="Shipping Address"
                      key="2"
                      className="site-collapse-custom-panel"
                    >
                      <Row gutter={{ xs: 10, sm: 15, md: 10, lg: 24 }}>
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
                            <Input placeholder="House No./Block/Street" />
                          </Form.Item>
                        </Col>
                        <Col span={12} md={12} xs={24}>
                          <Form.Item
                            label="Address Line 2"
                            name="address_two"
                            rules={[
                              {
                                required: false,
                                message: "Please enter your address",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12} md={12} xs={24}>
                          <Form.Item
                            label="Landmark / Locality"
                            name="landmark"
                            rules={[
                              {
                                required: false,
                                message: "Please enter locality!",
                              },
                            ]}
                          >
                            <Input placeholder="Famous Landmark" />
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
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4} md={4} xs={8}>
                          <Form.Item
                            label="PIN CODE"
                            name="pincode"
                            rules={[
                              {
                                required: true,
                                message: "Please enter pincode !",
                              },
                            ]}
                          >
                            <Input />
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
                              // onChange={onChange}
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
                                <Option key={city}>{city}</Option>
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
                                required: true,
                                message: "Please enter country !",
                              },
                            ]}
                          >
                            <Input disabled={true} placeholder="INDIA" />
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
                  <h3 className="checkout-title">Your Order</h3>
                  <div className="checkout-total__table">
                    <div className="divider" />
                    <table className="checkout-total__table-calculate">
                      <thead>
                        <tr>
                          <th>Products</th>
                          <th>Subtoal</th>
                        </tr>
                      </thead>
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
                                : formatCurrency(item.price, locales, currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="divider" />
                    <table className="checkout-total__table-subtotal">
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
                    </table>
                    <div className="divider" />
                    <table className="checkout-total__table-shiping">
                      <tbody>
                        <tr>
                          <td>
                            <Radio.Group
                              name="radiogroup"
                              defaultValue={"Shipping"}
                            >
                              <Radio value="Shipping">Shipping*</Radio>
                              <Radio value="LocalPickup">
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
                    <table className="checkout-total__table-total">
                      <tbody>
                        <tr>
                          <td>Total</td>
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
                    <Collapse
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
                    </Collapse>
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
    </LayoutOne>
  );
}
