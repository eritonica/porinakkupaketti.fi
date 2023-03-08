import React, { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, PageBuilder, Paragraph, Image, Flex } from '../Components/HoosatUI/src';
import { Footer } from '../Components/Footer/Footer';
import { Header } from '../Components/Header/Header';
import { Sidebar } from '../Components/Sidebar/Sidebar';
import { Navigation as Nav } from "../Components/Navigation/Navigation";

import "./Page.scss";

export const Page = () => {
  const location = useLocation();

  const loadPageContent = useCallback(() => {
    console.log(location);

  }, [location])

  useEffect(loadPageContent, [location]);

  return (
    <PageBuilder className='page'
      header={<Header ></Header>}
      navigation={<Nav></Nav>}
      sidebar={<Sidebar></Sidebar>}
      footer={<Footer></Footer>}
      content={
        <Flex>
          <Heading>Tervetuloa Porin Akkupaketin kotisivuille!</Heading>
          <Paragraph style={{margin: "0px"}}> Olemme Porissa sijaitseva akkujen huoltoon ja valmistukseen
            erikoistunut yritys, joka tarjoaa korkealaatuisia ja luotettavia akkujen huoltopalveluita 
            erilaisille laitteille ja sovelluksille.</Paragraph>
          <Paragraph style={{margin: "0px"}}>Meillä on laaja kokemus ja asiantuntemus erilaisten akkujen 
            korjauksista ja huolloista. Korjaamme kaiken kokoisia akkuja, aina 
            sähköisistä polkupyöristä porakoneisiin ja kaikkeen siltä väliltä. 
            Tarjoamme asiakkaillemme nopean ja ammattitaitoisen palvelun, jonka 
            avulla pystymme huoltamaan akkusi nopeasti ja tehokkaasti.</Paragraph>
          <Paragraph style={{margin: "0px"}}>Olemme sitoutuneet tarjoamaan asiakkaillemme parasta 
            mahdollista palvelua ja haluamme varmistaa, että kaikki korjaustyöt 
            suoritetaan korkealaatuisesti ja luotettavasti. Käytämme vain 
            parhaita mahdollisia varaosia ja työskentelemme aina huolellisesti 
            varmistaaksemme, että korjaustyö onnistuu ongelmitta.</Paragraph>
          <Paragraph style={{margin: "0px"}}>Jos etsit luotettavaa ja ammattitaitoista akkujen 
            huoltopalvelua, olet tullut oikeaan paikkaan. Ota yhteyttä 
            meihin, niin autamme sinua löytämään juuri sinun tarpeisiisi 
            sopivan ratkaisun.</Paragraph>
          <Image src="/images/IMG_20220704_193231.jpg" style={{ width: "80%", marginLeft: "auto", marginRight: "auto"}}></Image>
        </Flex>
      }
    />
  );
}
