import React, { useState } from 'react';
import { FormBuilder } from '../HoosatUI';


export const Sidebar = () => {

  const [maintenanceForm, setMaintenanceForm] = useState({
    email: "",
    message: "",
  });

  const [submitButtonText, setSubmitButtonText] = useState("Lähetä");

  const sendContactForm = async () => {
    const api = process.env.REACT_APP_API_ENDPOINT;
    if(api === undefined) {
      if(process.env.NODE_ENV === "development") console.log("REACT_APP_API_ENDPOINT has not been set in environment.");
      return;
    }
    const uri = `${api}/contact/email`;
    if(process.env.REACT_APP_FORM_TO_EMAIL === undefined) {
      if(process.env.NODE_ENV === "development") console.log("REACT_APP_FORM_TO_EMAIL has not been set in environment.");
      return;
    }
    if(process.env.REACT_APP_FORM_SUBJECT === undefined) {
      if(process.env.NODE_ENV === "development") console.log("REACT_APP_FORM_SUBJECT has not been set in environment.");
      return;
    }
    const body = {
      from: maintenanceForm.email,
      to: process.env.REACT_APP_FORM_TO_EMAIL,
      subject: process.env.REACT_APP_FORM_SUBJECT,
      text: maintenanceForm.message
    };
    console.log(body);
    const fetchResult = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        'Accept': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(body)
    });
    const response = await fetchResult.json();
    if(process.env.NODE_ENV === "development") console.log(response);
    if(response.result === "success") {
      setSubmitButtonText("Lähetetty");
    } else {
      setSubmitButtonText("Lähetys epäonnistui");
    }
  }

  return (
    <FormBuilder submitbuttontext={submitButtonText} header="Huoltotilaus" inputs={[
      { 
        itype: "input", 
        id: "email", 
        label: "Sähköposti",
        type: "email", 
        placeholder: "Kirjoita sähköpostisi", 
        variant: "primary", 
        onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  email: e.target.value })  }, 
        value: maintenanceForm.email
      },
      {
        itype: "textarea",
        id: "message",
        label: "Selvitys huoltopyynnöstä",
        placeholder: "Kirjoita mahdollisimman selkeästi millainen ongelma laitteesi kanssa on.",
        style: { height: "330px"},
        variant: "primary",
        onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  message: e.target.value })  }, 
        value: maintenanceForm.message
      }
    ]} 
    onSubmit={() => {
      sendContactForm();
    } 
    }></FormBuilder>
  );
}