import React from "react";
import { Icon } from "antd";
import { withRouter } from "react-router-dom";
import Button from "@components/Button";
import { PlaySound } from "@icons";
import { extractLanguage } from "@utils";
// import Cookies from "js-cookie";

class TextToSpeechComponent extends React.Component {
  static defaultProps = {
    type: "action"
  };
  constructor(props) {
    super(props);
    this.state = {
      status: null
    };
  }

  playSound = () => {
    const text = String(this.props.text.replace(/<[^>]*>?/gm, ""));
    const { status } = this.state;
    const language = extractLanguage(this.props.location.pathname);
    switch (status) {
      case "paused":
        responsiveVoice.resume();
        this.setState({
          status: "playing"
        });
        break;
      case "playing":
        responsiveVoice.pause();
        this.setState({
          status: "paused"
        });
        break;

      default: {
        responsiveVoice.cancel();
        responsiveVoice.speak(
          text,
          language === "en" ? "UK English Female" : "Arabic Female",
          {
            onend: () => {
              responsiveVoice.cancel();
              this.setState({
                status: null
              });
            }
          }
        );
        this.setState({
          status: "playing"
        });
      }
    }
  };
  componentWillUnmount() {
    responsiveVoice.cancel();
  }

  render() {
    const { status } = this.state;
    const { type, t } = this.props;
    const typePlaying = `${type}__playing`;
    return (
      <Button
        type={status && status !== "paused" ? typePlaying : type}
        onClick={this.playSound}
      >
        {
          {
            null: t("playSound"),
            paused: t("resume"),
            playing: t("pause")
          }[status]
        }
        <Icon component={PlaySound} />
      </Button>
    );
  }
}

export default withRouter(TextToSpeechComponent);
