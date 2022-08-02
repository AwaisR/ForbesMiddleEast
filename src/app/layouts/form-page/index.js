import React from 'react';
import Layout from '@components/Layout';
import Container from '@components/Container';
import style from './styles.scss';

export default props => (
  <Layout>
    <Container className={style.container}>
      <div>{props.children}</div>
    </Container>
  </Layout>
);
