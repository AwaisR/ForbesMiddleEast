import React from "react";
import _ from "lodash";
import NormalLayout from "@components/Layout";
import NoFooterLayout from "@layouts/no-footer";
import SEOImage from "@images/seo-image.jpg";

import EmptyLayout from "@layouts/empty";
import client from "@apolloClient";
import { isUrlEncoded, getImageUrl, htmlToString } from "@utils";
import {
  getArticleDetails,
  getCompanyDetails,
  getCategoryDetail,
  getEventsDetail,
  getListDetails,
} from "@queries";
import api from "../api";

let paths = [
  {
    path: `/:category?`,
    exact: true,
    bundleKey: `category`,
    layout: () => EmptyLayout,
    component: () => import("../modules/category-view"),
    loadData: async ({ match: { params }, NotFoundError, updateSeo }) => {
      const response = await client.query({
        query: getCategoryDetail,
        variables: {
          where: {
            slug: params.category,
          },
        },
      });

      const data = response.data.blogcategories[0];
      if (!data) {
        throw new NotFoundError("Page Not Found");
      }
      updateSeo({
        title: data.name,
      });
      return {
        title: data.name,
        id: data.id,
        slug: params.category,
        data,
      };
    },
  },
  {
    path: `/:category?/:sub?`,
    bundleKey: `category-sub`,
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/sub-category-view"),
    loadData: async ({ match, updateSeo, cookies, NotFoundError }) => {
      const response = await client.query({
        query: getCategoryDetail,
        variables: {
          where: {
            slug: match.params.sub,
          },
        },
      });
      const data = response.data.blogcategories[0];
      if (!data) {
        throw new NotFoundError("Page not found");
      }

      updateSeo({
        title: data.name,
      });

      return {
        data,
      };
    },
  },
  {
    path: `/:category?/:sub?/:article?`,
    bundleKey: `article-detail-page`,
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/article-view"),
    loadData: ({ match, updateSeo, NotFoundError, ...props }) =>
      new Promise((r, reject) => {
        let m = match;
        api
          .get(
            `/blogs/fetch?language=en&slug=${decodeURIComponent(
              match.params.article
            )}`
          )
          .then((response) => {
            try {
              const {
                metaTitle,
                metaKeywords,
                metaDescription,
                title,
                featuredImage,
                firstName,
                lastName,
                publishedDate,
              } = response.data[0];
              updateSeo({
                title: metaTitle ? metaTitle : title,
                description: metaDescription ? metaDescription : "",
                keywords: metaKeywords ? metaKeywords.split(",") : [],
                image: getImageUrl(featuredImage),
                meta: [
                  {
                    name: "description",
                    content: metaDescription ? metaDescription : "",
                  },
                ],
              });

              const structuredData = {
                "@context": "http://schema.org",
                "@type": "Article",
                url: `https://forbesmiddleeast.com${match.url}`,
                mainEntityOfPage: `https://forbesmiddleeast.com${match.url}`,
                publisher: {
                  "@type": "Organization",
                  name: "Forbes Middle East",
                  logo: {
                    "@type": "ImageObject",
                    url: SEOImage,
                  },
                },
                author: {
                  "@type": "Person",
                  name: `${firstName && firstName} ${lastName ? lastName : ""}`,
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://forbesmiddleeast.com/search?q={q}&tab=articles",
                  "query-input": "required name=q",
                },
                headline: metaTitle ? metaTitle : name,
                articleBody: metaDescription,
                image: {
                  "@list": [getImageUrl(featuredImage)],
                },
                datePublished: publishedDate,
                dateModified: publishedDate,
              };
              r({
                template: "normal",
                articleDetails: response.data[0],
                structuredData,
                queryParams: {
                  sub: match.params.sub,
                  slug: match.params.article,
                },
              });
            } catch {
              reject(new NotFoundError());
            }
          })
          .catch((err) => {
            reject(new NotFoundError());
          });
      }),
  },
];

