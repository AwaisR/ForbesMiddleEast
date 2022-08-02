import gql from "graphql-tag";

export const getBlogCategories = gql`
  query getBlogCategories {
    blogcategories: blogcategories(
      where: { status: true, parent_null: false, parent: { status: true } }
      sort: "publishedDate:desc"
    ) {
      id
      name
      slug
      nameAR
      publishedDate
      parent {
        name
        nameAR
        slug
        id
        publishedDate
      }
    }
    companyblogcategories: companyblogcategories(sort: "publishedDate:desc") {
      id
      blogcategory {
        id
        name
        slug
      }
      company {
        id
        name
        brandvoice
        slug
        publishedDate
        language
      }
      active
      publishedDate
    }
  }
`;

export const getRecentBlogCategories = gql`
  query getRecentBlogCategories($where: JSON, $limit: Int = 2) {
    blogs(limit: $limit, where: $where, sort: "publishedDate:desc") {
      title
      featuredImage
      slug
      category {
        name
        slug
        parent {
          name
          slug
        }
      }
    }
  }
`;

export const getSubCategories = gql`
  query getSubCategories($where: JSON) {
    companyblogcategories(where: $where, sort: "publishedDate:desc") {
      id
      blogcategory {
        id
        name
        slug
      }
      company {
        id
        name
      }
      active
      publishedDate
    }
  }
`;

export const getCategoryDetail = gql`
  query getCategoryDetail($where: JSON) {
    blogcategories(where: $where) {
      id
      name
      nameAR
      slug
      parent {
        name
        nameAR
        slug
      }
    }
  }
`;

export const allPostsQuery = gql`
  query getBlogs($where: JSON, $skip: Int = 0, $limit: Int = 9) {
    blogs(
      limit: $limit
      where: $where
      start: $skip
      sort: "publishedDate:desc"
    ) {
      id
      title
      publishedDate
      slug
      author {
        role {
          name
          nameAR
        }
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
        title
        image {
          url
        }
      }
      category {
        name
        nameAR
        slug
        parent {
          name
          nameAR
          slug
        }
      }
      featuredImage
      featuredVideo
      backgroundPosition
    }
  }
`;

export const getArticleLanguage = gql`
  query getBlog($where: JSON) {
    blogs(where: $where) {
      language
      slug
      title
    }
  }
`;

export const getArticleDetails = gql`
  query getBlog(
    $where: JSON
    $whereRelated: JSON
    $whereBlogImages: JSON
    $sort: String
    $start: Int
  ) {
    articleDetails: blogs(where: $where, sort: $sort, start: $start, limit: 1) {
      id
      metaTitle
      metaKeywords
      metaDescription
      title
      content
      publishedDate
      imageCredit
      createdAt
      featuredImage
      slug
      youMayAlsoLike
      language
      quote
      blogtags {
        name
      }
      author {
        role {
          name
          nameAR
        }
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        description
        descriptionAR
        userAvatar
        title
        image {
          url
        }
      }
      video {
        videoID
        type
      }
      category {
        name
        nameAR
        slug
        parent {
          name
          nameAR
          slug
        }
      }
    }
    relatedArticles: blogs(
      where: $whereRelated
      limit: 4
      sort: "publishedDate:desc"
    ) {
      id
      title
      publishedDate
      slug
      backgroundPosition
      author {
        role {
          name
          nameAR
        }
        title
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
        image {
          url
        }
      }
      category {
        name
        nameAR
        slug
        parent {
          nameAR
          name
          slug
        }
      }
      featuredImage
    }
    blogImages: blogimages(where: $whereBlogImages) {
      image
      title
      description
    }
  }
`;

export const getRelatedBlogs = gql`
  query getBlog($where: JSON) {
    blogs(where: $where, limit: 4) {
      id
      title
      publishedDate
      slug
      author {
        role {
          name
          nameAR
        }
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
        title
        image {
          url
        }
      }
      category {
        name
        nameAR
        slug
        parent {
          nameAR
          name
          slug
        }
      }
      featuredImage
    }
  }
`;

export const allCompaniesQuery = gql`
  query getCompanies($where: JSON, $skip: Int = 0, $limit: Int = 7) {
    companies(
      limit: $limit
      where: $where
      start: $skip
      sort: "publishedDate:desc"
    ) {
      name
      slug
      featuredImage
      thumbnailImage
      bannerImage
      subtitle
    }
  }
`;

export const getCompanyDetails = gql`
  query getBlog($where: JSON, $whereBlogs: JSON) {
    companyDetails: companies(where: $where) {
      metaTitle
      metaKeywords
      metaDescription
      name
      slug
      featuredImage
      bannerImage
      website
      facebook
      twitter
      linkedIn
      content
    }
    companyBlogs: blogs(where: $whereBlogs, sort: "publishedDate:desc") {
      id
      title
      publishedDate
      slug
      author {
        role {
          name
          nameAR
        }
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
        title
        image {
          url
        }
      }
      category {
        name
        nameAR
        slug
        parent {
          nameAR
          name
          slug
        }
      }
      featuredImage
    }
  }
`;

