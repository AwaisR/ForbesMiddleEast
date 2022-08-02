import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import _ from "lodash";
import { Icon } from "antd";
import { isMobileOnly } from "react-device-detect";
import { DFPSlotsProvider, AdSlot } from "react-dfp";
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "@utils";
import AdWrapper from "@ads";
import Title from "./Title";
import ArticleFiller from "./ArticleFiller";
import {
  FeaturedListPage,
  FullListPageSlider,
  PageListSlider,
  FeaturedArticleSlider,
  FeaturedMagazine
} from "@components/CategoryContentBlocks";
import PageListSliderEvent from "@components/CategoryContentBlocks/PageListSlider/Event";
import { LoadingMore } from "@components/Loader";
import client from "@apolloClient";
import { getConfiguration } from "@queries";
import style from "./styles.scss";
import { extractLanguage } from "@utils";
import { ShowMoreMobile } from "@icons";

const loggedIn = isLoggedIn();

const HomeSections = ({ ...props }) => {
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const [loading, setLoading] = useState(false);
  const [homeSections, setHomeSections] = useState([]);
  const [homeSectionOrder, setHomeSectionOrder] = useState([]);
  const [brandvoiceItems, setBrandVoiceItems] = useState([]);
  const [eventItems, setEventItems] = useState([]);
  const [listItems, setListItems] = useState({});
  const [magazineItems, setMagazineItems] = useState({});
  const { t } = useTranslation();

  let sectionCount = 0;
  useEffect(() => {
    getHomeCategoryOrder();
    setLoading(true);
  }, []);

  const getHomeCategoryOrder = async () => {
    const response = await client.query({
      query: getConfiguration,
      variables: {
        where: { key: `categoryHomeOrder${isEnglish ? "" : "AR"}` }
      }
    });
    const data = response.data.configurations[0];
    setHomeSectionOrder(data.value);
    const hasBrandvoice = !_.isEmpty(_.find(data.value, { id: "brandvoice" }));
    const hasEvents = !_.isEmpty(_.find(data.value, { id: "event" }));
    const hasLists = !_.isEmpty(_.find(data.value, { id: "list" }));
    const hasMagazine = !_.isEmpty(_.find(data.value, { id: "magazine" }));
    getHomeSectionDetails(hasBrandvoice, hasEvents, hasLists, hasMagazine);
    setLoading(false);
  };

  const getHomeSectionDetails = async (
    hasBrandvoice,
    hasEvents,
    hasLists,
    hasMagazine
  ) => {
    const response = await client.query({
      query: getConfiguration,
      variables: {
        where: { key: `categoryConfig${isEnglish ? "" : "AR"}` }
      }
    });
    const data = response.data.configurations[0];
    setHomeSections(data.value);
    if (hasBrandvoice) {
      getOtherConfigs(`brandvoiceConfig${isEnglish ? "" : "AR"}`, data => {
        setBrandVoiceItems([
          data.featuredBrandvoice,
          ...data.relatedBrandvoices
        ]);
      });
    }
    if (hasEvents) {
      getOtherConfigs(`eventConfig${isEnglish ? "" : "AR"}`, data => {
        setEventItems([data.featuredEvent, ...data.relatedEvents]);
      });
    }
    if (hasLists) {
      getOtherConfigs(`listConfig${isEnglish ? "" : "AR"}`, setListItems);
    }
    if (hasMagazine) {
      getOtherConfigs(
        `magazineConfig${isEnglish ? "" : "AR"}`,
        setMagazineItems
      );
    }
  };

  const getOtherConfigs = async (key, setter) => {
    const response = await client.query({
      query: getConfiguration,
      variables: {
        where: { key }
      }
    });
    const data = response.data.configurations[0];
    setter(data.value);
  };

  return (
    <div>
      {loading ? <LoadingMore loading={loading} /> : null}
      {!_.isEmpty(homeSections)
        ? _.map(homeSections, (section, index) => {
            const activeCategory = homeSectionOrder[index];

            const isBrandVoice = section.id === "brandvoice";
            const featuredBrandvoices = isBrandVoice ? brandvoiceItems : [];
            const isList = section.id === "list";
            const isMagazine = section.id === "magazine";
            const isFeatured = Number(section.id) === 9;
            const isEvent = section.id === "event";
            sectionCount =
              !isBrandVoice && !isList && !isMagazine && !isEvent && !isFeatured
                ? sectionCount + 1
                : sectionCount;
            return (
              <div className={style.divider} key={section.id}>
                {index % 2 === 0 ? (
                  <DFPSlotsProvider
                    dfpNetworkId="21752631353"
                    collapseEmptyDivs
                  >
                    <AdWrapper>
                      {isMobileOnly ? (
                        <AdSlot
                          dfpNetworkId="21752631353"
                          sizes={[[320, 50]]}
                          adUnit={
                            isEnglish
                              ? "forbes-mobileresponsive-ws-101"
                              : "forbes-arabic-mobileresponsive-ws-102"
                          }
                        />
                      ) : (
                        <AdSlot
                          dfpNetworkId="21752631353"
                          sizes={[[728, 90]]}
                          adUnit={
                            isEnglish ? "forbes-ws-005" : "forbes-arabic-ws-001"
                          }
                        />
                      )}
                    </AdWrapper>
                  </DFPSlotsProvider>
                ) : null}
                {!isFeatured && (
                  <Title
                    title={activeCategory.name}
                    slug={
                      activeCategory.slug
                        ? activeCategory.slug
                        : activeCategory.name
                    }
                  />
                )}
                {/* {section.featuredBlog && !isFeatured ? (
                  <FeaturedArticleSingle items={section.featuredBlog} />
                ) : null}
                {section.relatedBlogs && !isFeatured ? (
                  <FeaturedArticleMultiple items={section.relatedBlogs} />
                ) : null} */}

                {!isBrandVoice &&
                !isList &&
                !isMagazine &&
                !isEvent &&
                !isFeatured ? (
                  <ArticleFiller
                    featuredBlog={section.featuredBlog}
                    relatedBlogs={section.relatedBlogs}
                    slug={activeCategory.slug}
                    language={language}
                    sectionCount={sectionCount}
                  />
                ) : null}

                {isFeatured ? (
                  <FeaturedArticleSlider
                    items={
                      section.featuredBlog
                        ? [section.featuredBlog, ...section.relatedBlogs]
                        : []
                    }
                  />
                ) : null}
                {isBrandVoice ? (
                  <PageListSlider
                    items={featuredBrandvoices}
                    brandvoice={true}
                  />
                ) : null}
                {isList && !_.isEmpty(listItems) ? (
                  <>
                    {listItems.featuredList ? (
                      <FeaturedListPage
                        item={listItems.featuredList}
                        title={listItems.featuredList.name}
                      />
                    ) : null}
                    {listItems.relatedLists ? (
                      <FullListPageSlider items={listItems.relatedLists} />
                    ) : null}
                  </>
                ) : null}
                {isMagazine ? <FeaturedMagazine items={magazineItems} /> : null}
                {isEvent && loggedIn && eventItems.length ? (
                  <PageListSliderEvent items={eventItems} />
                ) : null}

                {isMobileOnly &&
                !isBrandVoice &&
                !isList &&
                !isMagazine &&
                !isEvent &&
                !isFeatured ? (
                  <Link
                    className={`${style.showMore} ${!isEnglish &&
                      style.showMore__ar}`}
                    to={
                      activeCategory.slug
                        ? activeCategory.slug
                        : activeCategory.name
                    }
                  >
                    {t("showMore")} <Icon component={ShowMoreMobile} />
                  </Link>
                ) : null}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default withRouter(HomeSections);
