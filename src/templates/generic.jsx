import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components"
import SEO from "../components/SEO/SEO"
import SiteHeader from '../components/Layout/Header'
import config from "../../data/SiteConfig"
import TableOfContents from "../components/Layout/TableOfContents";


export default class GenericTemplate extends React.Component {
  render() {
    // console.log("genericTemplate props:", this.props)
    const { slug } = this.props.pathContext;
    const postNode = this.props.data.postBySlug;
    const post = postNode.frontmatter;
    const contentsType = this.props.data.postBySlug.frontmatter.type;
    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <BodyGrid>
          <HeaderContainer>
            <SiteHeader location={this.props.location} />
          </HeaderContainer>
          <Sidebar>
            <TableOfContents
              posts={this.props.data.allPostTitles.edges}
              contentsType={contentsType}
            />
          </Sidebar>
          <BodyContainer>
            <div>
              <h1>
                {post.title}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
            </div>
          </BodyContainer>
        </BodyGrid>
      </div>
    );
  }
}

const BodyGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 75px 1fr;
  grid-template-columns: 300px 1fr;

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    height: inherit;
  }
`

const BodyContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  overflow: scroll;
  justify-self: center;
  width: 100%;
  padding: ${props => props.theme.sitePadding};
  @media screen and (max-width: 600px) {
    order: 2;
  }

  & > div {
    max-width: ${props => props.theme.contentWidthLaptop};
    margin: auto;
  }

  & > h1 {
    color: ${props => props.theme.accentDark};
  }
`

const HeaderContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  z-index: 2;
   @media screen and (max-width: 600px) {
    order: 1;
  }
`

const Sidebar = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  background: ${props => props.theme.lightGrey};
  overflow: scroll;
   @media screen and (max-width: 600px) {
    order: 3;
    overflow: inherit;
  }
`

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query genericTemplate($slug: String!) {
    allPostTitles: allMarkdownRemark{
      edges {
        node {
          frontmatter {
            title
            chapter
            order
            type
          }
          fields {
            slug
          }
        }
      }
    }
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        date
        type
      }
      fields {
        slug
      }
    }
  }
`;