export const allEventsQuery = gql`
  query getEvents(
    $where: JSON
    $skip: Int = 0
    $limit: Int = 6
    $sort: String
  ) {
    events(limit: $limit, where: $where, start: $skip, sort: $sort) {
      name
      subtitle
      slug
      homepageEventImage
      date
      location
      id
    }
  }
`;

export const getEventsDetail = gql`
  query getEvents($where: JSON) {
    eventDetails: events(where: $where) {
      metaTitle
      metaKeywords
      metaDescription
      name
      subtitle
      slug
      logo
      featuredImage
      synopsis
      date
      location
      startDate
      endDate
      agenda
      attendLink
      attendButtonText
      attendButtonTextAR
      locationCoordinates
      contact
      speakers {
        photo
        fullName
        title
      }
      sponsors {
        logo
        link
      }
      images {
        title
        image
        description
      }
    }
  }
`;

export const getEventImages = gql`
  query getEventImages($where: JSON) {
    eventimages(where: $where) {
      image
    }
  }
`;

export const getListCategories = gql`
  query getListCategories($where: JSON) {
    listcategories(where: $where, sort: "createdAt:desc") {
      name
      nameAR
      slug
    }
  }
`;

export const getFeaturedList = gql`
  query getFeaturedList($where: JSON, $limit: Int = 1) {
    lists(limit: $limit, where: $where, sort: "publishedDate:desc") {
      name
      slug
      featuredImage
      featuredCover
      featuredLatestList
      featuredCoverListPage
      featuredRecommendedList
      featuredCoverMonth
      categories {
        slug
      }
    }
  }
`;

export const getListsPerCategory = gql`
  query getListsPerCategory($where: JSON, $skip: Int = 0, $limit: Int = 6) {
    lists(
      limit: $limit
      where: $where
      start: $skip
      sort: "publishedDate:desc"
    ) {
      name
      slug
      featuredImage
      featuredCover
      featuredLatestList
      featuredRecommendedList
      publishedDate
      categories {
        slug
      }
    }
  }
`;

export const getListDetails = gql`
  query getListDetails($where: JSON, $whereBlogs: JSON) {
    listDetails: lists(where: $where) {
      metaTitle
      metaKeywords
      metaDescription
      name
      content
      featuredImage
      csvJson
      showRank
      featuredCoverMonth
      featuredCoverListPage
      publishedDate
      language
      author {
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
      }
      blogs(where: $whereBlogs) {
        id
        title
        publishedDate
        slug
        author {
          role {
            name
            nameAR
          }
          id
          slug
          username
          firstName
          firstNameAR
          lastName
          lastNameAR
          userAvatar
          title
          image {
            url
          }
        }
        category {
          name
          slug
          parent {
            name
            slug
          }
        }
        featuredImage
      }
    }
  }
`;

export const searchArticles = gql`
  query search($where: JSON, $sort: String = "publishedDate:desc") {
    blogs(where: $where, sort: $sort) {
      id
      title
      publishedDate
      slug
      backgroundPosition
      author {
        role {
          name
          nameAR
        }
        id
        slug
        username
        firstName
        firstNameAR
        lastName
        lastNameAR
        userAvatar
        title
        image {
          url
        }
      }
      category {
        name
        slug
        parent {
          name
          slug
        }
      }
      featuredImage
    }
  }
`;

export const searchList = gql`
  query searchList($where: JSON) {
    lists(where: $where, sort: "publishedDate:desc") {
      name
      slug
      featuredCoverListPage
      categories {
        slug
      }
    }
  }
`;

export const searchAuthor = gql`
  query searchAuthor($where: JSON, $whereBlogs: JSON) {
    users(where: $where) {
      id
      slug
      firstName
      firstNameAR
      lastName
      lastNameAR
      userAvatar
      title
      role {
        name
      }
      image {
        name
        url
      }
      blogs(where: $whereBlogs, limit: 1) {
        title
      }
    }
  }
`;

export const getAuthorDetails = gql`
  query getAuthorDetails($whereAuthor: JSON, $where: JSON) {
    users(where: $whereAuthor) {
      id
      firstName
      firstNameAR
      lastName
      lastNameAR
      description
      descriptionAR
      facebook
      twitter
      linkedIn
      title
      role {
        name
      }
      userAvatar
      image {
        name
        url
      }
      blogs(where: $where, sort: "publishedDate:desc") {
        id
        title
        publishedDate
        slug
        backgroundPosition
        author {
          role {
            name
            nameAR
          }
          id
          slug
          username
          firstName
          firstNameAR
          lastName
          lastNameAR
          userAvatar
          title
          image {
            url
          }
        }
        category {
          name
          nameAR
          slug
          parent {
            name
            nameAR
            slug
          }
        }
        featuredImage
        featuredVideo
      }
    }
  }
`;