const previewPaths = [
  {
    path: `/preview/blogs/:article?`,
    bundleKey: "artcleprev",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/article-preview"),
    loadData: async ({
      match: { params },
      updateSeo,
      cookies,
      NotFoundError,
    }) => {
      const response = await client.query({
        query: getArticleDetails,
        variables: {
          where: {
            slug: decodeURIComponent(params.article),
          },
          whereRelated: {
            language: "en",
            category: {
              slug: params.sub,
            },
            slug_ne: params.article,
          },
          whereBlogImages: {
            blog: {
              slug: decodeURIComponent(params.article),
            },
          },
        },
      });

      const {
        data: { articleDetails, relatedArticles, blogImages },
      } = response;

      if (!articleDetails.length) {
        throw new NotFoundError("Page not found");
      }
      cookies.set("language", articleDetails[0].language);

      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        title,
        featuredImage,
      } = articleDetails[0];
      articleDetails[0].relatedArticles = relatedArticles;
      articleDetails[0].blogImages = blogImages;
      updateSeo({
        title: metaTitle ? metaTitle : title,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(featuredImage),
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });

      return {
        template: "normal",
        // template: index % 2 === 0 ? 'normal' : 'longread',
        articleDetails: articleDetails[0],
        blogImages: articleDetails[0].blogImages,
        preview: true,
      };
    },
  },
  {
    path: `/preview/list/:article?`,
    bundleKey: "lists-preview",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/list-view"),
    loadData: async ({
      match: { params },
      updateSeo,
      cookies,
      NotFoundError,
    }) => {
      const response = await client.query({
        query: getListDetails,
        variables: {
          where: {
            slug: decodeURIComponent(params.article),
          },
        },
      });
      const {
        data: { listDetails },
      } = response;
      if (!listDetails.length) {
        throw new NotFoundError("Page not found");
      }
      cookies.set("language", listDetails[0].language);
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        name,
        featuredImage,
        featuredCoverListPage,
        featuredCoverMonth,
      } = listDetails[0];
      updateSeo({
        title: metaTitle ? metaTitle : name,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(
          featuredCoverListPage ? featuredCoverListPage : featuredCoverMonth
        ),
      });
      return {
        listDetails: listDetails[0],
        show: true,
      };
    },
  },
  {
    path: "/preview/events/:sub?",
    bundleKey: "events",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/event-view"),
    loadData: async ({
      match: { params },
      NotFoundError,
      updateSeo,
      cookies,
    }) => {
      cookies.set("language", "en");
      const response = await client.query({
        query: getEventsDetail,
        variables: {
          where: {
            slug: isUrlEncoded(params.sub)
              ? params.sub
              : encodeURIComponent(params.sub),
          },
        },
      });
      const {
        data: { eventDetails },
      } = response;
      if (!eventDetails.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        name,
        featuredImage,
      } = eventDetails[0];
      updateSeo({
        title: metaTitle ? metaTitle : name,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(featuredImage),
      });
      return {
        data: eventDetails[0],
        show: true,
      };
    },
  },
];
const categoryPaths = [
  {
    path: `/press-room`,
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/category-view"),
    loadData: async ({ match, api, updateSeo, cookies }) => {
      updateSeo({
        title: "Press Room",
      });
      return {
        title: "Press Room",
        slug: "press-room",
        data: {
          name: "Press Room",
          nameAR: "الأخبار",
        },
        categoryQuery: {
          parent: {
            slug: "press-room",
          },
        },
        ignoreParentUrl: true,
      };
    },
  },
  {
    path: `/press-room/:article?`,
    bundleKey: "press-room",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/article-view"),
    loadData: async ({
      match: { params },
      updateSeo,
      NotFoundError,
      ...props
    }) => {
      const response = await client.query({
        query: getArticleDetails,
        variables: {
          where: {
            slug: decodeURIComponent(params.article),
          },
          whereRelated: {
            category: {
              parent: {
                slug: "press-room",
              },
            },
            language: "en",
            slug_ne: params.article,
            status: "Published",
          },
        },
      });

      const {
        data: { articleDetails, relatedArticles },
      } = response;

      if (!articleDetails.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        title,
        featuredImage,
        publishedDate,
        author,
      } = articleDetails[0];

      updateSeo({
        title: metaTitle ? metaTitle : title,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(featuredImage),
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });

      articleDetails[0].relatedArticles = relatedArticles;
      const structuredData = {
        "@context": "http://schema.org",
        "@type": "Article",
        url: `https://forbesmiddleeast.com/press-room/${params.article}`,
        mainEntityOfPage: `https://forbesmiddleeast.com/press-room/${params.article}`,
        publisher: {
          "@type": "Organization",
          name: "Forbes Middle East",
          logo: {
            "@type": "ImageObject",
            url: SEOImage,
          },
        },
        author: {
          "@type": "Person",
          name: `${author && author.firstName && author.firstName} ${
            author && author.lastName ? author.lastName : ""
          }`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://forbesmiddleeast.com/search?q={q}&tab=articles",
          "query-input": "required name=q",
        },
        headline: metaTitle ? metaTitle : name,
        articleBody: metaDescription,
        image: {
          "@list": [getImageUrl(featuredImage)],
        },
        datePublished: publishedDate,
        dateModified: publishedDate,
      };

      return {
        template: "normal",
        breadcrumbTrail: [
          {
            title: "Press Room",
            slug: "/press-room",
          },
        ],
        ignoreParentUrl: true,
        articleDetails: articleDetails[0],
        structuredData,
        queryParams: {
          slug: params.article,
          sub: "press-room",
        },
      };
    },
  },
  {
    path: "/brandvoice",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/brandvoice"),
    loadData: async ({ match, api, updateSeo }) => {
      updateSeo({
        title: "Brandvoice",
      });
      return {};
    },
  },
  {
    path: "/brandvoice/:sub?",
    bundleKey: "brandvoice",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/brandvoice-view"),
    loadData: async ({
      match: { params },
      api,
      updateSeo,
      cookies,
      NotFoundError,
    }) => {
      cookies.set("language", "en");
      const response = await client.query({
        query: getCompanyDetails,
        variables: {
          where: {
            slug: isUrlEncoded(params.sub)
              ? params.sub
              : encodeURIComponent(params.sub),
          },
          whereBlogs: {
            category_null: false,
            category: {
              parent_null: false,
            },
            status: "Published",
            language: "en",
            company: {
              slug: params.sub,
            },
          },
        },
      });

      const {
        data: { companyDetails, companyBlogs },
      } = response;
      if (!companyDetails.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        name,
        bannerImage,
      } = companyDetails[0];

      updateSeo({
        title: metaTitle ? metaTitle : name,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: `https://d1epq84pwgteub.cloudfront.net/${bannerImage}`,
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });

      return {
        data: companyDetails[0],
        companyBlogs,
        show: true,
      };
    },
  },

  {
    path: "/events",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/events"),
    loadData: async ({ match, api, updateSeo }) => {
      updateSeo({
        title: "Events",
      });
      return {};
    },
  },
  {
    path: "/events/:sub?",
    bundleKey: "events",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/event-view"),
    loadData: async ({
      match: { params },
      NotFoundError,
      updateSeo,
      cookies,
    }) => {
      cookies.set("language", "en");
      const response = await client.query({
        query: getEventsDetail,
        variables: {
          where: {
            slug: isUrlEncoded(params.sub)
              ? params.sub
              : encodeURIComponent(params.sub),
          },
        },
      });
      const {
        data: { eventDetails },
      } = response;
      if (!eventDetails.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        name,
        featuredImage,
      } = eventDetails[0];
      updateSeo({
        title: metaTitle ? metaTitle : name,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(featuredImage),
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });
      return {
        data: eventDetails[0],
        show: true,
      };
    },
  },
  {
    path: "/list",
    exact: true,
    layout: () => NormalLayout,
    component: () => import("../modules/list"),
    loadData: async ({ match, api, updateSeo }) => {
      updateSeo({
        title: "Lists",
      });
      return {};
    },
  },
  {
    path: "/list/:article?",
    exact: true,
    layout: () => EmptyLayout,
    component: () => import("../modules/list-view"),
    loadData: async ({
      match,
      updateSeo,
      cookies,
      NotFoundError,
      ...props
    }) => {
      const { params, url } = match;
      const response = await client.query({
        query: getListDetails,
        variables: {
          where: {
            language: "en",
            slug: isUrlEncoded(params.article)
              ? params.article
              : encodeURIComponent(params.article),
            // categories: {
            //   slug: params.sub
            // }
          },
          whereBlogs: {
            category_null: false,
            language: "en",
            category: {
              parent_null: false,
            },
          },
        },
      });
      const {
        data: { listDetails },
      } = response;

      if (!listDetails.length) {
        throw new NotFoundError("Page not found");
      }
      const {
        metaTitle,
        metaKeywords,
        metaDescription,
        name,
        featuredCoverMonth,
        author,
        publishedDate,
      } = listDetails[0];
      updateSeo({
        title: metaTitle ? metaTitle : name,
        description: metaDescription ? metaDescription : "",
        keywords: metaKeywords ? metaKeywords.split(",") : [],
        image: getImageUrl(featuredCoverMonth),
        meta: [
          {
            name: "description",
            content: metaDescription ? htmlToString(metaDescription) : "",
          },
        ],
      });

      const structuredData = {
        "@context": "http://schema.org",
        "@type": "Article",
        url: `https://forbesmiddleeast.com${url}`,
        publisher: {
          "@type": "Organization",
          name: "Forbes Middle East",
          logo: {
            "@type": "ImageObject",
            url: SEOImage,
          },
        },
        author: {
          "@type": "Person",
          name: `${author && author.firstName && author.firstName} ${
            author && author.lastName ? author.lastName : ""
          }`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://forbesmiddleeast.com/search?q={q}&tab=list",
          "query-input": "required name=q",
        },
        headline: metaTitle ? metaTitle : name,
        mainEntityOfPage: `https://forbesmiddleeast.com${url}`,
        articleBody: metaDescription,
        image: {
          "@list": [getImageUrl(featuredCoverMonth)],
        },
        datePublished: publishedDate,
        dateModified: publishedDate,
      };
      return {
        structuredData,
        listDetails: listDetails[0],
        show: true,
      };
    },
  },
  {
    path: "/magazines",
    exact: true,
    layout: () => NoFooterLayout,
    component: () => import("../modules/magazine"),
    loadData: async ({ match, api, updateSeo, NotFoundError }) => {
      updateSeo({
        title:
          "Grab Your Copy Of Forbes Middle East Magazine – To Buy And Download",
        description:
          "Buy and download the latest issues of Forbes Middle East magazine so you don't miss out on the Middle East's biggest business stories and most credible business rankings. Grab your copy today.",
      });
      // if (!isLoggedIn()) {
      //   throw new NotFoundError("Page not found");
      // }

      return {};
    },
  },
  ...previewPaths,
  ...paths,
];

export default categoryPaths;
