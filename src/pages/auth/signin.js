import React, { useState } from "react";
import { signIn, csrfToken } from "next-auth/client";
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

export default function SignIn({ csrfToken }) {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
  };

  const isValid = () => {
    if (email === "") {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (e) => {
    if (isValid()) {
      signIn("email", { email: email });
    }
  };

  const signInGithub = (e) => {
    signIn("github");
  };
  return (
    <div className="login_wrapper">
      <h2>Login </h2>
      <div className="social-media">
        <a onClick={signInGithub} className="fb">
          <span className="fab fa-github" aria-hidden="true"></span> Login with
          facebok
        </a>
        <a href="#twitter" className="tw">
          <span className="fab fa-twitter" aria-hidden="true"></span> Login with
          twitter
        </a>
      </div>
      <div className="login-form-content">
        <h2>Login with Email</h2>
        <Form
          className="signin-form"
          name="basic"
          initialValues={{ remember: true }}
          id="login-form"
          layout="vertical"
          method="post"
          action="/api/auth/signin/email"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="one-frm">
            <Input
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Enter your email !"
              value={email}
            />
          </div>
          {/* <div className="one-frm">
            <Input
              type="password"
              name="Password"
              placeholder="Password"
              required
            />
          </div> */}

          <div className="social-media">
            <Button
              form="login-form"
              key="submit"
              htmlType="submit"
              onClick={handleSubmit}
            >
              <span className="fas fa-envelope" aria-hidden="true"></span> Login
              with Email
            </Button>
          </div>
          {/* <p className="already">
            Don't have an account? <a>Sign up</a>
          </p> */}
        </Form>
        <h5>
          By clicking Login, you agree to Cloudinary's
          <span>
            <a href="http://www.google.com"> Terms of Service </a>
          </span>
          &amp;
          <a target="_blank" href="http://www.google.com">
            Privacy Policy
          </a>
        </h5>
      </div>
    </div>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await csrfToken(context),
  };
};
