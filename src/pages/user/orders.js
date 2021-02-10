import { Card, Col, Row } from "antd";
import { useState, useEffect } from "react";
import LayoutOne from "../../components/layouts/LayoutOne";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "../../components/other/Loading";

export default function Orders({ session, data }) {
  const [load, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const router = useRouter();

  if (!session) {
    router.push("/");
    return null;
  }

  console.log(session, data);

  return (
    <LayoutOne title="Dashboard" description="Shoes Coat Fan mobile">
      {data.length > 0 ? (
        <div className="site-card-wrapper">
          <Row gutter={16}>
            {data.map((item) => (
              <Col key={item.id} span={24} lg={8} xl={8}>
                <Card title={item.orderId} bordered={false}>
                  <h4>{item.createdAt}</h4>
                  <h4>{item.amount}</h4>
                  {item.items.map((rec, index) => (
                    <div key={index}>
                      <h3>{rec.name}</h3>
                      <h3>{rec.cartQuantity}</h3>
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <h4>no data</h4>
      )}
    </LayoutOne>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    const user = {
      email: session.user.email,
    };
    const res = await fetch("https://stora-eight.vercel.app/api/fetchOrders", {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await res.json();
    return {
      props: { session: session, data: result },
    };
  } else {
    return {
      props: { session: session },
    };
  }
}
