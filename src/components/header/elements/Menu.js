import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession, csrfToken } from "next-auth/client";
import { Button, Drawer, Modal, Popover, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";

import productsData from "../../../data/product.json";
import CartSidebar from "../../cart/CartSidebar";
import WishlistSidebar from "../../wishlist/WishlistSidebar";
import MenuSidebar from "./MenuSidebar";
import SearchBar from "./SearchBar";
import { getTotalProductInCart } from "../../../common/shopUtils";
import Container from "../../other/Container";
const AuthMenu = dynamic(() => import("../../../pages/auth/signin"), {
  ssr: false,
});

function Menu({ containerType, csrfToken }) {
  const cartState = useSelector((state) => state.cartReducer);
  const wishlistState = useSelector((state) => state.wishlistReducer);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false);
  const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [session] = useSession();
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

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const content = (
    <div className="popover">
      <div>
        <Link href="/user/dashboard">
          <a>My Account</a>
        </Link>
      </div>
      <div className="divider" />
      <div>
        <Link href="/user/orders">
          <a>My Orders</a>
        </Link>
      </div>
      <div className="divider" />
      <Button type="primary" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );

  return (
    <>
      <div className="menu">
        <Container type={containerType}>
          <div className="menu-wrapper">
            <a
              href="#"
              className="menu-sidebar-opener"
              onClick={(e) => {
                e.preventDefault();
                setMenuSidebarOpen(true);
              }}
            >
              <div></div>
              <div></div>
              <div></div>
            </a>
            <div className="menu-logo">
              <Link href={process.env.PUBLIC_URL + "/"}>
                <a>
                  <img
                    src={process.env.PUBLIC_URL + "/assets/images/logo.png"}
                    alt="Logo"
                  />
                </a>
              </Link>
            </div>
            <SearchBar
              fillData={productsData}
              placeholder="What are you looking for ?"
            />
            <div className="menu-functions">
              {!session ? (
                <Button onClick={showModal}>Login</Button>
              ) : (
                <>
                  <Popover
                    placement="bottom"
                    // title="My Account"
                    content={content}
                    trigger="hover"
                    arrowPointAtCenter
                  >
                    {!session ? (
                      <Button onClick={showModal}>JOIN</Button>
                    ) : (
                      <Button>
                        {!session.user.name ? (
                          <>
                            <img
                              src={logo}
                              style={{
                                width: "24px",
                                borderRadius: "50%",
                                marginRight: 5,
                              }}
                            />
                            <span>{session.user.email.split("@", 1)}</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={session.user.image}
                              style={{
                                width: "24px",
                                borderRadius: "50%",
                                marginRight: 5,
                              }}
                            />
                            <span>{session.user.name}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </Popover>
                </>
              )}

              {/* <div
                className="menu-function-item"
                onClick={() => setWishlistSidebarOpen(true)}
              >
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/header/menu-wishlist.png"
                  }
                  alt=""
                />
                {wishlistState.length != 0 ? (
                  <span>{wishlistState.length}</span>
                ) : (
                  ""
                )}
              </div> */}
              <div
                className="menu-function-item"
                onClick={() => setCartSidebarOpen(true)}
              >
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/header/menu-bag.png"
                  }
                  alt=""
                />
                {getTotalProductInCart(cartState) != 0 ? (
                  <span>{getTotalProductInCart(cartState)}</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="menu-mobile-search">
        <Container>
          <SearchBar fillData={productsData} placeholder="Searching..." />
        </Container>
      </div>
      {/* <Drawer
        placement="right"
        title={`Wishlist (${wishlistState.length})`}
        closable={true}
        onClose={() => setWishlistSidebarOpen(false)}
        closeIcon={
          <>
            <CloseOutlined />
          </>
        }
        visible={wishlistSidebarOpen}
        width={445}
        className="menu-side"
      >
        <WishlistSidebar />
      </Drawer> */}
      <Drawer
        placement="right"
        title={
          getTotalProductInCart(cartState) > 0
            ? `CART ITEM (${getTotalProductInCart(cartState)})`
            : "Empty Cart"
        }
        closable={true}
        onClose={() => setCartSidebarOpen(false)}
        closeIcon={
          <>
            <CloseOutlined />
          </>
        }
        visible={cartSidebarOpen}
        width={445}
        className="menu-side"
      >
        <CartSidebar />
      </Drawer>
      <Drawer
        placement="left"
        closable={true}
        title=" "
        onClose={() => setMenuSidebarOpen(false)}
        closeIcon={
          <>
            <CloseOutlined />
          </>
        }
        visible={menuSidebarOpen}
        width={350}
        className="menu-side"
      >
        <MenuSidebar />
      </Drawer>

      <Modal
        title="Login"
        footer={null}
        afterClose={handleCancel}
        onCancel={handleCancel}
        visible={visible}
        width={400}
        centered
        maskClosable={false}
      >
        <div className="login_wrapper">
          <div className="social-media">
            <a onClick={() => signIn("google")} className="gg">
              <span className="fab fa-google fa-lg" aria-hidden="true"></span>{" "}
              Login with Google
            </a>
            <a onClick={() => signIn("facebook")} className="fb">
              <span className="fab fa-facebook fa-lg" aria-hidden="true"></span>{" "}
              Login with Facebook
            </a>
          </div>
          <div className="divider" />
          <div className="login-form">
            <Form
              // className="signin-form"
              name="basic"
              initialValues={{ remember: true }}
              id="login-form"
              layout="vertical"
              method="post"
              action="/api/auth/signin/email"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div>
                <Input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="Enter your email !"
                  value={email}
                />
              </div>

              <a
                form="login-form"
                key="submit"
                onClick={handleSubmit}
                className="email"
              >
                <span
                  className="fas fa-envelope fa-lg"
                  aria-hidden="true"
                ></span>{" "}
                Login with Email
              </a>
            </Form>
          </div>
          <h5>
            By Login, you agree to Krayah's
            <a href="http://www.google.com"> Terms of Service </a>and
            <a target="_blank" href="http://www.google.com">
              {" "}
              Privacy Policy
            </a>
          </h5>
        </div>
      </Modal>
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await csrfToken(context);
  return {
    props: { csrfToken: csrfToken },
  };
}

export default React.memo(Menu);
