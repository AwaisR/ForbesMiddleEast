import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@components/Container';
import Button from '@components/Button';
import style from './styles.scss';

export const NetworkError = () => {
  const { t } = useTranslation();
  return (
    <Container className={style.container}>
      <h1 className='h2'>{t('networkIssue')}</h1>
      <h2>{t('networkIssueSub')}</h2>
      <Button size='small' type='primary' onClick={() => location.reload()}>
        {t('tryAgain')}
      </Button>
    </Container>
  );
};

export const NoDataFoundError = () => {
  const { t } = useTranslation();
  return (
    <Container className={style.container}>
      {/* <h1 className='h2'>{t('noDataFound')}</h1> */}
      <h2>{t('noDataFound')}</h2>
      {/* <Button size='small' type='primary' onClick={() => location.reload()}>
        {t('tryAgain')}
      </Button> */}
    </Container>
  );
};

export const EndOfPageMessage = () => {
  const { t } = useTranslation();
  return (
    <Container className={style.container}>
      {/* <h1 className='h2'>{t('noDataFound')}</h1> */}
      <h2>{t('endOfPage')}</h2>
      {/* <Button size='small' type='primary' onClick={() => location.reload()}>
        {t('tryAgain')}
      </Button> */}
    </Container>
  );
};
