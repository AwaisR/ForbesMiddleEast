import NoFooterLayout from "@layouts/no-footer";
import EmptyLayout from "@layouts/empty";
import NormalLayout from "@components/Layout";
import client from "@apolloClient";
import { getAuthorDetails, getStaticPage, getNominations } from "@queries";
import { isUrlEncoded } from "@utils";

const routes = [
  {
    path: "/ar/nominations",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/nominations"),
    seo: {
      title: "Nominations"
    }
  },

  {
    path: "/ar/nominations/:nomination?",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/nominations/detail"),
    seo: {
      title: "Nominations"
    },
    loadData: async ({ match: { params }, updateSeo, cookies }) => {
      const response = await client.query({
        query: getNominations,
        variables: {
          where: {
            slug: isUrlEncoded(params.nomination)
              ? params.nomination
              : encodeURIComponent(params.nomination)
          }
        }
      });

      const {
        data: { nominations }
      } = response;

      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        title,
        featuredImage
      } = nominations[0];

      updateSeo({
        title: metaTitle ? metaTitle : title,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`
      });
      return {
        data: nominations[0]
      };
    }
  },
  {
    path: "/ar/contact-us",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/contact-us"),
    seo: {
      title: "Contact Us"
    }
  },
  {
    path: "/ar/author/:author?",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/author"),
    loadData: async ({
      match: { params },
      updateSeo,
      cookies,
      NotFoundError
    }) => {
      const response = await client.query({
        query: getAuthorDetails,
        variables: {
          whereAuthor: {
            slug: params.author ? params.author.toLowerCase() : ""
          },
          where: {
            language: "ar",
            category_null: false,
            status: "Published"
          }
          // id: params.author
        }
      });
      // const { users } = response.data;
      const users = response.data.users;
      if (!users.length) {
        throw new NotFoundError("Page not found");
      }
      const user = users[0];
      updateSeo({
        title: `${user.firstName ? user.firstName : ""} ${
          user.lastName ? user.lastName : ""
        }`,
        description: user.description ? user.description : ""
      });

      return {
        socialLinks: {
          facebook: user.facebook,
          twitter: user.twitter,
          linkedIn: user.linkedIn
        },
        user
      };
    }
  },
  {
    path: "/ar/search",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/search"),
    seo: {
      title: "Search"
    }
  },
  {
    path: "/ar/thank-you",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/thankyou"),
    loadData: async ({ match, api, updateSeo }) => {},
    seo: {
      title: "Thank You"
    }
  },
  {
    path: "/ar/holding-page",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/holding"),
    loadData: async ({ match, api, updateSeo }) => {},
    seo: {
      title: "Holding Page"
    }
  },
  {
    path: "/ar/tags",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/tags"),
    seo: {
      title: "Tags"
    }
  }
];

export default routes;
