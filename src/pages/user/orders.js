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

  const convertDate = (dateString) => {
    let event = new Date(dateString);
    let month = event.getMonth();
    let date = event.getDate();
    let year = event.getFullYear();

    switch (month) {
      case 0:
        month = "Jan";
        break;
      case 1:
        month = "Feb";
        break;
      case 2:
        month = "Mar";
        break;
      case 3:
        month = "Apr";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "Jun";
        break;
      case 6:
        month = "Jul";
        break;
      case 7:
        month = "Aug";
        break;
      case 8:
        month = "Sep";
        break;
      case 9:
        month = "Oct";
        break;
      case 10:
        month = "Nov";
        break;
      case 11:
        month = "Dec";
        break;
    }
    return `${date} - ${month} - ${year}`;
  };

  return (
    <LayoutOne title="Dashboard" description="Shoes Coat Fan mobile">
      {data.length > 0 ? (
        <div className="site-card-wrapper">
          <Row gutter={16}>
            {data.map((item) => (
              // <Col key={item.id} span={24} lg={8} xl={8}>
              //   <Card title={item.orderId} bordered={false}>
              //     <h4>{item.createdAt}</h4>
              //     <h4>{item.amount}</h4>
              //     {item.items.map((rec, index) => (
              //       <div key={index}>
              //         <h3>{rec.name}</h3>
              //         <h3>{rec.cartQuantity}</h3>
              //       </div>
              //     ))}
              //   </Card>
              // </Col>

              <section key={item.id} className="card-container">
                <article className="c-card">
                  <header className="c-card__header"></header>

                  <div className="c-card__body">
                    <h2 className="c-card__title">ORDER NO : {item.orderId}</h2>
                    <h2 className="c-card__title">
                      ORDER DATE : {convertDate(item.createdAt)}
                    </h2>

                    {item.items.map((rec, index) => (
                      <div key={index}>
                        <img
                          src={rec.images[0]}
                          className="c-card__image"
                          alt="product"
                        />
                        <p className="c-card__intro">{rec.name}</p>X{" "}
                        <span>
                          {" "}
                          <h3>{rec.cartQuantity}</h3>
                        </span>
                      </div>
                    ))}
                  </div>

                  <footer className="c-card__footer">Footer</footer>
                </article>
              </section>
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
