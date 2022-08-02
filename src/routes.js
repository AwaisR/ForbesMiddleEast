import AuthRoutes from "./pages/auth";
import AuthRoutesAR from "./pages/authAR";
import Page404 from "@modules/page404";
import SplashScreen from "./pages/splash";
import Categories from "./pages/categories";
import CategoriesAR from "./pages/categoriesAR";
import Extras from "./pages/extras";
import ExtrasAR from "./pages/extrasAR";
import Statics from "./pages/staticPages";
import ErrorPage from "@components/ErrorPage";
import { PageLoading } from "@components/Loader";
export default class Routes {
  // eslint-disable-next-line
  apply(routeHandler) {
    routeHandler.setErrorComponent(ErrorPage);
    routeHandler.setDefaultLoadErrorComponent(ErrorPage);
    routeHandler.set404Component(Page404);
    routeHandler.setDefaultLoaderComponent(PageLoading);

    const routes = [
      ...ExtrasAR,
      ...Extras,
      ...Statics,
      ...AuthRoutesAR,
      ...AuthRoutes,
      ...SplashScreen,
      ...CategoriesAR,
      ...Categories,
    ];

    routeHandler.hooks.initRoutes.tapPromise("AppRoutes", async () => {
      routeHandler.addRoutes(routes);
    });
  }
}
