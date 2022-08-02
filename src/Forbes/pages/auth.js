import _ from "lodash";
import Normal from "@layouts/normal";
import NoFooterLayout from "@layouts/no-footer";
import FormLayout from "@layouts/form-page";
import { getMagazineDetails, getSubscription } from "@queries";

import client from "@apolloClient";
export default [
  {
    path: "/login",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/Login"),
    seo: {
      title: "Login"
    }
  },
  {
    path: "/oauth/google",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/oauth"),
    seo: {
      title: "Authenticating User | Google"
    },
    loadData: () => {
      return {
        provider: "google"
      };
    }
  },
  {
    path: "/oauth/facebook",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/oauth"),
    seo: {
      title: "Authenticating User | Facebook"
    },
    loadData: () => {
      return {
        provider: "facebook"
      };
    }
  },
  {
    path: "/register",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/Register"),
    seo: {
      title: "Register"
    }
  },
  {
    path: "/reset-password",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/ResetPassword"),
    seo: {
      title: "Reset Password"
    }
  },
  {
    path: "/change-password",
    exact: true,
    layout: () => FormLayout,
    component: () => import("../app/components/Forms/ChangePassword"),
    seo: {
      title: "Change Password"
    }
  },
  {
    path: "/my-account",
    exact: true,
    layout: () => Normal,
    component: () => import("../modules/my-account"),
    seo: {
      title: "My Account"
    }
  },
  {
    path: "/my-account/orders",
    exact: true,
    layout: () => Normal,
    component: () => import("../modules/my-orders"),
    seo: {
      title: "My Orders"
    }
  },
  {
    path: "/magazines/cart/checkout",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/magazine-cart-checkout"),
    seo: {
      title: "Checkout"
    }
  },

  {
    path: "/magazines/cart",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/magazine-cart"),
    seo: {
      title: "Cart"
    }
  }
];

// export default [
//   {
//     component: () => import('../components/user/profile'),
//     exact: true,
//     loadData: async ({ match, updateSeo }: any) => {
//       const { params: { userId } } = match;
//       const userDetails = await getUserDetails(userId);
//       updateSeo({
//         description: userDetails.about || userDetails.id,
//         title: `${userDetails.id} - user - HN ReactPWA`,
//       });
//       return userDetails;
//     },
//     path: '/user/:userId',
//     skeleton: ProfileSkeleton,
//   },
// ];
