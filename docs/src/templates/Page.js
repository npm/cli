import React from 'react'
import Layout from 'src/components/Layout'
import {graphql} from 'gatsby'
import styled, { ThemeProvider } from 'styled-components'
import {theme} from 'src/theme'
import FoundTypo from 'src/components/FoundTypo'
import Scripts from 'src/components/Scripts'

const Content = styled.div`
  max-width: 760px;
  margin: auto;
  padding: 0 30px 120px;
`

const Page = ({data}) => {
  const pageData = data.markdownRemark

  return (
    <ThemeProvider theme={theme}>
      <Layout showSidebar>
        <Content className='documentation'>
          <div dangerouslySetInnerHTML={{ __html: pageData.html }} />
          <FoundTypo />
          <Scripts />
        </Content>
      </Layout>
    </ThemeProvider>
  )
}

export default Page

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
    }
  }
`
