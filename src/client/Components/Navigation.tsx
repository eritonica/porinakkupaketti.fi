import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageDTO } from '../HoosatCMS-client/src/@types';
import { Heading, Icons, List, ListItem } from '../HoosatUI';

export const Navigation = () => {
  const [ pages, setPages ] = useState<PageDTO[]>([]);

  const getPagesByDomain = useCallback(() => {
    const fetchPages = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      const uri = `${api}/pages/domain/${'localhost'}`;
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
        setPages(response.pages)
      } else {
        setPages([])
      }
    }
    fetchPages();
  }, []);

  useEffect(getPagesByDomain, []);
  return (
    <List>
      <ListItem style={{ display: "flex", justifyContent: "center"}}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  style={{ height: "52px", paddingRight: "1rem"}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
          </svg>
        </Link>
      </ListItem>
      {
        pages.map(page => (
          (page.link !== "/index") &&
          <ListItem key={page._id}>
            <Link to={(page.link !== undefined) ? page.link : ""} style={{ textDecoration: "none", color: "inherit" }}>
              <Heading style={{ margin: "0px"}}>
                <Icons icon={(page.icon !== undefined) ? page.icon : ""} type={'outline'} style={{ height: "24px", paddingRight: "1rem"}}></Icons>
                { page.name }
              </Heading>
            </Link>
          </ListItem>
        ))
      }
    </List>
  )
}