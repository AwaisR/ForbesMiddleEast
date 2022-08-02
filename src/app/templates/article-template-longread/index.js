import React, { useState } from 'react';
import _ from 'lodash';
import { Row, Col } from 'antd';
import { Fade } from 'react-reveal';
import Cookies from 'js-cookie';
import Quotation from '@components/Quotation';
import Container from '@components/Container';
import Breadcrumbs from '@components/Breadcrumbs';
import Carousel from '@components/CarouselLightbox';
import SocialShare from '@components/SocialShare';
import Author from '@components/Author';
import { unescape, bookmarkItem, isItemBookmarked } from '@utils';

import style from './styles.scss';
import {
  TwitterWidget,
  ActionButtons,
  YouMayAlsoLike,
  FeaturedPage,
  AuthorFooter,
  RelatedArticles
} from './templates';
// https://i.imgur.com/zuabhZW.jpg banner image

const defaultLang = Cookies.get('language') || 'en';
const isEnglish = defaultLang === 'en';

const ArticleView = ({
  articleDetails: {
    title,
    author,
    publishedDate,
    content,
    featuredImage,
    relatedArticles,
    category,
    slug
  },
  hideHeader = false
}) => {
  const categoryName = (category && category.slug) || '';
  const categoryParent = category
    ? category.parent
      ? category.parent.slug
      : null
    : null;
  const cLink = `/${categoryParent}/${categoryName}`;
  const [isBookmarked, setIsBookmarked] = useState(
    isItemBookmarked(`${cLink}/${encodeURIComponent(slug)}`)
  );

  const handleBookMark = obj => {
    // console.log('bookmark', obj);
    bookmarkItem(obj, bool => {
      setIsBookmarked(bool);
    });
  };

  let paragraphs = content.split('<br>');
  paragraphs = _.filter(paragraphs, (item, index) => {
    return !/^\s*$/.test(item);
  });
  paragraphs = _.map(paragraphs, item => {
    return item.replace('/<[^>]*>/g', '');
  });
  const image = featuredImage
    ? `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`
    : 'https://i.imgur.com/gBFEoyU.jpg';

  let voiceString = content.replace(/<[^>]*>/g, '');
  voiceString = unescape(voiceString);

  const bookmarkObject = {
    type: 'article',
    link: `${cLink}/${encodeURIComponent(slug)}`,
    title: title
  };

  return (
    <div itemScope itemType='http://schema.org/Article'>
      <div
        className={
          hideHeader
            ? style.article__banner__wrapper__zero
            : style.article__banner__wrapper
        }
      >
        <div
          className={style.article__banner}
          style={{ backgroundImage: `url(${image})` }}
        />
        <Container className={style.article__banner__text}>
          <Row gutter={25}>
            <Col lg={{ span: 16, offset: 4 }}>
              <div>
                {hideHeader ? null : (
                  <Breadcrumbs
                    className={style.breadcrumb}
                    trail={[
                      {
                        title: 'Forbes',
                        slug: '/'
                      },
                      {
                        title: isEnglish
                          ? category.parent.name
                          : category.parent.nameAR
                          ? category.parent.nameAR
                          : category.parent.name,
                        slug: `/${category.parent.slug}`
                      },
                      {
                        title: isEnglish
                          ? category.name
                          : category.nameAR
                          ? category.nameAR
                          : category.name,
                        slug: `/${category.parent.slug}/${category.slug}`
                      }
                    ]}
                  />
                )}
                <div className={style.article__title}>
                  <p itemProp='articleSection'>
                    {category
                      ? isEnglish
                        ? category.name
                        : category.nameAR
                        ? category.nameAR
                        : category.name
                      : ''}
                  </p>
                  <h1 itemProp='name' className='h2'>
                    {title}
                  </h1>
                </div>
                <Author
                  author={author}
                  date={publishedDate}
                  className='article__author__light'
                />
                <ActionButtons
                  paragraphs={voiceString}
                  handleBookMark={() => handleBookMark(bookmarkObject)}
                  isBookmarked={isBookmarked}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className={style.container}>
        <Row gutter={25}>
          <Col lg={{ span: 16, offset: 4 }}>
            <SocialShare
              className={style.article__share}
              link={`${cLink}/${encodeURIComponent(slug)}`}
            />

            <div
              className={`${style.article__content} ${!isEnglish &&
                style.article__content__ar}`}
              itemProp='articleBody'
              dangerouslySetInnerHTML={{ __html: content }}
            >
              {/* {_.map(paragraphs, (item, index) => {
                return (
                  <>
                    <Fade bottom duration={700} distance="100px" ssrReveal={true}>
                      <p
                        className={index === 0 ? style.paragraph__intro : null}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    </Fade>

                    {
                      {
                        1: (
                          <Fade bottom duration={700} distance="100px" ssrReveal={true}>
                            <TwitterWidget />
                          </Fade>
                        ),
                        2: (
                          <Fade bottom duration={700} distance="100px" ssrReveal={true}>
                            <Quotation className={style.quotation} />
                          </Fade>
                        ),
                        3: (
                          <Fade bottom duration={700} distance="100px" ssrReveal={true}>
                            <YouMayAlsoLike />
                          </Fade>
                        ),
                        4: (
                          <Fade bottom duration={700} distance="100px" ssrReveal={true}>
                            <Carousel />
                          </Fade>
                        ),
                      }[index]
                    }
                  </>
                );
              })} */}

              {/* <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
                <TwitterWidget />
              </Fade>
              <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
                <Quotation className={style.quotation} />
              </Fade>
              
              <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
                <YouMayAlsoLike />
              </Fade> */}
            </div>
          </Col>
        </Row>
      </Container>
      {/* <Container fluid={true}>
        <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}>
          <Carousel className={style.carousel} longread={true} />
        </Fade>
      </Container> */}

      <Container>
        <Row>
          <Col lg={{ span: 16, offset: 4 }}>
            {/* <div className={style.article__content}>
              <FeaturedPage />
            </div> */}
            <Fade
              bottom
              duration={700}
              distance='100px'
              delay={100}
              ssrReveal={true}
            >
              <AuthorFooter author={author} />
            </Fade>
            <RelatedArticles relatedArticles={relatedArticles} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
// class ArticleView extends React.Component {
//   render() {
//     const {
//       title,
//       author,
//       publishedDate,
//       content,
//       featuredImage
//     } = this.props.articleDetails;
//     let paragraphs = content.split("<br>");
//     paragraphs = _.filter(paragraphs, (item, index) => {
//       return !/^\s*$/.test(item);
//     });
//     paragraphs = _.map(paragraphs, item => {
//       return item.replace("/<[^>]*>/g", "");
//     });
//     const image = featuredImage
//       ? `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`
//       : "https://i.imgur.com/gBFEoyU.jpg";

//     let voiceString = content.replace(/<[^>]*>/g, "");
//     voiceString = unescape(voiceString);
//     console.log(voiceString);
//     return (
//       <Layout footer={false} lightHeader={true}>
//         <div itemScope itemType="http://schema.org/Article">
//           <div className={style.article__banner__wrapper}>
//             <div
//               className={style.article__banner}
//               style={{ backgroundImage: `url(${image})` }}
//             />
//             <Container className={style.article__banner__text}>
//               <Row gutter={25}>
//                 <Col lg={{ span: 16, offset: 4 }}>
//                   <div>
//                     <Fade
//                       bottom
//                       duration={700}
//                       distance="100px"
//                       delay={300}
//                       ssrReveal={true}
//                     >
//                       <Breadcrumbs
//                         className={style.breadcrumb}
//                         trail={[
//                           {
//                             title: "Forbes",
//                             slug: "/"
//                           },
//                           {
//                             title: "Billionaires",
//                             slug: "/billionaires"
//                           },
//                           {
//                             title: "Industry",
//                             slug: ""
//                           }
//                         ]}
//                       />
//                       <div className={style.article__title}>
//                         <p itemProp="articleSection">Business</p>
//                         <h1 itemProp="name" className="h2">
//                           {title}
//                         </h1>
//                       </div>
//                       <Author
//                         author={author}
//                         date={publishedDate}
//                         className="article__author__light"
//                       />
//                       <ActionButtons paragraphs={voiceString} />
//                     </Fade>
//                   </div>
//                 </Col>
//               </Row>
//             </Container>
//           </div>
//           <Container className={style.container}>
//             <Row gutter={25}>
//               <Col lg={{ span: 16, offset: 4 }}>
//                 <SocialShare className={style.article__share} />

//                 <div
//                   className={style.article__content}
//                   itemProp="articleBody"
//                   dangerouslySetInnerHTML={{ __html: content }}
//                 >
//                   {/* {_.map(paragraphs, (item, index) => {
//                   return (
//                     <>
//                       <Fade bottom duration={700} distance="100px" ssrReveal={true}>
//                         <p
//                           className={index === 0 ? style.paragraph__intro : null}
//                           dangerouslySetInnerHTML={{ __html: item }}
//                         />
//                       </Fade>

//                       {
//                         {
//                           1: (
//                             <Fade bottom duration={700} distance="100px" ssrReveal={true}>
//                               <TwitterWidget />
//                             </Fade>
//                           ),
//                           2: (
//                             <Fade bottom duration={700} distance="100px" ssrReveal={true}>
//                               <Quotation className={style.quotation} />
//                             </Fade>
//                           ),
//                           3: (
//                             <Fade bottom duration={700} distance="100px" ssrReveal={true}>
//                               <YouMayAlsoLike />
//                             </Fade>
//                           ),
//                           4: (
//                             <Fade bottom duration={700} distance="100px" ssrReveal={true}>
//                               <Carousel />
//                             </Fade>
//                           ),
//                         }[index]
//                       }
//                     </>
//                   );
//                 })} */}

//                   {/* <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
//                   <TwitterWidget />
//                 </Fade>
//                 <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
//                   <Quotation className={style.quotation} />
//                 </Fade>

//                 <Fade bottom duration={700} distance="100px" delay={300} ssrReveal={true}>
//                   <YouMayAlsoLike />
//                 </Fade> */}
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//           {/* <Container fluid={true}>
//           <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}>
//             <Carousel className={style.carousel} longread={true} />
//           </Fade>
//         </Container> */}

//           <Container>
//             <Row>
//               <Col lg={{ span: 16, offset: 4 }}>
//                 {/* <div className={style.article__content}>
//                 <FeaturedPage />
//               </div> */}
//                 <Fade
//                   bottom
//                   duration={700}
//                   distance="100px"
//                   delay={100}
//                   ssrReveal={true}
//                 >
//                   <AuthorFooter author={author} />
//                 </Fade>
//                 <RelatedArticles />
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </Layout>
//     );
//   }
// }

export default ArticleView;
