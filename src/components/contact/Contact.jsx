import './Contact.css'


const Contact = () =>{
  return(
    <div id="contact" className="contact-container">
      <h2 className='contact-title'>CONTACT US!</h2>
      <h4 className='contact-subtitle'><ion-icon name="location-outline"></ion-icon>ADDRESS</h4>
      <p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=10489+State+Hwy+205,+Lavon,+TX+75166"
          target="_blank"
          rel="noopener noreferrer"
        >
          10489 State Hwy 205, Lavon, TX 75166
        </a>
      </p>
      <h4 className='contact-subtitle'><ion-icon name="call-outline"></ion-icon>PHONE</h4>
      <p>
      <a href="tel:+19729775193">(972) 977-5193</a>
      </p>
      <h4 className='contact-subtitle'><ion-icon name="phone-portrait-outline"></ion-icon> SOCIAL MEDIA</h4>
      <div className="social-media-links">
        <a
          href="https://www.instagram.com/rockwallfireworks2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ion-icon name="logo-instagram"></ion-icon>
        </a>
        <a
          href="https://www.facebook.com/rockwallfireworksllc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ion-icon name="logo-facebook"></ion-icon>
        </a>
      </div>
    </div>
  )
}

export default Contact
