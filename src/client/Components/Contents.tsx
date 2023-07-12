import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Markdown } from '../HoosatUI';
import { PageDTO } from '../HoosatCMS-client/src/@types';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Article } from './Article';


export const Contents = () => {
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
      const uri = `${api}/pages/domain/${window.location.hostname}/link${pathname}`;
      const fetchResult = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          'Accept': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
      const response = await fetchResult.json();
      if(process.env.NODE_ENV === "development") console.log("response: ", response);
      if(response.result === "success") {
        setPage(response.page)
      } else {
        setPage(undefined)
      }
    }
    fetchPages();
  }, [location])

  useEffect(loadPageContent, [location, loadPageContent]);
  
  return (
    (location.pathname.startsWith("/blog"))
    ?
      <Article></Article>
    : <Flex>
      <Helmet>
        <title>{`Porin Akkupaketti - ${page?.name}`}</title>
        <meta name="description" content={page?.markdown?.substring(0, 30)} />
      </Helmet>
      <Markdown markdown={(page?.markdown !== undefined) ? page?.markdown : ""}></Markdown>
    </Flex>
  );
}