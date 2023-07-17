
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoundClickable } from './Components/RoundClickable';
import { Selection } from './Components/Selection';


import Lottie from 'react-lottie-player'
import cookieLottie from './Lottie/Cookie.json';

import './index.css'

const configuration = {
  "categories": {
    "preferences": [
      "_preference"
    ],
    "marketings": [
      "_marketing"
    ],
    "statistics": [
      "_statistic",
      "_ga"
    ],
    "necessaries": [
      "_necessary"
    ]
  } 
}

interface Selections {
  preferences: string,
  marketings: string,
  statistics: string,
  necessaries: string,
}

interface Categories {
  preferences: string[],
  marketings: string[],
  statistics: string[],
  necessaries: string[],
}

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
  roundText?: string;
  categories?: Categories;
  fixVWScrollbar?: boolean;
}


interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}


export const deleteCookie = (name: string) => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const getCookies = (): Cookie[] => {
  const cookieString = document.cookie;
  if (cookieString === "") {
    return [];
  }
  const cookies = cookieString.split("; ").map((cookie) => {
    const [name, value] = cookie.split("=");
    const cookieObj: Cookie = { name, value };
    const cookieParts = cookie.split(";");
    cookieParts.shift(); // Remove the name=value part
    cookieParts.forEach((part) => {
      const [attrName, attrValue] = part.split("=");
      switch (attrName.trim().toLowerCase()) {
        case "expires":
          cookieObj.expires = new Date(attrValue);
          break;
        case "max-age":
          cookieObj.maxAge = parseInt(attrValue, 10);
          break;
        case "domain":
          cookieObj.domain = attrValue;
          break;
        case "path":
          cookieObj.path = attrValue;
          break;
        case "secure":
          cookieObj.secure = true;
          break;
        case "httponly":
          cookieObj.httpOnly = true;
          break;
        case "samesite":
          cookieObj.sameSite = attrValue as "Strict" | "Lax" | "None";
          break;
      }
    });
    return cookieObj;
  });
  return cookies;
}

export const getCookie = (name: string) => {
  return getCookies().filter(cookie => {
    return cookie.name === name;
  });
}

