import "../styles/globals.scss";
import Contentlayout from "../components/_App/MainLayout"; //is admin layout
import Landingpagelayout from "../components/_App/LandingLayout";
import Switcherlayout from "../components/_App/SwitcherLayout";
import Authenticationlayout from "../components/_App/AuthenticationLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const layouts = {
  Contentlayout: Contentlayout,
  Landingpagelayout: Landingpagelayout,
  Switcherlayout: Switcherlayout,
  Authenticationlayout: Authenticationlayout,
};
function MyApp({ Component, pageProps }) {
  const Layout =
    layouts[Component.layout] ||
    ((pageProps) => <Component>{pageProps}</Component>);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
