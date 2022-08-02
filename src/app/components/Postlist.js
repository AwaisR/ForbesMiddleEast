import React from 'react';
import { Query } from 'react-apollo';
import client from '@apolloClient';
import { allPostsQuery } from '@queries';

class PostList extends React.Component {
  render() {
    const allPostsQueryVars = {
      id: '61',
      lang: 'en',
    };
    return (
      <Query client={client} query={allPostsQuery} variables={allPostsQueryVars}>
        {({
          loading, error, data: { blogcategory }, fetchMore,
        }) => {
          if (error) return <div>Error loading posts</div>;
          if (loading) return <div>Loading</div>;

          const posts = blogcategory.blogs;
          return (
            <div>
              <ul>
                {posts.map((post, index) => (
                  <li key={post.id}>
                    <div>
                      <a href={post.slug}>{post.title}</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        }}
      </Query>
    );
  }
}

function loadMorePosts(allPosts, fetchMore) {
  fetchMore({
    variables: {
      start: allPosts.length,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult;
      }
      return Object.assign({}, previousResult, {
        // Append the new posts results to the old one
        blogcategories: [...previousResult.blogcategories, ...fetchMoreResult.blogcategories],
      });
    },
  });
}

export default PostList;
