import React from 'react';
import Layout from '../components/Layout';
import {graphql} from 'gatsby';
import {ThemeProvider} from 'styled-components';
import {theme} from '../theme';
import styled from 'styled-components';
import FoundTypo from '../components/FoundTypo';
import Scripts from '../components/Scripts';

const IS_STATIC = process.env.GATSBY_IS_STATIC

const Content = styled.div`
  max-width: 760px;
  margin: auto;
  padding: 0 30px 120px;
`;

const Page = ({data}) => {
  const pageData = data.markdownRemark;

  return (
    <ThemeProvider theme={theme}>
     <Layout showSidebar>
      <Content className="documentation">
        <div dangerouslySetInnerHTML={{ __html: pageData.html }} />
        <FoundTypo/>
        <Scripts/>
      </Content>
     </Layout>
    </ThemeProvider>
   );
};

export default Page;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
    }
  }
`;
