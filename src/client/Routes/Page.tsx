import React, { Suspense} from 'react';
import { PageBuilder } from '../HoosatUI';
import { Footer } from '../Components/Footer';
import { Header } from '../Components/Header';
import { Sidebar } from '../Components/Sidebar';
import { Navigation as Nav } from "../Components/Navigation";
import { Contents } from '../Components/Contents';

import "./Page.css";

export const Page = () => {

  return (
    <PageBuilder className='website'
      header={<Header ></Header>}
      navigation={
        <Suspense fallback={<progress value={undefined} />}>
          <Nav></Nav>
        </Suspense>
      }
      sidebar={
        <Sidebar></Sidebar>
      }
      footer={
        <Footer></Footer>
      }
      body={
        <Suspense fallback={<progress value={undefined} />}>
          <Contents></Contents>
        </Suspense>
      }
    />
  );
}
