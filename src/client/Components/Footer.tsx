import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Flex, List, ListItem } from '../HoosatUI';


export const Footer = () => {
  return (
    <Flex style={{flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
      <List style={{ textAlign: "center"}}>
        <ListItem>Copyright © MTH-TEK 2023</ListItem>
        <ListItem><Anchor href="https://tietopalvelu.ytj.fi/yritys/2441864-7" style={{padding: "0px"}}>Y-tunnus: 2441864-7</Anchor></ListItem>
        <ListItem><Anchor href="tel:040 5913008" style={{padding: "0px"}}>Puhelin: 040 5913008</Anchor></ListItem>
        <ListItem><Anchor href="https://hoosat.fi" style={{padding: "0px"}}>Site design by Hoosat Oy</Anchor></ListItem>
        <ListItem><Link to="/hoosatcms">CMS</Link></ListItem>
      </List>
    </Flex>
  );
}