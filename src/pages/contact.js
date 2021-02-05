import { useState } from "react";
import LayoutOne from "../components/layouts/LayoutOne";
import Link from "next/link";

import Container from "../components/other/Container";

import { Form, Input, InputNumber, Button } from "antd";
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 6,
  },
};
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const registerUser = async ({ user }) => {
    // event.preventDefault();
    console.log(user);
    setLoading(true);
    const email_data = {
      from: user.email,
      subject: user.subject,
      message: user.message,
    };
    const res = await fetch("/api/complain", {
      body: JSON.stringify(email_data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = await res.json();
    console.log(result);
    setLoading(false);
    setError(result.message);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setData({
  //     ...data,
  //     [name]: value,
  //   });
  // };

  return (
    <LayoutOne title="Contact-stora " description="Shoes Coat Fan mobile">
      <Container>
        <div className="offer">
          <p>Do you have any Queries/Suggestions/Complain for us ?</p>
        </div>
        <div className="divider" />
        <div
          className="offer"
          style={{ display: error != "" ? "block" : "none" }}
        >
          {error == "success" ? (
            <h3 className="success">
              Thank you for contacting us. We have received your message. We
              will conatct you shortly{" "}
            </h3>
          ) : (
            <h3 className="danger">
              Oops ! something went wrong, we didn't receive your message.
              Please check your internet connection
            </h3>
          )}
          <Link href="/">
            <a>Continue Shopping</a>
          </Link>
        </div>
        <div style={{ display: error == "" ? "block" : "none" }}>
          <Form
            {...layout}
            name="nest-messages"
            onFinish={registerUser}
            validateMessages={validateMessages}
          >
            <Form.Item
              name={["user", "email"]}
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "subject"]}
              label="Subject"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "message"]}
              label="Message"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={8} />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                {!loading ? "SEND" : "Sending..."}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Container>
    </LayoutOne>
  );
}
