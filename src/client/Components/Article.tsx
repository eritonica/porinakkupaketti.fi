import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Markdown } from '../HoosatUI';
import { ArticleDTO } from '../HoosatCMS-client/src/@types';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';


export const Article = () => {
  const location = useLocation();
  const [ article, setArticle ] = useState<ArticleDTO>();

  const loadArticle = useCallback(() => {
    console.log(location);
    const fetchArticle = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      let header = location.pathname.split("/")[2];
      console.log("header", header);
      const uri = `${api}/article/${header}`;
      console.log(uri);
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
      }
    }
    fetchArticle();
  }, [location])

  useEffect(loadArticle, [location, loadArticle]);
  
  return (
    (article !== undefined) 
    ? <Flex>
      <Helmet>
        <title>{`Porin Akkupaketti - ${article?.header}`}</title>
        <meta name="description" content={article?.markdown?.substring(0, 30)} />
      </Helmet>
      <Markdown markdown={(article?.markdown !== undefined) ? article?.markdown : ""}></Markdown>
    </Flex>
    : <>LOL</>
  );
}