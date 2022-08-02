import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Drawer, Icon } from 'antd';
import { getBookmarks } from '@utils';
import { Close, BookmarkArticlePage } from '@icons';
import style from './styles.scss';

const MyBookmarks = ({ visible, onClose }) => {
  return (
    <Drawer
      width={490}
      title={
        <div className={style.header}>
          <h5>My Bookmarks</h5>
          <div className={style.close} onClick={onClose}>
            <Icon component={Close} />
          </div>
        </div>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      className="my-bookmarks"
    >
      <div className={getBookmarks().length > 0 ? '' : 'empty'}>
        {getBookmarks().length ? (
          <ul className={style.list}>
            {_.map(getBookmarks(), (bookmark, index) => {
              return (
                <li key={index}>
                  <Link to={bookmark.link}>
                    <span>{bookmark.title}</span>
                    <div>
                      <Icon component={BookmarkArticlePage} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <h6>No bookmarks added</h6>
        )}
      </div>
    </Drawer>
  );
};

export default MyBookmarks;
