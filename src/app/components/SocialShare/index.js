import React from "react";
import { Icon, message } from "antd";
import { withRouter } from "react-router-dom";
import style from "./styles.scss";
import { Share } from "@icons";
import config from "@config";
import Facebook from "@images/social-logos/facebook.svg";
import LinkedIn from "@images/social-logos/linkedin.svg";
import Twitter from "@images/social-logos/twitter.svg";
import WhatsApp from "@images/social-logos/whatsapp.svg";
import CopyToClipboard from "@images/social-logos/copy.svg";

const SocialShare = ({
  className,
  link,
  hideCopy,
  directLink,
  socialAccounts,
  ...props
}) => {
  const handleClick = platform => {
    if (directLink) {
      window.open(platform, "_blank");
      return;
    }
    const shareUrl = config.shareUrls[platform];
    window.open(
      `${shareUrl}${link ? location.origin + link : location.href}`,
      `${platform}-popup`,
      "height=400,width=600"
    );
  };

  const handleCopy = () => {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = link ? `${location.origin}${link}` : location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    message.success("Link copied to clipboard");
  };

  return (
    <ul className={` ${style.social__logos} ${className}`}>
      <li>
        <a
          onClick={() =>
            handleClick(directLink ? socialAccounts.facebook : "facebook")
          }
        >
          <img src={Facebook} />
        </a>
      </li>
      <li>
        <a
          onClick={() =>
            handleClick(directLink ? socialAccounts.linkedIn : "linkedin")
          }
        >
          <img src={LinkedIn} />
        </a>
      </li>
      <li>
        <a
          onClick={() =>
            handleClick(directLink ? socialAccounts.twitter : "twitter")
          }
        >
          <img src={Twitter} />
        </a>
      </li>
      {directLink ? null : (
        <li>
          <a onClick={() => handleClick("whatsapp")}>
            <img src={WhatsApp} />
          </a>
        </li>
      )}
      {hideCopy ? null : (
        <li>
          <a onClick={handleCopy}>
            <img src={CopyToClipboard} />
          </a>
        </li>
      )}
    </ul>
  );
};

export default withRouter(SocialShare);