export const Compliance: React.FC<Props> = (props) => {
  const [t, ] = useTranslation();
  
  const [selection, setSelection] = useState<boolean>(false);
  const [selections, setSelections] = useState<Selections>({
    preferences: "true",
    marketings: "true",
    statistics: "true",
    necessaries: "true"
  });

  const categories = (props.categories !== undefined) ? props.categories : configuration.categories

  // Check cookies every 5 seconds. 
  useEffect(() => {
    const interval = setInterval(() => {
      const savedSelections = localStorage.getItem("GDPR_Compliance_Selection");
      let selections = {
        preferences: "false",
        marketings: "false",
        statistics: "false",
        necessaries: "false",
      };
      try {
        if(savedSelections === null) {
          setSelection(!selection);
        } else {
          selections = JSON.parse(savedSelections);
        }
      } catch (error) {
        console.error('Invalid JSON: ', savedSelections, error);
      }
      if(document.cookie !== undefined && document.cookie.length > 0) {
        const cookies = getCookies();
        cookies.forEach(cookie => {
          categories.preferences.forEach(preference => {
            if(cookie.name.includes(preference)) {
              if(selections.preferences === "false") {
                deleteCookie(cookie.name);
              }
            }
          })
          categories.marketings.forEach(marketing => {
            if(cookie.name.includes(marketing)) {
              if(selections.marketings === "false") {
                deleteCookie(cookie.name);
              }
            }
          });
          categories.statistics.forEach(statistic => {
            if(cookie.name.includes(statistic)) {
              if(selections.statistics === "false") {
                deleteCookie(cookie.name);
              }
            }
          });
          categories.necessaries.forEach(necessary => {
            if(cookie.name.includes(necessary)) {
              if(selections.necessaries === "false") {
                deleteCookie(cookie.name);
              }
            }
          });
        });
      }
    }, 5000);
    return () => clearInterval(interval)
  }, [categories.marketings, categories.necessaries, categories.preferences, categories.statistics]);

  const saveSelection = (selections: Selections) => {
    if(process.env.NODE_ENV === "development") console.log("saving selections");
    if(process.env.NODE_ENV === "development") console.log(JSON.stringify(selections));
    localStorage.setItem("GDPR_Compliance_Selection", JSON.stringify(selections));
    setSelections(selections);
  }

  useEffect(() => {
    const savedSelections = localStorage.getItem("GDPR_Compliance_Selection");
    if(savedSelections !== null) {
      setSelections(JSON.parse(savedSelections));
    } 
    document.cookie = "selections_saved=true;sameSite=Strict";
    document.cookie = "selections_necessary=true;sameSite=Strict";
    document.cookie = "selections_preference=true;sameSite=Strict";
    document.cookie = "selections_statistic=true;sameSite=Strict";
    document.cookie = "selections_marketing=true;sameSite=Strict";
  }, []);

  const [isLottiePaused, setIsLottiePaused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLottiePaused(!isLottiePaused);
    }, 5000);
    return () => {
      clearTimeout(timer);
    }
  }, [isLottiePaused]);

  return (
        <div className="fixedBottomLeft">
          { (selection === false)
            ? (props.roundText !== "" && props.roundText !== undefined)   
              ? <RoundClickable { ...props } onClick={() => setSelection(true)}>{props.roundText}</RoundClickable>
              : <div onClick={() => setSelection(true)}>
                  <Lottie loop animationData={cookieLottie} play style={{width: "65px", height: "65px"}} speed={(isLottiePaused === true) ? 0 : 0.6}/>
                </div>
            : <Selection { ...props }>
                <div id="inputs">
                  <div style={{ width: "100%",  padding: "5px" }}>
                    <p>{t("compliance.header")}</p>
                  </div>
                  <div style={{ padding: "5px" }}>
                    <label style={{ paddingRight: "5px"}} htmlFor="necessaries-select">{t("compliance.necessary")}:</label>
                    <select id="necessaries-select" className='yesno' value={selections.necessaries}
                      onChange={(e) => { saveSelection({ ...selections, necessaries: e.target.value })}}>
                      <option value="true">{t("compliance.true")}</option>
                      <option value="false">{t("compliance.false")}</option>
                    </select>
                  </div>
                  <div style={{ padding: "5px" }}>
                    <label style={{ paddingRight: "5px"}} htmlFor="preferences-select">{t("compliance.preferences")}:</label>
                    <select id="preferences-select" className='yesno' value={selections.preferences}
                      onChange={(e) => { saveSelection({ ...selections, preferences: e.target.value })}}>
                      <option value="true">{t("compliance.true")}</option>
                      <option value="false">{t("compliance.false")}</option>
                    </select>
                  </div>
                  <div style={{ padding: "5px" }}>
                    <label style={{ paddingRight: "5px"}} htmlFor="statistics-select">{t("compliance.statistic")}:</label>
                    <select id="statistics-select" className='yesno' value={selections.statistics}
                      onChange={(e) => { saveSelection({ ...selections, statistics: e.target.value })}}>
                      <option value="true">{t("compliance.true")}</option>
                      <option value="false">{t("compliance.false")}</option>
                    </select>
                  </div>
                  <div style={{ padding: "5px" }}>
                    <label style={{ paddingRight: "5px"}} htmlFor="marketings-select">{t("compliance.marketing")}:</label>
                    <select id="marketings-select" className='yesno' value={selections.marketings}
                      onChange={(e) => { saveSelection({ ...selections, marketings: e.target.value })}}>
                      <option value="true">{t("compliance.true")}</option>
                      <option value="false">{t("compliance.false")}</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: "5px", paddingRight: "15px", flexGrow: "3", display: "flex", alignItems: "center", justifyContent: "right" }}>
                  <button type="button" id="saveButton" onClick={() => { setSelection(false); saveSelection({ ...selections }); }}>{t("compliance.save")}</button>
                </div>
              </Selection>
          }
        </div>
  )
}