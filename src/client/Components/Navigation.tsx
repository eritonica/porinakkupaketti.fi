import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageDTO } from '../HoosatCMS-client/src/@types';
import { Heading, Icon, List, ListItem } from '../HoosatUI';

export const Navigation = () => {
  const [ pages, setPages ] = useState<PageDTO[]>([]);

  const getPagesByDomain = useCallback(() => {
    const fetchPages = async () => {
      const api = process.env.REACT_APP_API_ENDPOINT;
      if(api === undefined) {
        if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
        return;
      }
      const uri = `${api}/pages/domain/${window.location.hostname}`;
      const fetchResult = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          'Accept': 'application/json',
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
      {
        pages.map(page => (
          (page.link !== "/index") &&
          <ListItem key={page._id}>
            <Link to={(page.link !== undefined) ? page.link : ""} >
              <Heading style={{ margin: "0px"}}>
                <Icon name={(page.icon !== undefined) ? page.icon : ""}  style={{ height: "18pt", width: "18pt", paddingRight: "1rem" }} />
                { page.name }
              </Heading>
            </Link>
          </ListItem>
        ))
      }
    </List>
  )
}