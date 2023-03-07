import React from 'react'
import { Footer, Navigation as Nav, Header, Sidebar } from '../Components';
import { PageBuilder } from '../Components/HoosatUI/src';

import './Page.scss'

export const References = () => {
  return (
    <PageBuilder className='landing'
    header={<Header></Header>}
    navigation={<Nav></Nav>}
    sidebar={<Sidebar></Sidebar>}
    footer={<Footer></Footer>}
    content={<>CONTENT</>} />
  )
}