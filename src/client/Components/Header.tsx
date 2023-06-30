import React from 'react';
import { Heading, Image } from '../HoosatUI';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <>
      <Image src="/logo/logo512.png" alt="Porin Akkupaketti logo" width="512px" height="512px" style={{ width: "192px", height: "192px", boxShadow: "none" }}></Image>
      <Link to="/" >
        <Heading variant="h1">Porin Akkupaketti</Heading>
      </Link>
    </>
  )
}