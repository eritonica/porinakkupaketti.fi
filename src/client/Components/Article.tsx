import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Heading, Markdown, Paragraph, Image, Grid, Button } from '../HoosatUI';
import { ArticleDTO } from '../HoosatCMS-client/src/@types';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


import "./Article.css";

export const Article = () => {
  const [ t ] = useTranslation();
  const location = useLocation();
  const [ article, setArticle ] = useState<ArticleDTO>();
  const [ articles, setArticles ] = useState<ArticleDTO[]>();
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

  const loadArticles = useCallback(() => {
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
        setArticles(response.articles);   
      }
    }
    fetchArticles();
  }, [])

  useEffect(loadArticles, [loadArticles]);

  const [displayedArticles, setDisplayedArticles] = useState<ArticleDTO[]>([]);
  const [numArticlesToShow, setNumArticlesToShow] = useState(10);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setDisplayedArticles(articles.slice(0, numArticlesToShow));
    }
  }, [articles, numArticlesToShow]);

  const handleLoadMore = () => {
    setNumArticlesToShow((prevNumArticles) => prevNumArticles + 10);
  };

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
          (location.pathname !== "/" && location.pathname !== "/blog") && 
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
    : <Grid className="Articles">
      <Heading variant="h1">Latest articles</Heading>
      { displayedArticles?.map((article /*, index, articles*/) => {
        return (
          <div key={article._id} className="article-link">
            <div className="article-link-image">
              <Link to={`/blog/${article.header}`}>
                <Image src={findImageUrl(article.markdown!)} ></Image>
              </Link>
            </div>
            <div className="article-link-content">
              <Heading variant="h2">
                <Link to={`/blog/${article.header}`}>{article.header}</Link>
              </Heading>
              <Markdown className="markdown-snippet" markdown={(article?.markdown !== undefined) ? article?.markdown?.replace(/^.*\n+/, '').replace(/!\[(.*?)\]\((.*?)\)/, '').substring(0, 340) : ""}></Markdown>
              
              <Paragraph>
                {(new Date(article.publishedAt!)).toLocaleString("fi-FI")}
              </Paragraph>
            </div>
          </div>
        )
      })}
      {articles && articles.length > numArticlesToShow && (
        <Button onClick={handleLoadMore}>{t("posts.load-more")}</Button>
      )}
    </Grid>
  );
}