import NormalLayout from "@components/Layout";
import client from "@apolloClient";
import { getStaticPage } from "@queries";
import { htmlToString } from "@utils";

export default [
  {
    path: "/pages/:page?",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../app/templates/static-page"),
    loadData: async ({
      match: { params },
      updateSeo,
      cookies,
      NotFoundError,
    }) => {
      const response = await client.query({
        query: getStaticPage,
        variables: {
          where: {
            slug: params.page,
            status: true,
            language: "en",
          },
        },
      });

      const {
        data: { pages },
      } = response;
      if (!pages.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        title,
        featuredImage,
      } = pages[0];

      updateSeo({
        title: metaTitle ? metaTitle : title,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`,
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });
      return {
        slug: params.page,
        data: pages[0],
      };
    },
  },
  {
    path: "/ar/pages/:page?",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../app/templates/static-page"),
    loadData: async ({
      match: { params },
      updateSeo,
      cookies,
      NotFoundError,
    }) => {
      const response = await client.query({
        query: getStaticPage,
        variables: {
          where: {
            slug: params.page,
            status: true,
            language: "ar",
          },
        },
      });

      const {
        data: { pages },
      } = response;
      if (!pages.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        title,
        featuredImage,
      } = pages[0];

      updateSeo({
        title: metaTitle ? metaTitle : title,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`,
      });
      return {
        slug: params.page,
        data: pages[0],
      };
    },
  },
];
