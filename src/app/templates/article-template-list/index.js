import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";
import moment from "moment";
import { Row, Col, Table, Input } from "antd";
import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";

import Button from "@components/Button";
import Layout from "@components/Layout";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import SocialShare from "@components/SocialShare";
import PlaceholderImage from "@components/PlaceholderImage";

import SearchIcon from "@images/search.svg";

import { FeaturedListStats } from "@components/CategoryContentBlocks";
import { unescape } from "@utils";

import style from "./styles.scss";
import { ActionButtons, RelatedArticles } from "./templates";
import ProfileModal from "./Modal";
import AdWrapper from "@ads";
import { isMobileOnly } from "react-device-detect";
import { DFPSlotsProvider, AdSlot } from "react-dfp";

const ArticleTemplateList = ({ listDetails, structuredData, ...props }) => {
  const {
    name,
    content,
    featuredCoverMonth,
    featuredCoverListPage,
    csvJson,
    publishedDate,
    showRank,
    blogs,
    language,
  } = listDetails;
  const defaultLang = language || "en";
  const isEnglish = defaultLang !== "ar";
  const { t } = useTranslation();
  const [top10Array, setTop10Array] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [filteredValues, setFilteredValues] = useState([]);
  const [listItemRows, setListItemRows] = useState(10);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalContent, setProfileModalContent] = useState({});
  const [customTableHeader, setTableHeader] = useState([]);
  const [csvArray, setCsvArray] = useState([]);
  const [maxListRows, setMaxListRows] = useState(0);
  const isOld = moment(new Date(publishedDate)).isBefore(
    moment("09-01-2018", "MM-DD-YYYY")
  );

  let modalContentTimeout = null;

  useEffect(() => {
    if (typeof csvJson === "object") {
      if (csvJson.headers) {
        setTableHeader(csvJson.headers);
      }
      delete csvJson.headers;
      setCsvArray(Object.values(csvJson));
    } else {
      setCsvArray(JSON.parse(csvJson));
    }
  }, []);

  useEffect(() => {
    if (csvArray.length) {
      setMaxListRows(csvArray.length);
      if (showRank) {
        formatTop10Array();
      }
      formatTableData();
    }
  }, [csvArray]);

  const formatTop10Array = () => {
    const top10 = _.take(csvArray, 10);

    let arr = [];
    _.map(top10, (item) => {
      arr = [
        ...arr,
        {
          image: item["Image"] || item["image"] || item["الصورة"],
          name:
            item["Name"] || item["الاسم"]
              ? item["Name"] || item["الاسم"]
              : item["Company name"] || item["Company Name"],
        },
      ];
    });
    setTop10Array(arr);
  };

  const formatTableData = () => {
    let tableCols = [];
    const sortingAllowed = ["Rank", "rank", "التصنيف"];
    const sortingNotAllowed = ["image", "الصورة"];
    const headerKeys = customTableHeader.length
      ? customTableHeader
      : _.keys(csvArray[0]);
    _.map(headerKeys, (item) => {
      const key = item.toLowerCase().replace(/\s/g, "");
      if (
        !Boolean(item) ||
        key === "bio" ||
        key === "facts" ||
        key === "السيرة الذاتية"
      ) {
        return;
      }

      tableCols = [
        ...tableCols,
        {
          key: item,
          title: item,
          dataIndex: item,
          sorter:
            sortingNotAllowed.indexOf(item.toLowerCase()) >= 0
              ? false
              : (a, b) => {
                  if (sortingAllowed.indexOf(item) >= 0) {
                    return b[item] - a[item];
                  } else {
                    return b[item].localeCompare(a[item]);
                  }
                },
          defaultSortOrder: "ascend",
          render: (val, record) => {
            switch (key) {
              case "image":
              case "الصورة":
                return (
                  <img
                    className={style.tableAvatar}
                    src={val}
                    alt={record["Name"] || record["Company name"]}
                  />
                );
              case "company":
              case "companyname":
              case "name":
                return <h6>{val}</h6>;
              default:
                return val ? val : "-";
            }
          },
        },
      ];
    });

    let query = new URLSearchParams(props.location.search);

    let targetRow = null;

    for (let i = 0; i < dataSource.length; i++) {
      let chr = dataSource[i];
      const newChr = {};
      for (const property in chr) {
        const key = property.toLowerCase().replace(/\s/g, "");
        newChr[key] = chr[property];
      }
      chr = newChr;

      query.forEach((item, k) => {
        const pattern = new RegExp(item, "gi");
        if (chr[k] && pattern.test(chr[k])) {
          chr.showIt = true;
          targetRow = i;
        }
      });
      if (chr.showIt && targetRow >= 0) {
        setTimeout(() => {
          clearTimeout(modalContentTimeout);
          setProfileModalOpen(true);
          setProfileModalContent(dataSource[targetRow]);
        }, 1000);
        break;
      }
    }

    setTableColumns(tableCols);
  };

  const loadMoreList = () => {
    setListItemRows(
      maxListRows > listItemRows ? listItemRows + 10 : listItemRows
    );
  };

  const navigateModal = (direction) => {
    const currentIndex = _.findIndex(csvArray, profileModalContent);
    console.log(direction, currentIndex, maxListRows);
    const active =
      direction === "next"
        ? csvArray[currentIndex === maxListRows ? 0 : currentIndex + 1]
        : csvArray[currentIndex === 0 ? maxListRows : currentIndex - 1];
    setProfileModalContent(active);
  };

  const filterByValue = (array, string) => {
    return array.filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toLowerCase().includes(string.toLowerCase())
      )
    );
  };

  const handleSearch = (e) => {
    const filtered = filterByValue(csvArray, e.target.value);
    setSearchString(e.target.value);
    setFilteredValues(filtered);
  };

  const hideModal = () => {
    setProfileModalOpen(false);
    modalContentTimeout = setTimeout(() => {
      setProfileModalContent({});
    }, 500);
  };

  let paragraphs = content ? content.split("<br>") : [];
  paragraphs = _.filter(paragraphs, (item, index) => {
    return !/^\s*$/.test(item);
  });
  paragraphs = _.map(paragraphs, (item) => {
    return item.replace("/<[^>]*>/g", "");
  });
  const image = featuredCoverListPage
    ? `https://d1epq84pwgteub.cloudfront.net/${featuredCoverListPage}`
    : "https://i.imgur.com/gBFEoyU.jpg";
  const imageMobile = featuredCoverMonth
    ? `https://d1epq84pwgteub.cloudfront.net/${featuredCoverMonth}`
    : "https://i.imgur.com/gBFEoyU.jpg";

  let voiceString = content ? content.replace(/<[^>]*>/g, "") : "";
  voiceString = unescape(voiceString);

  const dataSource =
    filteredValues.length || searchString.length ? filteredValues : csvArray;
  const currentIndex = _.findIndex(csvArray, profileModalContent);

  return (
    <DFPSlotsProvider collapseEmptyDivs>
      <Layout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        ></script>

        <div className={style.article__banner__wrapper}>
          {isOld ? (
            <PlaceholderImage
              title={name}
              inPage={true}
              image={image}
              imageMobile={imageMobile}
            />
          ) : (
            <>
              <div className={style.article__banner__wrapper__images}>
                <img src={image} alt={name} />
                <img src={imageMobile} alt={name} />
              </div>
            </>
          )}
        </div>
        {isMobileOnly && (
          <AdWrapper margin="15px auto 35px">
            <AdSlot
              dfpNetworkId="21752631353"
              sizes={[[320, 50]]}
              adUnit={isEnglish ? "EN-MOB-list-LDBD" : "AR-MOB-list-LDBD"}
            />
          </AdWrapper>
        )}
        <Container className={style.container}>
          <Row type="flex">
            <Col xl={{ span: 18, offset: 0 }} xxl={{ span: 16, offset: 2 }}>
              <Breadcrumbs
                className={style.breadcrumb}
                trail={[
                  {
                    title: t("forbes"),
                    slug: "/",
                  },
                  {
                    title: t("lists"),
                    slug: "/list",
                  },
                ]}
              />
              <div className={style.article__title}>
                {isOld ? null : <h1 className="h2">{name}</h1>}
              </div>
              <ActionButtons paragraphs={voiceString} t={t} />

              {isMobileOnly && (
                <AdWrapper margin="15px 22px 35px">
                  <AdSlot
                    dfpNetworkId="21752631353"
                    sizes={[[300, 250]]}
                    adUnit={isEnglish ? "EN-MOB-list-MPU" : "AR-MOB-list-MPU"}
                  />
                </AdWrapper>
              )}
            </Col>
          </Row>

          <Row gutter={25} type="flex">
            <Col xl={{ span: 18, offset: 0 }} xxl={{ span: 16, offset: 2 }}>
              <SocialShare className={style.article__share} />
              <div
                className={`${style.article__content} ${
                  !isEnglish && style.article__content__ar
                }`}
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </Col>
            <Col xl={6} xxl={6}>
              {!isMobileOnly && (
                <>
                  <AdWrapper margin="15px 22px 35px">
                    <AdSlot
                      dfpNetworkId="21752631353"
                      sizes={[
                        [300, 250],
                        [300, 600],
                      ]}
                      adUnit={isEnglish ? "EN-LST-HFPG" : "AR-LST-HFPG"}
                    />
                  </AdWrapper>
                  <AdWrapper margin="15px 22px 35px">
                    <AdSlot
                      dfpNetworkId="21752631353"
                      sizes={[
                        [300, 250],
                        [300, 600],
                      ]}
                      adUnit={isEnglish ? "EN-LST-VDO-1" : "AR-LST-VDO-1"}
                    />
                  </AdWrapper>
                </>
              )}
            </Col>
          </Row>

          {showRank ? (
            <Row gutter={25} className={style.top}>
              <Col span={24}>
                <div className={style.title}>
                  <h2>{t("top10")}</h2>
                </div>
                <FeaturedListStats items={top10Array} />
              </Col>
            </Row>
          ) : null}

          <Row gutter={25} className={style.top}>
            <Col span={24}>
              <div
                className={`${style.fullList} ${
                  !isEnglish && style.fullList__ar
                }`}
              >
                <h2>{t("fullList")}</h2>
                <Input
                  placeholder={t("searchPeople")}
                  // onPressEnter={handleSearch}
                  onChange={handleSearch}
                  suffix={null}
                  prefix={<img src={SearchIcon} />}
                />
              </div>
            </Col>

            <Col span={24}>
              <Table
                rowKey={(record) => record[Object.keys(record)[0]]}
                rowClassName={style.row}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      clearTimeout(modalContentTimeout);
                      setProfileModalOpen(true);
                      setProfileModalContent(record);
                    },
                  };
                }}
                dataSource={_.take(dataSource, listItemRows)}
                columns={tableColumns}
                pagination={false}
              />
              {listItemRows < maxListRows ? (
                <Button
                  type="primary"
                  className={style.loadMore}
                  onClick={loadMoreList}
                >
                  {t("loadMore")}
                </Button>
              ) : null}
            </Col>
          </Row>
          {blogs.length ? (
            <Row type="flex" gutter={25}>
              <Col span={24}>
                <RelatedArticles blogs={blogs} isEnglish={isEnglish} t={t} />
              </Col>
            </Row>
          ) : null}
        </Container>
        <ProfileModal
          profileModalContent={profileModalContent}
          profileModalOpen={profileModalOpen}
          onCancel={hideModal}
          showRank={showRank}
          navigateModal={navigateModal}
          isEnglish={isEnglish}
          currentIndex={currentIndex}
          maxListRows={maxListRows}
        />
      </Layout>
    </DFPSlotsProvider>
  );
};

export default withRouter(ArticleTemplateList);
