import React from 'react'
import styles from './Navbar.module.css'
import logo from '../../assets/logo.svg'
import phone from '../../assets/phone.svg'
export default function Navbar( props ) {
  return (
    <nav className={styles.header}>
        <div>
            <img src={logo} alt="logo" />
            <span>anchors</span>
            <div>
              <span>Beta</span>
            </div>
        </div>
        <div className={styles.callbackbtn} onClick={props.openPopup}>
          <img src={phone} alt='phone icon' />
          <div>
            Request a call back
          </div>
        </div>
    </nav>
  )
}
