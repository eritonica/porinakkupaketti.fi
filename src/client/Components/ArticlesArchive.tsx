import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Heading, Paragraph, Image } from '../HoosatUI';

import './ArticlesArchive.css';
import { ArticleDTO } from '../HoosatCMS-client/src/@types';
import { Link } from 'react-router-dom';

export const ArticlesArchive = () => {
  const [ articles, setArticles ] = useState<ArticleDTO[]>();

  const getArticles = useCallback(() => {
    const fetchArticles = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      const uri = `${api}/articles/public/domain/${window.location.hostname}`;
      const fetchResult = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          'Accept': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
      const response = await fetchResult.json();
      if(process.env.NODE_ENV === "development") console.log(response);
      if(response.result === "success") {
        console.log(response.articles);
        setArticles(response.articles);
      }
    }
    fetchArticles();
  }, [])

  useEffect(getArticles, [getArticles]);

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
    <Flex className="ArticlesArchive">
      <Heading variant="h1">Archive</Heading>
      { articles?.map((article /*, index, articles*/) => {
        return (
          <div key={article._id} className="small-article-link">
            <div className="small-article-link-image">
              <Link to={`/blog/${article.header}`}>
                <Image src={findImageUrl(article.markdown!)} ></Image>
              </Link>
            </div>
            <div className="small-article-link-content">
              <Heading variant="h2">
                <Link to={`/blog/${article.header}`}>{article.header}</Link>
              </Heading>
              <Paragraph>
                {(new Date(article.publishedAt!)).toLocaleString("fi-FI")}
              </Paragraph>
            </div>
          </div>
        )
      })}
    </Flex>
  );
}