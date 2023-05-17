import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Flex, List, ListItem } from '../HoosatUI';


export const Footer = () => {
  return (
    <Flex style={{flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
      <List style={{ textAlign: "center"}}>
        <ListItem>Copyright © MTH-TEK 2023</ListItem>
        <ListItem>Y-tunnus: 2441864-7</ListItem>
        <ListItem>Puhelin: <Anchor href="tel:040 5913008">040 5913008</Anchor></ListItem>
        <ListItem>Site design by <Anchor href="https://hoosat.fi" style={{padding: "0px"}}>Hoosat Oy</Anchor></ListItem>
        <ListItem><Link to="/hoosatcms">CMS</Link></ListItem>
      </List>
    </Flex>
  );
}