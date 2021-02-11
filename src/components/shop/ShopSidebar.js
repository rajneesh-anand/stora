import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { Select } from "antd";

import { SHOP } from "../../common/defines";
import { setSubCategory } from "../../redux/actions/shopActions";

function ShopSidebar({ categories }) {
  const { Option } = Select;
  const dispatch = useDispatch();
  const globalState = useSelector((state) => state.globalReducer);
  const shopState = useSelector((state) => state.shopReducer);

  const subCategory = SHOP.category.find(
    (item) => item.name.toLowerCase() === globalState.category.toLowerCase()
  );
  const onChooseSubCategory = (data) => {
    if (!data || data === "all") {
      return dispatch(setSubCategory(""));
    }
    return dispatch(setSubCategory(data));
  };
  const handleChange = (value) => {
    onChooseSubCategory(value);
  };
  return (
    <div className="shop-sidebar">
      {/* <h5>{globalState.category}</h5> */}
      <div className="shop-sidebar__subcategory">
        <ul>
          <Link href="">
            <a
              onClick={(e) => {
                e.preventDefault();
                onChooseSubCategory("all");
              }}
            >
              <li
                className={classNames({
                  active: shopState.subCategory === "",
                })}
              >
                <ul>
                  <li>
                    <i className="icon_menu" />
                  </li>
                  <li>All</li>
                </ul>
              </li>
            </a>
          </Link>
          {subCategory &&
            subCategory.sub.slice(0, 7).map((item, index) => (
              <Link href="" key={index}>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onChooseSubCategory(item.name);
                  }}
                >
                  <li
                    className={classNames({
                      active: shopState.subCategory === item.name,
                    })}
                  >
                    <ul>
                      <li>
                        <i className={item.iconClass} />
                      </li>
                      <li>{item.name}</li>
                    </ul>
                  </li>
                </a>
              </Link>
            ))}
        </ul>
      </div>
      {/* <div className="shop-sidebar__subcategory-mobile">
        <Select
          defaultValue="all"
          style={{ width: "100%" }}
          onChange={handleChange}
          value={shopState.subCategory === "" ? "all" : shopState.subCategory}
        >
          <Option value="all">
            <i className="icon_document_alt" />
            All Category
          </Option>
          {subCategory &&
            subCategory.sub.map((item, index) => (
              <Option key={index} value={item.name}>
                <i className={item.iconClass} />
                {item.name}
              </Option>
            ))}
        </Select>
      </div> */}
    </div>
  );
}

export default React.memo(ShopSidebar);
