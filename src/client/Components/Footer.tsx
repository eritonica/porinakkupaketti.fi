import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, List, ListItem } from '../HoosatUI';


export const Footer = () => {
  return (
    <Flex style={{flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
      <List style={{ textAlign: "center"}}>
        <ListItem>Copyright © MTH-TEK 2023</ListItem>
        <ListItem><a href="https://tietopalvelu.ytj.fi/yritys/2441864-7" style={{padding: "0px"}}>Y-tunnus: 2441864-7</a></ListItem>
        <ListItem><a href="tel:040 5913008" style={{padding: "0px"}}>Puhelin: 040 5913008</a></ListItem>
        <ListItem><a href="https://hoosat.fi" style={{padding: "0px"}}>Site design by Hoosat Oy</a></ListItem>
        <ListItem><Link to="/hoosatcms">CMS</Link></ListItem>
      </List>
    </Flex>
  );
}