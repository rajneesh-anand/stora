import { Provider } from "react-redux";
import {
  setOptions,
  getSession,
  Provider as AuthProvider,
} from "next-auth/client";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor } from "../redux/store";
import "../styles/styles.scss";
import "../styles/antd.less";

import Loading from "../components/other/Loading";
import withReduxStore from "../common/withReduxStore";

const MyApp = ({ Component, pageProps, reduxStore, session }) => {
  // https://stora-eight.vercel.app
  return (
    <Provider store={reduxStore}>
      <AuthProvider
        session={session}
        options={{ site: "http://localhost:3000" }}
      >
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
};

MyApp.getServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    session,
  };
};

export default withReduxStore(MyApp);
