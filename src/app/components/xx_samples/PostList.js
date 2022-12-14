import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import PostUpvoter from "./PostUpvoter";

const POSTS_PER_PAGE = 10;

function PostList({
  data: { loading, error, articles, _allPostsMeta },
  loadMorePosts
}) {
  if (error) return <ErrorMessage message="Error loading posts." />;
  if (articles && articles.length) {
    return (
      <section>
        <ul>
          {articles.map((post, index) => (
            <li key={post.id}>
              <div>
                <span>{index + 1}. </span>
                {post.title}
                {/* <a href={post.url}>{post.title}</a> */}
                {/* <PostUpvoter id={post.id} votes={post.votes} /> */}
              </div>
            </li>
          ))}
        </ul>
        {true ? (
          <button onClick={() => loadMorePosts()}>
            {" "}
            {loading ? "Loading..." : "Show More"}{" "}
          </button>
        ) : (
          ""
        )}
        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: "";
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </section>
    );
  }
  return <div>Loading</div>;
}

export const allPosts = gql`
  query {
    articles {
      content
      id
      title
    }
  }
`;
export const allPostsQueryVars = {
  skip: 0,
  first: POSTS_PER_PAGE
};

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(allPosts, {
  // options: {
  // 	variables: allPostsQueryVars,
  // },
  props: ({ data }) => ({
    data,
    loadMorePosts: () => {
      return data.fetchMore({
        variables: {
          skip: data.articles.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
          });
        }
      });
    }
  })
})(PostList);
