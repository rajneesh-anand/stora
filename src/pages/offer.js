import { Collapse, Row, Col } from "antd";
import LayoutOne from "../components/layouts/LayoutOne";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Container from "../components/other/Container";

const { Panel } = Collapse;

export default function Offer() {
  return (
    <LayoutOne title="F.A.Q Blogger" description="Shoes Coat Fan mobile">
      <Container>
        <div className="offer">
          <p>FREQUENTLY ASKED QUESTION</p>
        </div>
        <div className="divider" />
        <Row gutter={{ xs: 0, lg: 70 }}>
          <Col span={24} xs={24} lg={15} xl={17}>
            <Collapse
              defaultActiveKey={["1"]}
              ghost
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              className="faq"
            >
              <Panel header="This is panel header 1" key="1">
                <p style={{ paddingLeft: 24 }}>
                  A dog is a type of domesticated animal. Known for its loyalty
                  and faithfulness, it can be found as a welcome guest in many
                  households across the world.
                </p>
              </Panel>
              <Panel
                header="This is panel header 2"
                key="2"
                style={{ color: "teal" }}
              >
                <p style={{ paddingLeft: 24 }}>
                  A dog is a type of domesticated animal. Known for its loyalty
                  and faithfulness, it can be found as a welcome guest in many
                  households across the world.
                </p>
              </Panel>
              <Panel header="This is panel header 3" key="3">
                <p style={{ paddingLeft: 24 }}>
                  A dog is a type of domesticated animal. Known for its loyalty
                  and faithfulness, it can be found as a welcome guest in many
                  households across the world.
                </p>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Container>
    </LayoutOne>
  );
}
