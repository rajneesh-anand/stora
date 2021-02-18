import { Row, Col, Divider, Carousel } from "antd";
import Link from "next/link";
import Container from "../other/Container";

export default function Banners({ containerType }) {
  return (
    <div className="banners">
      <Container type={containerType}>
        <div className="mobile-view">
          <Carousel autoplay>
            <div>
              <Link href={process.env.PUBLIC_URL + "#"}>
                <a className="banner-item-mobile">
                  <img src="/assets/images/banners/1.png" alt="banner_1" />
                </a>
              </Link>
            </div>
            <div>
              <Link href={process.env.PUBLIC_URL + "#"}>
                <a className="banner-item-mobile">
                  <img src="/assets/images/banners/2.png" alt="banner_2" />
                </a>
              </Link>
            </div>
            <div>
              <Link href={process.env.PUBLIC_URL + "#"}>
                <a className="banner-item-mobile">
                  <img src="/assets/images/banners/3.png" alt="banner_3" />
                </a>
              </Link>
            </div>
          </Carousel>
        </div>

        <Row gutter={30}>
          {Array.from({ length: 3 }, (item, index) => (
            <Col key={index} className="gutter-row" span={24} sm={8}>
              <Link href={process.env.PUBLIC_URL + "#"}>
                <a className="banner-item">
                  <img
                    src={`/assets/images/banners/${index + 1}.png`}
                    alt="banner"
                  />
                </a>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
