import React, { Suspense} from 'react';
import { PageBuilder } from '../HoosatUI';
import { Footer } from '../Components/Footer';
import { Header } from '../Components/Header';
import { Sidebar } from '../Components/Sidebar';
import { Navigation as Nav } from "../Components/Navigation";
import { Contents } from '../Components/Contents';

import "./Page.css";
import { Helmet } from 'react-helmet-async';

export const Page = () => {


  const meta = {
    title: "Porin akkupaketti",
    description: "Tarvitsetko huoltoa sähkökulkuvälineesi, työkalujesi tai muiden laitteidesi akuille? Porin Akkupaketti on täällä auttamassa! Tarjoamme monipuolisia akkupalveluita ja olemme erikoistuneet erilaisten pienikokoisten akkujen huoltoon. - Porin Akkupaketti (c) MTH-TEK tmi, designed by Hoosat Oy",
    url: "https://mthtek.net/",
    image: "/logo/logo512.png"
  }

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description}/>
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Helmet>
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
    </>
  );
}
