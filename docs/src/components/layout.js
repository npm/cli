import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {Flex, Box} from 'rebass';

const Layout = ({children, showSidebar}) => {
  return(
    <>
      <Navbar/>
      <Flex w={1}>
        {showSidebar && <Sidebar/>}
        <Box width={1}>{children}</Box>
      </Flex>
    </>
  );
};

export default Layout;