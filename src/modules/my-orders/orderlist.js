import React, { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { Row, Col, message, Input, Modal } from "antd";

import Button from "@components/Button";
import { apiGetAuth, apiPostAuth } from "@services";
import OrderDetails from './orderdetail';
import style from "./styles.scss";

export default () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({});
  const [page, setPage] = useState(0);
  const [problem, setProblem] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getList();
  }, []);


  const getDiscountPrice = (price, qty, discount) => {
    const p = Number(price) * parseInt(qty);
    const d = Number(discount) * parseInt(qty);
    if( p > d){
      return p - d;
    }
    return p
  }

  const getList = () => {
    apiGetAuth(
      `/users/orders?page=${page}`,
      (res) => {
        if (res.data && res.data.length) {
          setList(res.data);
        }
      },
      () => {}
    );
  };

  const showModal = (selected) => {
    setSelected(selected);
    setIsVisible(true);
  };
  const showOrderDetailModal = (selected) => {
    setSelected(selected);
    setIsOrderDetailVisible(true);
  };

  const closeModal = () => {
    setSelected({});
    setIsVisible(false);
  };
  const closeOrderDetailModal = () => {
    setSelected({});
    setIsOrderDetailVisible(false);
  };

  const updateProblem = (problem) => {
    setProblem(problem.target.value);
  };

  const submitProblem = () => {
    if (problem.length < 20) {
      message.error("Message should be at least 20 characters");
      return;
    }

    apiPostAuth(
      `/users/orders`,
      { order_id: selected.id, message: problem },
      (res) => {
        message.success(
          "Thank you for submission. One of our staffs will get in touch with you shortly!"
        );
      },
      () => {}
    );
  };

  const OrderList = list.map((item, index) => {

    const { id, total, discount, created_at, status } = item;
    return (
      <Row type="flex" key={index}>
        <Col lg={24} className={style.list__item}>
          <Row type="flex" align="middle">
            <Col xs={24} sm={12} md={4}>
              <div>
                <h3 className="p">
                  {t('order') + ' #' + id}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={12} md={2}>
              <div>
                <span className={style.list__date}>
                  {moment(created_at).format("DD MMM YYYY")}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div className="text-left">
                {
                  Number(total) && discount > 0 ? (
                    <span className={style.list__price}>
                      <span className={style.price__strike}>${total}</span>
                      {' '}${getDiscountPrice(total,1, discount)} USD</span>
                  ) : (
                    <span className={style.list__price}>{ Number(total) ? `$${total} USD` : 'FREE'}</span>
                  )
                }
              </div>
            </Col>
            <Col xs={24} sm={12} md={2}>
              <div>
                <span className={style.list__price}>{status.name}</span>
              </div>
            </Col>
            <Col>
              <div className="text-center">
                <a
                  onClick={() => {
                    showOrderDetailModal(item);
                  }}
                  className={`link-with-arrow`}
                >
                  {t("viewOrderDetails")}
                </a>
              </div>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <div className="text-center">
                <a
                  onClick={() => {
                    showModal({
                      id: id,
                      item
                    });
                  }}
                  className={`link-with-arrow ${style.list__cancel}`}
                >
                  {t("reportAProblem")}
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
        onCancel={closeModal}
        closable={false}
        footer={null}
      >
        <h6>
          {t('order')}: #{selected.id}
        </h6>
        <p>Report your Problem related to this Order</p>
        <Input.TextArea
          minLength={10}
          placeholder={"Explain your problem with at least 10 words"}
          value={problem}
          onChange={updateProblem}
        />
        <p />
        <Button type="primary" onClick={submitProblem}>
          Submit
        </Button>
      </Modal>

      <Modal
        centered
        visible={isOrderDetailVisible}
        onCancel={closeOrderDetailModal}
        closable={false}
        footer={null}
        width={960}
      >
        <OrderDetails order={selected} />
      </Modal>


      {list.length ? OrderList : <p>You have not placed any orders yet!</p>}
    </div>
  );
};
