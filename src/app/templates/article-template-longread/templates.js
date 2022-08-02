import React from 'react';
import _ from 'lodash';
import Cookies from 'js-cookie';

import { Avatar, Icon, Row, Col } from 'antd';
import { Fade } from 'react-reveal';
import Button from '@components/Button';
import ArticleItem from '@components/ArticleItem';
import Author from '@components/Author';
import TextToSpeech from '@components/TextToSpeech';
import { BookmarkArticlePage, GoTo } from '@icons';
import TwitterColored from '@images/social-logos/twitter-colored.svg';
import style from './styles.scss';

const defaultLang = Cookies.get('language') || 'en';
const isEnglish = defaultLang === 'en';

export const AuthorFooter = ({ author }) => (
  <div className={style.article__author__footer}>
    <Author position={true} author={author} />
    <Row>
      <Col span={!isEnglish ? 24 : 18}>
        <p>
          I cover China with a focus on business and culture. I am pursuing a
          Master of Journalism degree at the University of Hong Kong. I have
          experiences in all aspects of mult..
        </p>
      </Col>
    </Row>
  </div>
);

export const ActionButtons = ({ isBookmarked, paragraphs, handleBookMark }) => (
  <div className={style.action__buttons}>
    <Button
      type={isBookmarked ? 'action__light__playing' : 'action__light'}
      onClick={handleBookMark}
    >
      {isBookmarked ? 'Remove from' : 'Add to'} Bookmarks{' '}
      <Icon component={BookmarkArticlePage} />
    </Button>
    <TextToSpeech type='action__light' text={paragraphs} />
  </div>
);

export const TwitterWidget = () => (
  <a className={style.twitter} href='twitter.com' target='_blank'>
    <span>
      He made the comments during a conversation with historian and author Yuval
      Noah Harari that was uploaded to Facebook on Friday.
    </span>
    <img src={TwitterColored} />
  </a>
);

export const YouMayAlsoLike = () => (
  <div className={style.ymal}>
    <div className={style.ymal__header}>
      <h6>You May Also Like</h6>
    </div>
    <div className={style.ymal__content}>
      <div>
        <p>Brand Voice</p>
        <h5>
          Understanding The 2019 Ocean Freight Market Through The Lens Of 2018
        </h5>
        <Author footer={true} />
      </div>
      <div>
        <p>Brand Voice</p>
        <h5>
          Understanding The 2019 Ocean Freight Market Through The Lens Of 2018
        </h5>
        <Author footer={true} />
      </div>
    </div>
  </div>
);

export const FeaturedPage = () => (
  <Row>
    <Col span={18}>
      <Fade bottom duration={700} distance='100px' delay={100} ssrReveal={true}>
        <p>
          Facebook CEO Mark Zuckerberg said recently that he recognized the
          growing chorus of Indian voices demanding data localization, but
          asserted that meeting those demands could establish dangerous
          precedents in other countries where the potential for misuse remained
          high. He made the comments during a conversation with historian and
          author Yuval Noah Harari that was uploaded to Facebook on Friday.
        </p>
        <p>
          One of the more prominent voices demanding localization belongs to
          India’s richest man, Reliance Chairman Mukesh Ambani, who declared
          recently that Indian data should be owned exclusively by Indian
          citizens. His remarks have further fueled the debate raging over data
          localization in the world’s fastest growing internet market.
        </p>
      </Fade>
    </Col>
    <Col span={6}>
      <Fade bottom duration={700} distance='100px' delay={100} ssrReveal={true}>
        <a className={style.featuredpage}>
          <Avatar src='https://i.imgur.com/HDvi1oj.png' size={98} />

          <h6> Abdulla Bin Ahmed Al Ghurair </h6>
          <span className={style.featuredpage__span}>
            Lists <Icon component={GoTo} />
          </span>
        </a>
      </Fade>
    </Col>
  </Row>
);

export const RelatedArticles = ({ relatedArticles }) => {
  return (
    <div className={style.related}>
      <h2 className='h5'>Related Articles</h2>
      <Row gutter={25} type='flex'>
        {_.map(relatedArticles, (item, index) => {
          return (
            <Col md={12} key={index} style={{ marginBottom: 45 }}>
              <ArticleItem tag='h3' medium data={item} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
