import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { LoadingMore } from "../../app/components/Loader";
import Container from "@components/Container";
import { apiGet } from "@services";
import { setUser, setAuthToken } from "@utils";
import style from "./styles.scss";

const OAuth = ({ history, location, loadedData, cookies }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const checkAuth = () => {
    const { search } = location;
    const { provider } = loadedData;
    const redirectURL = cookies.get("redirectURL");
    const requestURL = `/auth/${provider}/callback${search}`;
    apiGet(
      requestURL,
      response => {
        setAuthToken(response.data.jwt);
        setUser(response.data.user);
        history.push(language === "ar" ? `/ar${redirectURL}` : redirectURL);
        // cookies.removeCookie("redirectURL");
      },
      err => {
        history.push(language === "ar" ? "/ar" : "/");
        cookies.removeCookie("redirectURL");
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      checkAuth();
    }, 1000);
  }, []);

  return (
    <Container className={style.container}>
      <h1 className="h2">Authenticating User! Please wait...</h1>
      <LoadingMore loading={true} />
    </Container>
  );
};

OAuth.propTypes = {
  cookies: instanceOf(Cookies).isRequired
};
export default withCookies(OAuth);
