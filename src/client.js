import React from "react";
import "cross-fetch/polyfill";
import ReduxClient from "@pawjs/redux/client";
import { AppReducers } from "@redux";
import { CookiesProvider } from "react-cookie";
import Cookies from "universal-cookie";
import AppShell from "./modules/app-shell";
import "@styles/global.scss";
import "./i18n";
import { apiPost } from "@services";

export default class Client {
  constructor({ addPlugin }) {
    const reduxClient = new ReduxClient({ addPlugin });
    reduxClient.setReducers(AppReducers);
    addPlugin(reduxClient);
  }
  advertiseTimeout = 0;

  clearAdvertiseTimeout() {
    if (this.advertiseTimeout) {
      clearTimeout(this.advertiseTimeout);
    }
    this.advertiseTimeout = 0;
  }

  advertise() {
    this.clearAdvertiseTimeout();
    this.advertiseTimeout = setTimeout(() => {
      // console.log('advertise');
      // let codeFundDiv = document.getElementById('codefund_ad');
      // if (!codeFundDiv) {
      //   codeFundDiv = document.createElement('div');
      //   codeFundDiv.id = 'codefund';
      //   const footerElement = document.querySelector('footer.footer');
      //   if (footerElement) {
      //     const jsCodefund = document.getElementById('js-codefund');
      //     if (jsCodefund) {
      //       footerElement.appendChild(codeFundDiv);
      //       if (jsCodefund.src) {
      //         const newJsCodefund = document.createElement('script');
      //         setTimeout(() => {
      //           newJsCodefund.src = `${jsCodefund.getAttribute(
      //             'data-src'
      //           )}?v=${new Date().getTime()}`;
      //           newJsCodefund.id = jsCodefund.id;
      //           newJsCodefund.setAttribute(
      //             'data-src',
      //             jsCodefund.getAttribute('data-src')
      //           );
      //           jsCodefund.remove();
      //           document.body.append(newJsCodefund);
      //         }, 100);
      //         //
      //       } else {
      //         jsCodefund.src = jsCodefund.getAttribute('data-src');
      //       }
      //     }
      //   }
      // } else {
      //   const jsCodefund = document.getElementById('js-codefund');
      //   if (jsCodefund) {
      //     if (jsCodefund.src) {
      //       const newJsCodefund = document.createElement('script');
      //       setTimeout(() => {
      //         newJsCodefund.src = `${jsCodefund.getAttribute('data-src')}`;
      //         newJsCodefund.id = jsCodefund.id;
      //         newJsCodefund.setAttribute(
      //           'data-src',
      //           jsCodefund.getAttribute('data-src')
      //         );
      //         jsCodefund.remove();
      //         document.body.append(newJsCodefund);
      //       }, 100);
      //     } else {
      //       jsCodefund.src = jsCodefund.getAttribute('data-src');
      //     }
      //   }
      // }
    }, 100);
  }

  static googleTrack() {
    if (typeof window.gtag === "function") {
      window.gtag("config", "UA-108804791-2", {
        page_path: window.location.pathname,
      });
    }
  }

  initializeFirebase = () => {
    if (!("Notification" in window)) {
      return;
    }
    var firebaseConfig = {
      apiKey: "AIzaSyBeP86gpXwdfAkMNDdU2HIwtfFeMs3h-XM",
      authDomain: "forbesmiddleeast-notifications.firebaseapp.com",
      databaseURL: "https://forbesmiddleeast-notifications.firebaseio.com",
      projectId: "forbesmiddleeast-notifications",
      storageBucket: "forbesmiddleeast-notifications.appspot.com",
      messagingSenderId: "654384163800",
      appId: "1:654384163800:web:39b8bbf4724410d82d20ad",
    };
    // OLD
    // apiKey: "AIzaSyBIzvE_7Ua_kULIjEoJ3ATkgdqgsAOsYeY",
    // authDomain: "marioplan-17d32.firebaseapp.com",
    // databaseURL: "https://marioplan-17d32.firebaseio.com",
    // projectId: "marioplan-17d32",
    // storageBucket: "marioplan-17d32.appspot.com",
    // messagingSenderId: "188131366408",
    // appId: "1:188131366408:web:9af71f7b8a3c4de63923bd"

    // apiKey: "AIzaSyBeP86gpXwdfAkMNDdU2HIwtfFeMs3h-XM",
    // authDomain: "forbesmiddleeast-notifications.firebaseapp.com",
    // databaseURL: "https://forbesmiddleeast-notifications.firebaseio.com",
    // projectId: "forbesmiddleeast-notifications",
    // storageBucket: "forbesmiddleeast-notifications.appspot.com",
    // messagingSenderId: "654384163800",
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(
      "BNZoBTCq69Yn54bz97v9kclnWppzLCWegKhQMXvBqB7i_RP6nRhUQxBizzHZCTsX7IeCnwywz9FgChwkuF5tQr0"
    );
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        messaging
          .getToken()
          .then((token) => {
            if (token) {
              apiPost(
                "/devices",
                {
                  token,
                  deviceType: "web",
                },
                (resp) => {
                  console.log(resp);
                }
              );
            } else {
              // Show permission request.
              console.log(
                "No Instance ID token available. Request permission to generate one."
              );
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });
      } else {
        console.log("Unable to get permission to notify.");
      }
    });

    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then((token) => {
          if (token) {
            apiPost(
              "/devices",
              {
                token,
                deviceType: "web",
              },
              (resp) => {
                console.log("Web token added to firebase");
              }
            );
          }
        })
        .catch((err) => {
          console.log("Unable to retrieve refreshed token ", err);
        });
    });

    messaging.onMessage((payload) => {
      const { title, ...options } = payload.notification;
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    });
  };

  apply(clientHandler) {
    clientHandler.hooks.renderRoutes.tap(
      "AddCookieProvider",
      ({ setRenderedRoutes, getRenderedRoutes }) => {
        setRenderedRoutes(
          <CookiesProvider>
            <AppShell>{getRenderedRoutes()}</AppShell>
          </CookiesProvider>
        );
      }
    );
    clientHandler.hooks.beforeLoadData.tapPromise(
      "CookiesToLoadData",
      async (setParams) => {
        const cookies = new Cookies();
        setParams("cookies", cookies);
      }
    );

    clientHandler.hooks.beforeLoadData.tapPromise("InitInitialFB", async () => {
      this.initializeFirebase();
    });

    clientHandler.hooks.locationChange.tapPromise("ReloadAds", async () =>
      this.advertise()
    );

    clientHandler.hooks.locationChange.tapPromise("InitFirebase", async () =>
      this.initializeFirebase()
    );

    // clientHandler.hooks.locationChange.tapPromise('ReloadGoogleTrack', async () => Client.googleTrack());
    clientHandler.hooks.renderComplete.tap("ReloadAds", async () =>
      this.advertise()
    );
  }
}
