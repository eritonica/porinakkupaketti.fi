import React, { useState } from 'react';
import { FormBuilder } from '../HoosatUI/src';


export const Sidebar = () => {

  const [maintenanceForm, setMaintenanceForm] = useState({
    email: "",
    message: "",
  })

  return (
    <FormBuilder submitButtonText={"Lähetä"} header="Huoltotilaus" inputs={[
      { 
        inputType: "input", 
        id: "email", 
        label: "Sähköposti",
        type: "email", 
        placeholder: "Kirjoita sähköpostisi", 
        variant: "secondary", 
        onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  email: e.target.value })  }, 
        value: maintenanceForm.email
      },
      {
        inputType: "textarea",
        id: "message",
        label: "Selvitys huoltopyynnöstä",
        placeholder: "Kirjoita mahdollisimman selkeästi mikä ongelma laitteesi kanssa on.",
        style: { height: "330px"},
        variant: "secondary",
        onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  message: e.target.value })  }, 
        value: maintenanceForm.message
      }
    ]} onSubmit={function (value: React.BaseSyntheticEvent<object, any, any>): void {
      throw new Error('Function not implemented.');
    } }></FormBuilder>
  );
}