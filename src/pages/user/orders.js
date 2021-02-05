import { Card, Col, Row } from "antd";
import { useState, useEffect } from "react";
import LayoutOne from "../../components/layouts/LayoutOne";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "../../components/other/Loading";

export default function Orders() {
  const [session, loading] = useSession();
  const [load, setLoading] = useState(true);

  const router = useRouter();
  if (!loading && !session) {
    router.push("/");
    return null;
  }

  const fetchOrders = async () => {
    // setLoading(true);
    const username = {
      email: session.user.email,
    };
    const res = await fetch("/api/fetchOrders", {
      body: JSON.stringify(username),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = await res.json();
    console.log(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <LayoutOne title="Dashboard" description="Shoes Coat Fan mobile">
      {load ? (
        <Loading />
      ) : (
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={24} lg={8} xl={8}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
            <Col span={24} lg={8} xl={8}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
            <Col span={24} lg={8} xl={8}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </LayoutOne>
  );
}
