import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Markdown } from '../HoosatUI';
import { ArticleDTO } from '../HoosatCMS-client/src/@types';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';


export const Article = () => {
  const location = useLocation();
  const [ article, setArticle ] = useState<ArticleDTO>();
  const [ meta, setMeta ] = useState({
    title: "", 
    description: "",
    url: "",
    image: "",
  });

  const loadArticle = useCallback(() => {
    console.log(location);
    const fetchArticle = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      let header = location.pathname.split("/")[2];
      if(header === undefined) {
        return;
      }
      const uri = `${api}/article/${header}`;
      const fetchResult = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          'Accept': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
      const response = await fetchResult.json();
      console.log("response: ", response);
      if(response.result === "success") {
        setArticle(response.article)
        setMeta({
          title: `Porin Akkupaketti - ${article?.header}`,
          description: response.article?.markdown?.replace(/^.*\n+/, '').substring(0, 78) + ", Porin Akkupaketti (c) MTH-TEK tmi, Author: Hoosat Oy, Designer: Toni Lukkaroinen",
          url: window.location.href,
          image: findImageUrl(response.article?.markdown),
        })
      }
    }
    fetchArticle();
  }, [location])

  useEffect(loadArticle, [location, loadArticle]);

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
    (article !== undefined) 
    ? <Flex>
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
      <Markdown markdown={(article?.markdown !== undefined) ? article?.markdown : ""}></Markdown>
    </Flex>
    : <>LOL</>
  );
}