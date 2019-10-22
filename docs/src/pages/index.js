import React from 'react';
import Layout from '../components/Layout';
import Features from '../components/home/Features';
import SEO from '../components/seo';
import Hero from '../components/home/Hero';
import DarkBlock from '../components/home/DarkBlock';
import Footer from '../components/home/footer';
import {ThemeProvider} from 'styled-components';
import {theme} from '../theme';

const IndexPage = () => (
  <ThemeProvider theme={theme}>
    <Layout showSidebar={false}>
      <SEO title="npm cli" />
      <Hero/>
      <Features/>
      <DarkBlock/>
      <Footer/>
    </Layout>
  </ThemeProvider>
);

export default IndexPage;
