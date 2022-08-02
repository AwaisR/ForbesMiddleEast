import React from "react";
import "cross-fetch/polyfill";
import cookiesMiddleware from "universal-cookie-express";
import { CookiesProvider } from "react-cookie";
import Cookies from "universal-cookie";

import ReduxServer from "@pawjs/redux/server";
import { AppReducers } from "@redux";
import FavIcon from "@images/favicon.png";
import AppShell from "./modules/app-shell";

import "./i18n";
export default class Server {
  constructor({ addPlugin, addMiddleware }) {
    const reduxClient = new ReduxServer({ addPlugin });
    reduxClient.setReducers(AppReducers);
    addPlugin(reduxClient);
    addMiddleware(cookiesMiddleware());
  }

  // eslint-disable-next-line
  apply(serverHandler) {
    serverHandler.hooks.renderRoutes.tap(
      "AddCookieProvider",
      ({ setRenderedRoutes, getRenderedRoutes, htmlProps }, req) => {
        console.log(htmlProps);
        setRenderedRoutes(
          <CookiesProvider cookies={req.universalCookies}>
            <AppShell>{getRenderedRoutes()}</AppShell>
          </CookiesProvider>
        );
      }
    );
    serverHandler.hooks.beforeLoadData.tapPromise(
      "CookiesToLoadData",
      async (setParams, getParams, req) => {
        const cookies = new Cookies(req.headers.cookie);
        setParams("cookies", cookies);
      }
    );
    // serverHandler.hooks.renderRoutes.tap(
    //   'AddAppShell',
    //   ({ setRenderedRoutes, getRenderedRoutes }) => {
    //     setRenderedRoutes(<AppShell>{getRenderedRoutes()}</AppShell>);
    //   }
    // );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "DSNPreCache",
      async (Application) => {
        const {
          htmlProps: { head },
        } = Application;
        head.push(
          <meta key="meta-theme-color" name="theme-color" content="#209cee" />
        );
        head.push(
          <script
            async
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          ></script>
        );
      }
    );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AddGoogleFonts",
      async (Application) => {
        const {
          htmlProps: { head },
        } = Application;
        head.push(
          <link
            href="https://fonts.googleapis.com/css?family=Teko:400,500&display=swap"
            rel="stylesheet"
          ></link>
        );
      }
    );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AdSenseNew",
      async (Application) => {
        const {
          htmlProps: { head },
        } = Application;
        head.push(
          <script
            data-ad-client="ca-pub-8085292518492504"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
        );
      }
    );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AddFireBase",
      async (Application) => {
        const {
          htmlProps: { footer },
        } = Application;
        footer.push(
          <script
            defer
            src="https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js"
          ></script>,
          <script
            defer
            src="https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js"
          ></script>
          // <script defer src="./firebase.js"></script>
        );
      }
    );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AddFavIcon",
      async (Application) => {
        const {
          htmlProps: { head },
        } = Application;
        head.push(
          <link
            key="favicon"
            rel="shortcut icon"
            type="image/png"
            href={FavIcon}
          />
        );
        return true;
      }
    );
    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AddResponsiveVoice",
      async (Application) => {
        Application.htmlProps.footer.push(
          <script src="https://code.responsivevoice.org/responsivevoice.js?key=aHGpNPWi" />
        );
      }
    );

    serverHandler.hooks.beforeHtmlRender.tapPromise(
      "AddGoogleTracking",
      async (Application) => {
        Application.htmlProps.footer.push(
          <script
            async
            key="googleanalyticslink"
            src="https://www.googletagmanager.com/gtag/js?id=UA-23877493-1"
          />
        );
        Application.htmlProps.footer.push(
          <script
            key="googleanalyticsscript"
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-23877493-1');`,
            }}
          />
        );
      }
    );
  }
}
