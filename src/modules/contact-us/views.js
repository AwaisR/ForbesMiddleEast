import React from "react";
import _ from "lodash";
import Cookies from "js-cookie";
import { Icon } from "antd";
import { Mail, Phone } from "@icons";
import MapImage from "@images/map.jpg";
import Button from "@components/Button";
import style from "./styles.scss";

const defaultLang = Cookies.get("language") || "en";

const infoData = [
  {
    title: "For Corrections",
    email: "corrections@forbesmiddleeast.com"
  },
  {
    title: "Submit story pitches and confidential news tips",
    email: "editorialcontribution@forbesmiddleeast.com"
  },
  {
    title: "For Subscriptions",
    email: "subscription@forbesmiddleeast.com"
  },

  {
    title: "For General Info & Suggestions",
    email: "info@forbesmiddleeast.com"
  },
  {
    title: "For Advertising",
    email: "advertising@forbesmiddleeast.com"
  },
  {
    title: "For Complaints and Feedback",
    // phone: "0097143995559",
    email: "complaints@forbesmiddleeast.com"
  },
  {
    title: "Careers",
    email: "careers@forbesmiddleeast.com"
  },
  {
    title: "For help with our website, and any other technical queries",
    email: "techsupport@forbesmiddleeast.com"
  }
];

export const InfoBox = items => (
  <>
    {_.map(infoData, data => (
      <div className={style.infoBox}>
        <h2 className="h6">{data.title}</h2>
        {data.phone ? (
          <div
            className={`${style.infoBox__phone} ${defaultLang === "ar" &&
              style.infoBox__phone__ar}`}
          >
            <Icon component={Phone} />
            <a href={`tel:${data.phone}`}>{data.phone}</a>
          </div>
        ) : null}
        <div
          className={`${style.infoBox__email} ${defaultLang === "ar" &&
            style.infoBox__email__ar}`}
        >
          <Icon component={Mail} />
          <a href={`mailto:${data.email}`}>{data.email}</a>
        </div>
      </div>
    ))}
  </>
);

export const Map = () => (
  <div className={style.map}>
    <div className={style.map__image}>
      <Button
        href="https://goo.gl/maps/vSVLHAqHnW23KU9o8"
        target="_blank"
        type="secondary"
        link={true}
      >
        Open in Google Maps
      </Button>
      <img src={MapImage} alt="Map" />
    </div>
    {/* <h2 className="h5">Dubai, United Arab Emirates</h2>
    <p>
      Office 302, Al Attar Business Avenue, <br /> <br />
      Al Barsha 1, Dubai - UAE
      <br />
      United Arab Emirates
      <br />
      P.O. Box 502105
    </p> */}

    <h2 className="h5">Abu Dhabi Office</h2>
    <p>
      602, Building 6, Park Rotana Office Complex, Khalifa Park, Abu Dhabi,
      U.A.E. – P.O. Box 502105 <br />
      Tel: <a href="tel:+9714 440 8975">+9714 440 8975</a> <br />
      Fax: <a href="tel:+9714 440 8976">+9714 440 8976</a> <br />
      Email:{" "}
      <a href="mailto:info@forbesmiddleeast.com">info@forbesmiddleeast.com</a>
    </p>

    <h2 className="h5">Dubai Office</h2>
    <p>
      Office 302, Al Attar Business Avenue, Al Barsha 1,Dubai - UAE P.O. Box
      502105 <br />
      Tel: <a href="tel:+9714 3995559">+9714 3995559</a> <br />
      Fax: <a href="tel:+9714 440 8976">+9714 440 8976</a> <br />
      Email:{" "}
      <a href="mailto:readers@forbesmiddleeast.com">
        readers@forbesmiddleeast.com
      </a>
      <br />
      Email:{" "}
      <a href="mailto:subscription@forbesmiddleeast.com">
        subscription@forbesmiddleeast.com
      </a>
    </p>

    <h2 className="h5">Egypt Office</h2>
    <p>
      3rd floor, 25 Wezaret Al Zeraa St., Al Dokki, Giza Governorate, Egypt{" "}
      <br />
      Tel: <a href="tel:+202 33385845">+202 33385845 - 33385844</a> <br />
      Ahmed Mabrouk: <a href="tel:+201 225681325">+201 225681325</a> <br />
      Email:{" "}
      <a href="mailto:ahmed@forbesmiddleeast.com">ahmed@forbesmiddleeast.com</a>
    </p>

    {/* <h2 className="h5">Lebanon Media Representative</h2>
    <p>
      VIPMINDS Lebanon, Horsh Tabet, Gebran Khalil Gebran Strt, Kazandjian Blg,
      GF <br />
      Tel: <a href="tel:+961 3 477699">+961 3 477699 - +961 70 477699</a> <br />
      Tel: <a href="tel:+961 1 499550">+961 1 499550 - +961 1 499559</a> <br />
      Email: <a href="mailto:ceo@vipminds.com">ceo@vipminds.com</a>
    </p> */}
  </div>
);
