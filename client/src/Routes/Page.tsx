import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, PageBuilder, Paragraph, Image, Flex, Markdown } from '../HoosatCMS-client/src/HoosatUI';
import { Footer } from '../Components/Footer/Footer';
import { Header } from '../Components/Header/Header';
import { Sidebar } from '../Components/Sidebar/Sidebar';
import { Navigation as Nav } from "../Components/Navigation/Navigation";

import "./Page.scss";
import { PageDTO } from '../HoosatCMS-client/src/@types';

export const Page = () => {
  const location = useLocation();
  const [ page, setPage ] = useState<PageDTO>();

  const loadPageContent = useCallback(() => {
    console.log(location);
    const fetchPages = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      let pathname = location.pathname;
      if(location.pathname === "/") {
        pathname = "/index"
      } 
      const uri = `${api}/pages/link${pathname}`;
      const fetchResult = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          'Accept': 'application/json',
          "Access-Control-Allow-Origin": "http://localhost:3000",
          'Access-Control-Allow-Credentials': 'true'
        }
      });
      const response = await fetchResult.json();
      if(process.env.NODE_ENV === "development") console.log(response);
      if(response.result === "success") {
        setPage(response.page)
      } else {
        setPage(undefined)
      }
    }
    fetchPages();
  }, [location])

  useEffect(loadPageContent, [location]);

  return (
    <PageBuilder className='page'
      header={<Header ></Header>}
      navigation={<Nav></Nav>}
      sidebar={<Sidebar></Sidebar>}
      footer={<Footer></Footer>}
      content={
        <Flex>
          <Markdown markdown={(page?.markdown !== undefined) ? page?.markdown : ""}></Markdown>
        </Flex>
      }
    />
  );
}
