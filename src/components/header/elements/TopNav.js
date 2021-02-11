import { Select, Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";

import {
  setGlobalLanguage,
  setGlobalCurrency,
} from "../../../redux/actions/globalActions";
import Container from "../../other/Container";
import WishlistSidebar from "../../wishlist/WishlistSidebar";

function TopNav({ containerType }) {
  const { Option } = Select;
  const dispatch = useDispatch();
  const globalState = useSelector((state) => state.globalReducer);
  const wishlistState = useSelector((state) => state.wishlistReducer);
  const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);
  const onSelectLanguage = (value) => {
    dispatch(setGlobalLanguage(value));
  };
  const onSelectCurrency = (value) => {
    dispatch(setGlobalCurrency(value));
  };

  return (
    <div className="top-nav">
      <Container type={containerType}>
        <div className="top-nav-wrapper">
          <div className="top-nav-selects">
            <Select
              defaultValue={globalState.language}
              style={{ width: 90 }}
              bordered={false}
              onChange={onSelectLanguage}
            >
              <Option value="en">English</Option>
              {/* <Option value="jp">Japanese</Option>
              <Option value="vi">Vietnamese</Option> */}
            </Select>
            <Select
              defaultValue={globalState.currency.currency}
              style={{ width: 120 }}
              bordered={false}
              onChange={onSelectCurrency}
            >
              <Option value="INR">INR</Option>
              <Option value="USD">USD </Option>
            </Select>
          </div>
          <div className="top-nav-links">
            <div className="top-nav-links__item">
              <Link href={process.env.PUBLIC_URL + "/storelocator"}>
                <a>
                  <i className="icon_pin_alt" />
                  Store Location
                </a>
              </Link>
            </div>
            <div className="top-nav-links__item">
              <Link href={process.env.PUBLIC_URL + "/help"}>
                <a>
                  <i className="icon_question_alt2" />
                  Help
                </a>
              </Link>
            </div>
            <div className="top-nav-links__item">
              <Link href={process.env.PUBLIC_URL + "/offer"}>
                <a>
                  <i className="icon_gift" /> Offer
                </a>
              </Link>
            </div>

            <div
              className="top-nav-links__item"
              onClick={() => setWishlistSidebarOpen(true)}
            >
              <a>
                <i className="icon_heart" /> Wishlist
              </a>
            </div>
          </div>
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
      </Container>
    </div>
  );
}

export default React.memo(TopNav);
