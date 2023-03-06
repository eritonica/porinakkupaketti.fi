import React from 'react';
import { PageBuilder } from '../Components/HoosatUI/src';
import { Footer, Header, Navigation as Nav, Sidebar } from '../Components';

import "./Page.scss";

export const Equipment = () => {
  return (
    <PageBuilder className='landing'
      header={<Header></Header>}
      navigation={<Nav></Nav>}
      sidebar={<Sidebar></Sidebar>}
      footer={<Footer></Footer>}
      content={<>CONTENT</>}
    />
  );
}
