import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { extractLanguage } from "@utils";
import { PageLoader } from "@components/Loader";
import SearchClose from "@images/search-close.svg";

import style from "./styles.scss";
const AppShell = ({ children, cookies, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [showCookie, setShowCookie] = useState(false);
  const language = extractLanguage(props.location.pathname);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    const accepted = cookies.get("cookie_accepted") || false;
    setShowCookie(accepted);
  }, []);

  const handleAccept = () => {
    cookies.set("cookie_accepted", true, {
      maxAge: 1209600,
      secure: true,
    });
    setShowCookie(false);
  };

  const handleClose = () => {
    setShowCookie(false);
  };

  return (
    <>
      {loading ? <PageLoader /> : null}
      <div className={`app-wrapper site-${language}`}>{children}</div>
      {showCookie ? (
        <div className={style.cookies}>
          <div className={style.cookies__border}></div>
          <div>
            <span>We use cookies</span>
            <p>Forbes Middle East uses cookies to improve your experience.</p>
          </div>
          <div className={style.cookies__action}>
            <Link to="/privacy-policy">Learn More</Link>
            <span onClick={handleAccept}>Accept</span>
          </div>
          <img onClick={handleClose} src={SearchClose} />
        </div>
      ) : null}
    </>
  );
};

export default withRouter(withCookies(AppShell));
