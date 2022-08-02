import _ from "lodash";
import Normal from "@layouts/normal";
import NoFooterLayout from "@layouts/no-footer";
import FormLayout from "@layouts/form-page";
import { getMagazineDetails, getSubscription } from "@queries";

import client from "@apolloClient";

export default [
  {
    path: "/ar/login",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/Login"),
    seo: {
      title: "Login",
    },
  },
  {
    path: "/ar/register",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/Register"),
    seo: {
      title: "Register",
    },
  },
  {
    path: "/ar/reset-password",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/ResetPassword"),
    seo: {
      title: "Reset Password",
    },
  },
  {
    path: "/ar/change-password",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/ChangePassword"),
    seo: {
      title: "Change Password",
    },
  },
  {
    path: "/ar/my-account",
    exact: true,
    layout: () => Normal,
    component: () => import("../modules/my-account"),
    seo: {
      title: "My Account",
    },
  },
  {
    path: "/ar/my-account/orders",
    exact: true,
    layout: () => Normal,
    component: () => import("../modules/my-orders"),
    seo: {
      title: "My Orders",
    },
  },
  {
    path: "/ar/magazines/cart/checkout",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/magazine-cart-checkout"),
    seo: {
      title: "Checkout",
    },
  },
  {
    path: "/ar/magazines/cart",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/magazine-cart"),
    seo: {
      title: "Cart"
    }
  },
];
