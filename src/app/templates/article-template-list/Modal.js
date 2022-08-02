import React from "react";
import _ from "lodash";
import { Modal, Icon } from "antd";
import { Next, Prev } from "@icons";
import Button from "@components/Button";
import style from "./styles.scss";

const ProfileModal = ({
  navigateModal,
  profileModalOpen,
  onCancel,
  profileModalContent,
  showRank,
  isEnglish,
  currentIndex,
  maxListRows
}) => {
  const keys = _.keys(profileModalContent);
  return (
    <Modal
      centered
      visible={profileModalOpen}
      onCancel={onCancel}
      className={`${style.modal} ${isEnglish ? "" : "arabic-list-modal"}`}
      footer={null}
    >
      <div
        className={`${style.modal__content} ${!isEnglish &&
          style.modal__content__ar} `}
      >
        <div>
          <img src={profileModalContent && profileModalContent["Image"]} />
          <h6>
            {showRank
              ? `#${(profileModalContent && profileModalContent["Rank"]) ||
                  (profileModalContent && profileModalContent["rank"]) ||
                  (profileModalContent && profileModalContent["التصنيف"])} `
              : null}
            {(profileModalContent && profileModalContent["Name"]) ||
              (profileModalContent && profileModalContent["Company name"]) ||
              (profileModalContent && profileModalContent["Company Name"]) ||
              (profileModalContent && profileModalContent["الاسم"])}
          </h6>
          {/* <Button size="small" type="primary">
            See Full Profile
          </Button> */}
        </div>
        <div
          className={`${style.modal__text} ${!isEnglish &&
            style.modal__text__ar}`}
        >
          {_.map(keys, key =>
            key && key.toLowerCase() !== "image" ? (
              <div
                className={
                  isEnglish ? style.modal__itemtxt : style.modal__itemtxt__ar
                }
              >
                {isEnglish ? (
                  <>
                    <span>{key}</span>
                    <span>
                      {profileModalContent && profileModalContent[key]}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {profileModalContent && profileModalContent[key]}
                    </span>
                    <span>{key}</span>
                  </>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className={style.modal__buttons}>
        {currentIndex === 0 ? null : (
          <Button
            size="small"
            type="action"
            onClick={() => navigateModal("prev")}
          >
            <Icon component={Prev} /> Previous
          </Button>
        )}
        {currentIndex + 1 >= maxListRows ? null : (
          <Button
            size="small"
            type="action"
            onClick={() => navigateModal("next")}
          >
            Next <Icon component={Next} />
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;
