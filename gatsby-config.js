let env = process.env.NODE_ENV || 'development';
require('dotenv').config({path: `./.env.${env}`});
module.exports = {
  siteMetadata: {
    title: `Banc de test Anonymisation`,
    description: `Test depersonalization algorithms and techniques`,
    author: `@pieterjan_m`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "query",
        fieldName: "api",
        //url: `http://localhost:5000/gql`,
        // url: `https://anon-api.openjustice.be/gql`,
        url: `${process.env.GATSBY_API_URL}/gql`,
        refetchInterval: 60,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
  ],
}
