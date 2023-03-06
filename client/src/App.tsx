import React, { useState } from 'react';
import './App.scss';
import { PageBuilder, Image, Heading, Flex, List, ListItem, FormBuilder } from './Components/HoosatUI/src';

function App() {

  const [maintenanceForm, setMaintenanceForm] = useState({
    email: "",
    message: "",
  })

  return (
    <PageBuilder
        header={
          <Flex style={{ justifyContent: "center", alignItems: "center"}}>
            <Image src="/logo/logo512.png" style={{ width: "192px"}}></Image>
            <Heading variant="h1">Pori Akkupaketti</Heading>
          </Flex>
        }
        navigation={
          <List>
            <ListItem>Huolto</ListItem>
            <ListItem>Kalusto</ListItem>
            <ListItem>Referenssit</ListItem>
            <ListItem>Ota yhteyttä</ListItem>
          </List>
        }
        content={<>CONTENT</>}
        sidebar={
          <FormBuilder submitButtonText={"Lähetä"} header="Huoltotilaus" inputs={[
            { 
              inputType: "input", 
              id: "email", 
              label: "Sähköposti",
              type: "email", 
              placeholder: "Kirjoita sähköpostisi",  
              onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  email: e.target.value })  }, 
              value: maintenanceForm.email
            },
            {
              inputType: "textarea",
              id: "message",
              label: "Selvitys huoltopyynnöstä",
              placeholder: "Kirjoita mahdollisimman selkeästi mikä ongelma laitteesi kanssa on.",
              style: { height: "330px"},
              onChange: (e: React.BaseSyntheticEvent) => { setMaintenanceForm({...maintenanceForm,  message: e.target.value })  }, 
              value: maintenanceForm.message
            }
          ]} onSubmit={function (value: React.BaseSyntheticEvent<object, any, any>): void {
            throw new Error('Function not implemented.');
          } }></FormBuilder>
        }
        footer={
          <>Footer</>    
        }
      />
  );
}

export default App;
