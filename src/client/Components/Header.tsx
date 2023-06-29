import React from 'react';
import { Heading, Image } from '../HoosatUI';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <>
      <Image src="/logo/logo512.png" style={{ width: "192px", boxShadow: "none" }}></Image>
      <Link to="/" >
        <Heading variant="h1">Porin Akkupaketti</Heading>
      </Link>
    </>
  )
}