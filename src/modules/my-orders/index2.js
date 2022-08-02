import React from "react";
import _ from "lodash";
import moment from "moment";
import { Row, Col, message, Input, Modal } from "antd";
import Container from "@components/Container";
import Button from "@components/Button";
import Breadcrumbs from "@components/Breadcrumbs";
import { apiGetAuth, apiPostAuth } from "@services";
import style from "./styles.scss";

const langType = {
  ar: "Arabic",
  en: "English"
};

class SubscriptionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      list: [],
      selected: {},
      page: 0
    };
  }

  componentWillMount() {
    this.getList();
  }

  confirmCancel = () => {
    const { selected } = this.state;
    apiPostAuth(
      `/cancel-order`,
      { order_id: selected.id },
      res => {
        // console.log(res);
        message.info("Your subscription has been cancelled!");
        this.setState(
          {
            page: 0,
            selected: {},
            isVisible: false
          },
          this.getList
        );
      },
      () => {}
    );
  };

  showModal = selected => {
    this.setState({
      selected: selected,
      isVisible: true
    });
  };

  closeModal = () => {
    this.setState({
      selected: {},
      isVisible: false
    });
  };

  getList = () => {
    const { page, list } = this.state;
    apiGetAuth(
      `/users/subscriptions?page=${page}`,
      res => {
        const subs = Object.values(
          _.groupBy(res.data, o => {
            return o.order.id;
          })
        );

        this.setState({
          list: [...list, ...subs]
        });
      },
      () => {}
    );
  };

  render() {
    const { list, isVisible, selected } = this.state;

    const SubscriptionList = list.map((subscription, index) => {
      const common = subscription[0];
      const languages = subscription.map(sub => {
        return langType[sub.subscription.language];
      });
      const name = common.subscription.name;
      const nameSub = languages.join(", ") + " | " + common.subscription.region;
      const nextDate = common.order.endDate;
      return (
        <Row key={index}>
          <Col span={20} className={style.list__item}>
            <Row type="flex" align="middle">
              <Col span={6}>
                <div>
                  <h3 className="p">
                    Forbes : {name}{" "}
                    <span style={{ display: "block" }}>{nameSub}</span>
                  </h3>
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <span className={style.list__date}>
                    Next billing date: {moment(nextDate).format("DD MMM YYYY")}
                  </span>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center">
                  <a
                    onClick={() => {
                      this.showModal({
                        id: common.order.id,
                        date: moment(nextDate).format("DD MMM YYYY")
                      });
                    }}
                    className={`link-with-arrow ${style.list__cancel}`}
                  >
                    Cancel Subscriptions
                  </a>
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <p className={style.list__description}>
                    If you cancel now, you can still access your subscription
                    until {moment(nextDate).format("DD MMM YYYY")}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    });

    return (
      <div className={style.list}>
        <Modal
          className={style.modal}
          centered
          visible={isVisible}
          onCancel={this.closeModal}
          closable={false}
          footer={null}
        >
          <h6>Confirm Cancellation</h6>
          <p>
            If you confirm and end your subscription now, you can still access
            it until {selected.date}
          </p>
          <div className={style.modal__footer}>
            <Button type="secondary" onClick={this.closeModal}>
              Not Now
            </Button>
            <Button type="primary" onClick={this.confirmCancel}>
              Confirm
            </Button>
          </div>
        </Modal>
        <div className={style.list}>
          {list.length ? (
            SubscriptionList
          ) : (
            <p>You are not subscribed to any magazines yet!</p>
          )}
        </div>
      </div>
    );
  }
}

class OrderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      list: [],
      problem: "",
      selected: {},
      page: 0
    };
  }

  componentWillMount() {
    this.getList();
  }

  updateProblem = problem => {
    this.setState({ problem: problem.target.value });
  };

  submitProblem = () => {
    const { selected, problem } = this.state;

    // console.log(selected, problem);
    if (problem.length < 20) {
      return;
    }

    apiPostAuth(
      `/users/orders`,
      { order_id: selected.id, message: problem },
      res => {
        // console.log(res);
        message.success(
          "Thank you for submission. Our executive will get in touch with you shortly!"
        );
      },
      () => {}
    );
  };
  showModal = selected => {
    this.setState({
      selected: selected,
      isVisible: true
    });
  };

  closeModal = () => {
    this.setState({
      selected: {},
      isVisible: false
    });
  };

  getList = () => {
    const { page, list } = this.state;
    apiGetAuth(
      `/users/orders?page=${page}`,
      res => {
        if (res.data && res.data.length) {
          // console.log("orders", res.data[0].orderitems);
          this.setState({
            list: [...list, res.data[0].orderitems]
          });
        }
        // const orders = Object.values(
        //   _.groupBy(res.data, o => {
        //     return o.order.id;
        //   })
        // );
      },
      () => {}
    );
  };

  render() {
    const { list, isVisible, selected, problem } = this.state;
    const OrderList = list.map((order, index) => {
      const common = order[0];
      const languages = order.map(sub => {
        return langType[sub.subscription.language];
      });
      const name = common.subscription.name;
      const nameSub = languages.join(", ") + " | " + common.subscription.region;
      const nextDate = common.order.endDate;
      const date = common.order.startDate;
      const price = common.order.total;
      return (
        <Row key={index}>
          <Col span={16} className={style.list__item}>
            <Row type="flex" align="middle">
              <Col span={6}>
                <div>
                  <h3 className="p">
                    Forbes : {name}{" "}
                    <span style={{ display: "block" }}>{nameSub}</span>
                  </h3>
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <span className={style.list__date}>{date}</span>
                </div>
              </Col>
              <Col span={2}>
                <div>
                  <span className={style.list__price}>USD {price}</span>
                </div>
              </Col>
              <Col span={10}>
                <div className="text-center">
                  <a
                    onClick={() => {
                      this.showModal({ id: common.order.id, name, nameSub });
                    }}
                    className={`link-with-arrow ${style.list__cancel}`}
                  >
                    Report a Problem
                  </a>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    });
    return (
      <div className={style.list}>
        <Modal
          className={style.modal}
          centered
          visible={isVisible}
          onCancel={this.closeModal}
          closable={false}
          footer={null}
        >
          <h6>
            {selected.name}: {selected.nameSub}
          </h6>
          <p>Report your Problem related to this Order</p>
          <Input.TextArea
            minLength={10}
            placeholder={"Explain your problem with at least 10 words!"}
            value={problem}
            onChange={this.updateProblem}
          />
          <p />
          <Button type="primary" onClick={this.submitProblem}>
            Submit
          </Button>
        </Modal>
        {list.length ? OrderList : <p>You have not placed any orders yet!</p>}
      </div>
    );
  }
}

const MyAccount = () => {
  return (
    <Container className={style.container}>
      <Breadcrumbs
        trail={[
          {
            title: "Forbes",
            slug: "/"
          },
          {
            title: "Account",
            slug: "/my-account"
          },
          {
            title: "my Orders",
            slug: "/my-orders"
          }
        ]}
      />
      <div className={style.subscriptions}>
        <div className={style.header}>
          <h1 className="h4">Subscriptions</h1>
        </div>
        <SubscriptionList />
      </div>
      <div className={style.orders}>
        <div className={style.header}>
          <h2 className="h4">Orders</h2>
        </div>
        <OrderList />
      </div>
    </Container>
  );
};

export default MyAccount;