// export const getAuthorDetails = gql`
//   query getAuthorDetails($id: ID!, $where: JSON) {
//     user(id: $id) {
//       id
//       firstName
//       firstNameAR
//       lastName
//       lastNameAR
//       description
//       descriptionAR
//       facebook
//       twitter
//       linkedIn
//       role {
//         name
//       }
//       userAvatar
//       image {
//         name
//         url
//       }
//       blogs(where: $where, sort: "publishedDate:desc") {
//         id
//         title
//         publishedDate
//         slug
//         backgroundPosition
//         author {
//           id
//           slug
//           username
//           firstName
//           firstNameAR
//           lastName
//           lastNameAR
//           userAvatar
//           image {
//             url
//           }
//         }
//         category {
//           name
//           nameAR
//           slug
//           parent {
//             name
//             nameAR
//             slug
//           }
//         }
//         featuredImage
//         featuredVideo
//       }
//     }
//   }
// `;

export const getMagazineCategories = gql`
  query getMagazineCategories {
    magazinecategories(where: { status: true }, sort: "name:asc") {
      name
      nameAR
      slug
    }
  }
`;

export const getSubscription = gql`
  query getSubscriptionItems($where: JSON) {
    subscriptions(where: $where) {
      id
      name
      region
      issue
      language
      price
    }
  }
`;

export const getMagazineDetails = gql`
  query getMagazineItem($where: JSON) {
    magazines(where: $where) {
      id
      name
      featuredImage
      price
      magazineimages {
        image
      }
    }
  }
`;

export const getMagazineItemsPerCategory = gql`
  query getMagazineItemsPerCategory(
    $where: JSON
    $limit: Int = 12
    $skip: Int
  ) {
    magazines(
      limit: $limit
      where: $where
      sort: "publishedDate:desc"
      start: $skip
    ) {
      id
      name
      featuredImage
      magazineimages {
        image
      }
      subscription
      free
      prices
      discount
    }
  }
`;

export const getSubscriptionMagazine = gql`
  query getSubscriptionMagazine($where: JSON, $limit: Int = 1) {
    magazines(limit: $limit, where: $where, sort: "publishedDate:desc") {
      id
      name
      featuredImage
      publishedDate
      magazineimages {
        image
      }
      magazinetags {
        name
      }
      subscription
      free
      prices
      discount
    }
  }
`;

export const getLatestCategories = gql`
  query getMagazineItemsPerCategory($where: JSON, $limit: Int = 3) {
    magazines(limit: $limit, where: $where, sort: "publishedDate:desc") {
      id
      name
      featuredImage
      publishedDate
      magazineimages {
        image
      }
      magazinetags {
        name
      }
      subscription
      free
      prices
      discount
    }
  }
`;

export const getConfiguration = gql`
  query getConfig($where: JSON) {
    configurations(where: $where) {
      id
      key
      value
    }
  }
`;

export const getMostRecentBlogs = gql`
  query getMostRecentBlogs($where: JSON, $limit: Int = 6) {
    blogs(limit: $limit, sort: "publishedDate:desc", where: $where) {
      title
      slug
      category {
        slug
        parent {
          slug
        }
      }
    }
  }
`;

export const getNominations = gql`
  query getNominations($where: JSON) {
    nominations(where: $where, sort: "created_at:desc") {
      slug
      title
      featuredImage
      content
      formLink
      metaTitle
      metaDescription
      metaKeywords
    }
  }
`;

export const getStaticPagesList = gql`
  query getStaticPage {
    pages(where: { status: true }) {
      slug
    }
  }
`;

export const getStaticPage = gql`
  query getStaticPage($where: JSON) {
    pages(where: $where) {
      title
      metaTitle
      metaKeywords
      metaDescription
      featuredImage
      slug
      description
    }
  }
`;

export const subscribeNewsletter = gql`
  mutation subscribeNewsletter($input: createNewslettersInput!) {
    createNewsletters(input: $input) {
      newsletter {
        id
        email
      }
    }
  }
`;

export const submitContact = gql`
  mutation submitContact($input: createContactformInput!) {
    createContactform(input: $input) {
      contactform {
        id
        fullName
        email
        phoneNumber
        message
        topic
      }
    }
  }
`;

export const getBlogConfig = gql`
  query getBlogConfig($where: JSON) {
    blogconfigs(where: $where, limit: 4) {
      id
      blogs {
        id
        title
        publishedDate
        slug
        backgroundPosition
        author {
          role {
            name
            nameAR
          }
          title
          id
          slug
          username
          firstName
          firstNameAR
          lastName
          lastNameAR
          userAvatar
          image {
            url
          }
        }
        category {
          name
          nameAR
          slug
          parent {
            nameAR
            name
            slug
          }
        }
        featuredImage
      }
    }
  }
`;
