import React from "react";
import {
  Row,
  Col,
  message, Modal,
} from "antd";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import AppButton from "@components/Button";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import style from "./styles.scss";
import { isLoggedIn } from "@utils";
import { apiGetAuth, apiPostAuthFormData } from "@services";
import UpdateCartItem from "./UpdateCartItemPopup";
import { TYPE, LANG} from "./magazineConfig";
const { confirm } = Modal;

class Cart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.isEnglish = this.props.i18n.language !== "ar";
    this.state = {
      isUpdateItemVisible: false,
      selectedItem: {},
      order: {}
    };
  }


  getDiscountPrice = (price, qty, discount) => {
    const p = Number(price) * parseInt(qty);
    const d = Number(discount) * parseInt(qty);
    if( p > d){
      return p - d;
    }
    return p
  }

  getOrder = () => {
    apiGetAuth(
      "/get-cart",
      (response) => {
        this.setState({
          order: response.data
        })
      },
      (error) => {
        console.log("An error occurred:", error);
        this.setState({
          order: {
            orderitems: [],
            total: 0
          }
        })
      }
    );
  }

  componentDidMount() {
    if (!isLoggedIn()) {
      this.props.history.push(this.isEnglish ? "/login" : "/ar/login");
    }
    this.getOrder();
  }

  goToMagazine = () => {
    this.props.history.push(
              this.isEnglish
                ? "/magazines"
                : "/ar/magazines"
            );
  }

  editItem = (item) => {
    this.setState({
      selectedItem: item,
      isUpdateItemVisible: true
    })
  }

  closeItemUpdateModal = (updateCart) => {
    this.setState({
      isUpdateItemVisible: false,
      selectedItem: {}
    }, () => {
      if(updateCart){
        this.getOrder();
      }
    })
  };

  removeFromCartConfirm = (item) => {
    const { t } = this.props;
    confirm({
      title: t('confirmDeleteItemText'),
      okText: t('yes'),
      okType: 'danger',
      cancelText: t('no'),
      onOk : () => {
        this.removeFromCart(item)
      },
    });
  }

  removeFromCart = (item) => {
    // return;
    apiPostAuthFormData(
      "/remove-item",
      {
        magazine: item.magazine.id,
        orderID: item.order,
        region: item.region,
        subscriptionType: item.subscriptionType
      },
      (response) => {
        message.success("Item removed!");
        this.getOrder();
      },
      (error) => {
        console.log("An error occurred:", error);
        message.error("Something went wrong! Please try again");
      }
    );
  }



  checkout = () => {
    const {
      price,
    } = this.state.order;
    const { history } = this.props;
    if (price <= 0) {
      message.error("Please double check your order.");
      return;
    }
    history.push(
      this.isEnglish
        ? "/magazines/cart/checkout"
        : "/ar/magazines/cart/checkout"
    );
  };

  render() {
    const { t } = this.props;
    const { order, selectedItem, isUpdateItemVisible } = this.state;
    const {
      id,
      total,
      discount,
      orderitems = []
    } = order;


    return (
      <Container medium={true} className={`${style.container} magazine-cart`}>
        <div className={style.attendbar}>
          <Container>
            <Row>
              <Col span={12}>
                <div className={`${style.price__container} ${style.attendbar_left}`}>
                  {
                    total ? (
                      <>
                        <span className={style.price}>
                           TOTAL:
                        </span>
                            <span className={style.price__large}>
                          <span hidden={discount == 0} className={style.price__large_cut}>${total}</span>
                              { ' '} ${this.getDiscountPrice(total, 1, discount)}
                              {' '} USD
                        </span>
                      </>
                    ) : null
                  }
                </div>
              </Col>
              <Col span={12} className={this.isEnglish ? style.attendbar_right : style.attendbar_right}>
                {
                  (orderitems.length && total ) ? (
                    <AppButton
                      type="primary"
                      size="small"
                      style={{
                        width: "auto",
                      }}
                      onClick={this.checkout}
                    >
                      {t("continueToCheckout")}
                    </AppButton>
                  ) : null
                }
              </Col>
            </Row>
          </Container>
        </div>
        <Breadcrumbs
          trail={[
            {
              title: t("forbes"),
              slug: "/",
            },
            {
              title: t("magazines"),
              slug: `${!this.isEnglish ? "" : "/ar"}/magazines`,
            },
            {
              title: t("cart"),
            },
          ]}
        />
        <h1 className="h4">{t("cart")}</h1>

        <div className={style.form}>
          <Row
            type="flex"
            align="bottom"
            gutter={12}
            className={style.form__header}
          >
            <Col span={4}>
              <h6>{t("item")}</h6>
            </Col>
            <Col span={2}>
              <h6>{t("region")}</h6>
            </Col>
            <Col span={4}>
              <h6>{t("type")}</h6>
            </Col>
            <Col span={3}>
              <h6>{t("language")}</h6>
            </Col>
            <Col span={2}>
              <h6>{t("quantity")}</h6>
            </Col>
            <Col span={4}>
              <h6>{t("price")}</h6>
            </Col>
          </Row>
          {
            orderitems.length ? orderitems.map((item, index) => {
              return (
                <Row gutter={12} className={style.table__row} key={'order-item-'+index}>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={4}>
                    <label>{t("name")}</label>
                    <h6 className={style.ellipsis}>{item.magazine.name}</h6>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={2}>
                    <label>{t("region")}</label>
                    <h6>{item.region}</h6>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={4}>
                    <label>{t("type")}</label>
                    <h6>{TYPE[item.subscriptionType]}</h6>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={3}>
                    <label>{t("language")}</label>
                    <h6>{LANG[item.subscriptionType]}</h6>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={2}>
                    <label>{t("quantity")}</label>
                    <h6>{item.quantity}</h6>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={4}>
                    <label>{t("price")}</label>
                    <div className={style.price__container}>
                      { item.magazine && item.magazine.discount ? (
                          <span className={style.price}>
                             <span className={style.price__cut}>${Number(item.subscriptionPrice) * parseInt(item.quantity)}</span> {' $'}{ this.getDiscountPrice(item.subscriptionPrice, item.quantity, item.magazineDiscount)}
                            {' '} USD
                          </span>
                        ) : (
                          <span className={style.price}>
                            ${Number(item.subscriptionPrice) * parseInt(item.quantity)} USD
                          </span>
                        )
                      }
                    </div>
                  </Col>
                  <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={5}>
                    {
                      item.magazine.free ? '' : (
                        <AppButton type="primary"
                                   size="small"
                                   onClick={() => { this.editItem(item)}}
                                   style={{
                                     width: "auto",
                                   }}>{t('edit')}</AppButton>
                      )
                    }
                    <AppButton type="danger"
                               size="small"
                               onClick={() => { this.removeFromCartConfirm(item)}}
                               style={{
                                 width: "auto",
                               }}>{t('remove')}</AppButton>
                  </Col>
                </Row>
              )
            }) : (
              <Row gutter={12} className={style.table__row}>
                <Col className={`${style.table__column} ${!this.isEnglish ? style.table__column__ar : ''}` } span={6}>
                  <h6>No magazines added to cart!</h6>
                </Col>
                <Col>
                  <AppButton type="primary"
                             size="small"
                             onClick={() => { this.goToMagazine()}}
                             style={{
                               width: "auto",
                             }}>{t('goToMagazine')}</AppButton>
                </Col>
              </Row>
            )
          }
        </div>


        <Modal
          footer={null}
          width={860}
          wrapClassName={this.isEnglish ? '' : style.rtl}
          visible={isUpdateItemVisible}
          onCancel={() => { this.closeItemUpdateModal(false)}}
        >
          <UpdateCartItem key={selectedItem.id} updateCartItem={true} item={selectedItem} closePopup={this.closeItemUpdateModal}/>
        </Modal>
      </Container>
    );
  }
}

export default withTranslation()(withRouter(Cart));
