import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Flex, Markdown } from '../HoosatUI';
import { PageDTO } from '../HoosatCMS-client/src/@types';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Article } from './Article';


const Loading = () => {
  return <h2>🌀 Loading...</h2>;
}

export const Contents = () => {
  const location = useLocation();
  const [ page, setPage ] = useState<PageDTO>();
  const [ meta, setMeta ] = useState({
    title: "", 
    description: "",
    url: "",
    image: "",
  });

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
        setMeta({
          title: `Porin Akkupaketti - ${page?.name}`,
          description: response.page?.markdown?.replace(/^.*\n+/, '').substring(0, 160) + ", Porin Akkupaketti (c) MTH-TEK tmi, Author: Hoosat Oy, Designer: Toni Lukkaroinen",
          url: window.location.href,
          image: findImageUrl(response.page?.markdown),
        })
      } else {
        setPage(undefined)
      }
    }
    fetchPages();
  }, [location])

  useEffect(loadPageContent, [location, loadPageContent]);

  const findImageUrl = (text: string) => {
    const regex = /!\[(.*?)\]\((.*?)\)/;
    const match = regex.exec(text);
    if (match) {
      const url = match[2];
      return url
    }
    return "";
  }

  return (
    (location.pathname.startsWith("/blog"))
    ?
      <Article></Article>
    : <Flex>
        <Helmet>
          {
            (!location.pathname.startsWith("/")) && 
            <>
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
            </>
          }
        </Helmet>
        <Suspense fallback={<Loading />}>
          <Markdown markdown={page?.markdown ?? ""}></Markdown>
        </Suspense>
      </Flex>
  );
}