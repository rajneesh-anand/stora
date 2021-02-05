import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession } from "next-auth/client";
import { Button, Drawer, Modal, Popover } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";

import productsData from "../../../data/product.json";
import CartSidebar from "../../cart/CartSidebar";
import WishlistSidebar from "../../wishlist/WishlistSidebar";
import MenuSidebar from "./MenuSidebar";
import SearchBar from "./SearchBar";
import { getTotalProductInCart } from "../../../common/shopUtils";
import Container from "../../other/Container";
const AuthMenu = dynamic(() => import("../../../pages/auth/signin"));

function Menu({ containerType }) {
  const cartState = useSelector((state) => state.cartReducer);
  const wishlistState = useSelector((state) => state.wishlistReducer);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false);
  const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [session] = useSession();

  const logo = `http://localhost:3000/fav.png`;

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const content = (
    <div style={{ textAlign: "center" }}>
      <div>
        <Link href="/user/dashboard">
          <a>My Account</a>
        </Link>
      </div>
      <div>
        <Link href="/user/orders">
          <a>My Orders</a>
        </Link>
      </div>
      <Button onClick={() => signOut()}>Sign Out</Button>
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
                <Button onClick={showModal}>JOIN</Button>
              ) : (
                <>
                  <Popover
                    placement="bottom"
                    title="My Account"
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

              <div
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
              </div>
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
      <Drawer
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
      </Drawer>
      <Drawer
        placement="right"
        title={`CART ITEM (${getTotalProductInCart(cartState)})`}
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
        placement="right"
        closable={true}
        title=" "
        onClose={() => setMenuSidebarOpen(false)}
        closeIcon={
          <>
            <p>Close</p> <CloseOutlined />
          </>
        }
        visible={menuSidebarOpen}
        width={350}
        className="menu-side"
      >
        <MenuSidebar />
      </Drawer>

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
    </>
  );
}

export default React.memo(Menu);
