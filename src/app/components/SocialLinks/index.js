import React from 'react';
import style from './styles.scss';
import Facebook from '@images/social-logos/facebook.svg';
import LinkedIn from '@images/social-logos/linkedin.svg';
import Twitter from '@images/social-logos/twitter.svg';
import Google from '@images/social-logos/google.svg';
import Instagram from '@images/social-logos/instagram.svg';

import FacebookDark from '@images/social-logos/facebook-dark.svg';
import LinkedInDark from '@images/social-logos/linkedin-dark.svg';
import TwitterDark from '@images/social-logos/twitter-dark.svg';
import GoogleDark from '@images/social-logos/google-dark.svg';
import InstagramDark from '@images/social-logos/instagram-dark.svg';
const SocialLinks = ({ dark }) => {
  return (
    <ul className={style.social__logos}>
      <li>
        <a href="https://www.facebook.com/forbes.ME" target="_blank">
          <img src={dark ? FacebookDark : Facebook} />
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/company/forbes-middle-east---arab-publisher-house/" target="_blank">
          <img src={dark ? LinkedInDark : LinkedIn} />
        </a>
      </li>
      <li>
        <a href="https://twitter.com/forbesme" target="_blank">
          <img src={dark ? TwitterDark : Twitter} />
        </a>
      </li>
      <li>
        <a href="https://www.youtube.com/user/ForbesMiddleEast" target="_blank">
          <img src={dark ? GoogleDark : Google} />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/ForbesMiddleEast/" target="_blank">
          <img src={dark ? InstagramDark : Instagram} />
        </a>
      </li>
    </ul>
  );
};

SocialLinks.defaultProps = {
  dark: true,
};

export default SocialLinks;
