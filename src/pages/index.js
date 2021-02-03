import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Banners from "../components/shop/Banners";
import LayoutOne from "../components/layouts/LayoutOne";
import ShopLayout from "../components/shop/ShopLayout";
import productData from "../data/product.json";
import useProductData from "../common/useProductData";

export default function Home() {
  const router = useRouter();
  const globalState = useSelector((state) => state.globalReducer);
  const data = useProductData(
    productData,
    globalState.category,
    router.query.q
  );
  return (
    <LayoutOne title="Blogger" description="Shoes Coat Fan mobile">
      <Banners />
      <ShopLayout
        fourColumn
        shopSidebarResponsive={{ xs: 24, lg: 25 }}
        shopContentResponsive={{ xs: 24, lg: 25 }}
        productResponsive={{ xs: 12, sm: 8, md: 6 }}
        productPerPage={16}
        data={[...data]}
      />
    </LayoutOne>
  );
}
