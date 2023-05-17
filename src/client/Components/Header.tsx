import React from 'react';
import { Flex, Heading, Image } from '../HoosatUI';

export const Header = () => {
  return (
    <Flex style={{ justifyContent: "center", alignItems: "center", paddingTop: "2rem"}}>
      <Image src="/logo/logo512.png" style={{ width: "192px", boxShadow: "none" }}></Image>
      <Heading variant="h1">Porin Akkupaketti</Heading>
    </Flex>
  )
}