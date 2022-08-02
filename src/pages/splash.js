import client from "@apolloClient";
import { getConfiguration } from "@queries";
export default [
  {
    path: "/",
    exact: true,
    component: () => import("../modules/home"),
    seo: {
      title: "Forbes Middle East"
    },
    loadData: async ({ cookies }) => {
      // const isEnglish = cookies.get("language") !== "ar";
      cookies.set("language", "en");
      const response = await client.query({
        query: getConfiguration,
        variables: {
          where: { key: `featuredItemsConfig` }
        }
      });
      const data = response.data.configurations[0];
      return {
        featured: data.value
      };
    }
  },
  {
    path: "/ar",
    exact: true,
    component: () => import("../modules/home"),
    seo: {
      title: "فوربس الشرق الأوسط"
    },
    loadData: async ({ cookies }) => {
      // const isEnglish = cookies.get("language") !== "ar";
      cookies.set("language", "ar");
      const response = await client.query({
        query: getConfiguration,
        variables: {
          where: { key: `featuredItemsConfigAR` }
        }
      });
      const data = response.data.configurations[0];
      return {
        featured: data.value
      };
    }
  }
];
