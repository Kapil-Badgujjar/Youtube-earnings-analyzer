import React, { useState } from "react";
import axios from 'axios'
import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import Form from "./components/Form/Form";
import done from './assets/done.svg';
import arrow from './assets/right_arrow.svg';
function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ openPopup, setOpenPopup ] = useState(false);
  const [ popUp, selectPopUp ] = useState(false);
  async function sendRequest(){
    //send email
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_ADDRESS+'/sendemail', { name: name, phone: phone }, {withCredentials: true});
      if(response.status === 200){
        selectPopUp(true);
      }
    }catch (error){
      console.log(error);
    }

  }
  return (
    <div className={styles.app}>
      <Navbar openPopup={()=>{setOpenPopup(true)}}/>
      <Form />
      {openPopup && (popUp ?
        <div className={styles.popUp}>
          <div className={styles.callbackForm}>
              <img src={done} alt="done image" />
              <p>Request a call back</p>
              <div>Our team will connect shortly in 12 - 24 hrs</div>
              <div>Can't you wait for call?</div>
              <button onClick={()=>{setOpenPopup(false); selectPopUp(false)}} className={styles.btnRed}>Check another video <img src={arrow} alt="arrow"/></button>
          </div>
        </div>
        : 
        <div className={styles.popUp}>
            <h2 className={styles.close} onClick={()=>{setOpenPopup(false); selectPopUp(false)}} >&times;</h2>
          <div className={styles.callbackForm}>
              <p>Request a call back</p>
              <input type="text" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} />
              <input type="text" placeholder="Mobile number" value={phone} onChange={e => setPhone(e.target.value)}/>
              <button onClick={sendRequest} className={styles.btnWhite}>Request a Call Back</button>
          </div>
        </div>)
      }
    </div>
  );
}

export default App;
