import { Layout } from "antd";
import LayoutOne from "../../components/layouts/LayoutOne";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

const { Sider, Content } = Layout;

export default function Dashboard() {
  const [session, loading] = useSession();
  const router = useRouter();
  if (!loading && !session) {
    router.push("/");
    return null;
  }

  return (
    <LayoutOne title="Dashboard" description="Shoes Coat Fan mobile">
      <Layout>
        <Sider>Sider</Sider>
        <Content>Content</Content>
      </Layout>
    </LayoutOne>
  );
}
