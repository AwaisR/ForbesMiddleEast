import React, { useState } from 'react';
import { Modal } from 'antd';
import Button from '@components/Button';
import { Login, ResetPassword, Register } from '@components/Forms';
import style from '../styles.scss';

const LoginPopup = ({ t }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('login');

  const handleLoginClick = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setTimeout(() => {
      setStatus('login');
    }, 1000);
  };

  return (
    <>
      <Button type='login' onClick={handleLoginClick}>
        {t('login')}
      </Button>
      <Modal
        footer={null}
        title={null}
        visible={modalOpen}
        onCancel={handleCancel}
        width={600}
      >
        <div className={style.modal__container}>
          {
            {
              'login': <Login setStatus={setStatus} />,
              'reset-password': <ResetPassword setStatus={setStatus} />,
              'register': <Register setStatus={setStatus} />
            }[status]
          }
        </div>
      </Modal>
    </>
  );
};

export default LoginPopup;
