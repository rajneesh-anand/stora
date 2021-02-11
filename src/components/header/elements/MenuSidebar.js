import React, { useState } from "react";
import { Menu, Select, Avatar, Button, Modal, Divider } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
const AuthMenu = dynamic(() => import("../../../pages/auth/signin"), {
  ssr: false,
});
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

import {
  setGlobalLanguage,
  setGlobalCurrency,
} from "../../../redux/actions/globalActions";

function MenuSidebar() {
  const { SubMenu } = Menu;
  const { Option } = Select;
  const dispatch = useDispatch();
  const [session] = useSession();
  const globalState = useSelector((state) => state.globalReducer);
  const [visible, setVisible] = useState(false);
  const onSelectLanguage = (value) => {
    dispatch(setGlobalLanguage(value));
  };
  const onSelectCurrency = (value) => {
    dispatch(setGlobalCurrency(value));
  };
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  return (
    <div className="menu-sidebar">
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {!session ? (
          <>
            <div style={{ marginBottom: "10px" }}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#87d068" }}
              />
            </div>
            <Button type="primary" onClick={showModal}>
              Login
            </Button>
          </>
        ) : (
          <>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#87d068" }}
              src={session.user.image}
            />
            <p> {session.user.name}</p>
          </>
        )}
      </div>
      <div className="divider" />

      <Menu mode="inline">
        {session && (
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            <Link href="/user/orders">
              <a>My Orders</a>
            </Link>
          </Menu.Item>
        )}
        {/* <SubMenu key="sub1" title="Homepages">
          <Menu.Item key="1">
            <Link href={process.env.PUBLIC_URL + "/"}>
              <a>Homepage 1</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href={process.env.PUBLIC_URL + "/homepage2"}>
              <a>Homepage 2</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href={process.env.PUBLIC_URL + "/homepage3"}>
              <a>Homepage 3</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href={process.env.PUBLIC_URL + "/homepage4"}>
              <a>Homepage 4</a>
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="Shop">
          <SubMenu key="sub2-1" title="Shop detail">
            <Menu.Item key="5">
              <Link
                href={
                  process.env.PUBLIC_URL +
                  "/shop/product-detail/product-detail-1"
                }
              >
                <a>Product Detail 1</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link
                href={
                  process.env.PUBLIC_URL +
                  "/shop/product-detail/product-detail-2"
                }
              >
                <a>Product Detail 2</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link
                href={
                  process.env.PUBLIC_URL +
                  "/shop/product-detail/product-detail-3"
                }
              >
                <a>Product Detail 3</a>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="8">
            <Link href={process.env.PUBLIC_URL + "/shop/checkout"}>
              <a>Checkout</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link href={process.env.PUBLIC_URL + "/shop/checkout-complete"}>
              <a>Checkout Complete</a>
            </Link>
          </Menu.Item>
        </SubMenu> */}

        <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
          <Link href="/help">
            <a>Help</a>
          </Link>
        </Menu.Item>

        <Menu.Item key="3" icon={<HeartOutlined />}>
          <Link href="/offer">
            <a>Offer</a>
          </Link>
        </Menu.Item>
        {session && (
          <Menu.Item key="4">
            <Button type="primary" onClick={() => signOut()}>
              Sign Out
            </Button>
          </Menu.Item>
        )}
      </Menu>
      {/* <div className="menu-sidebar-selects">
        <Select
          defaultValue={globalState.language}
          style={{ width: 120 }}
          bordered={false}
          onChange={onSelectLanguage}
        >
          <Option value="en">English</Option>
        </Select>
        <Select
          defaultValue={globalState.currency.currency}
          style={{ width: 150 }}
          bordered={false}
          onChange={onSelectCurrency}
        >
          <Option value="INR">INR</Option>
          <Option value="USD">USD</Option>
        </Select>
      </div> */}
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
    </div>
  );
}

export default React.memo(MenuSidebar);
