import React from "react";
import _ from "lodash";
import { Row, Col } from "antd";
import { Fade } from "react-reveal";
import { LoadingMore } from "@components/Loader";
import { PageListSlider } from "@components/CategoryContentBlocks";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { EventItem } from "@components/NonArticleBlocks";
import style from "./styles.scss";

const sample = [
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "Top 50 Indian Executives",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  },
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "The Middle East Under 30",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  },
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "The Middle East Under 30",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  },
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "Top 50 Indian Executives",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  },
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "The Middle East Under 30",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  },
  {
    image: "https://i.imgur.com/0uhbon9.jpg",
    title: "The Middle East Under 30",
    description:
      "India's Data Localization Remains A Key Challenge For Company",
    company: {
      username: "Jeanette Mendoza",
      image: "https://i.imgur.com/GMHvmkh.png"
    }
  }
];

const sampleFeatured = {
  items: [
    {
      image: "https://i.imgur.com/0uhbon9.jpg",
      title: "Gulf Business Machine",
      description:
        "India's Data Localization Remains A Key Challenge For Company",
      company: {
        username: "Jeanette Mendoza",
        image: "https://i.imgur.com/GMHvmkh.png"
      },
      featured: true
    },
    {
      image: "https://i.imgur.com/0uhbon9.jpg",
      title: "Gulf Business Machine",
      description:
        "India's Data Localization Remains A Key Challenge For Company",
      company: {
        username: "Jeanette Mendoza",
        image: "https://i.imgur.com/GMHvmkh.png"
      },
      featured: true
    }
  ]
};

class Brandvoice extends React.Component {
  render() {
    return (
      <Container className={style.container}>
        <Breadcrumbs
          trail={[
            {
              title: "Forbes",
              slug: "/"
            },
            {
              title: "Events",
              slug: "/events"
            }
          ]}
        />
        <Row gutter={25}>
          {_.map(sample, (item, index) => (
            <Col key={index} span={8} style={{ marginBottom: 25 }}>
              <Fade bottom duration={700} distance="100px" ssrReveal>
                <EventItem item={item} />
              </Fade>
            </Col>
          ))}
        </Row>
        <LoadingMore />
      </Container>
    );
  }
}

export default Brandvoice;
