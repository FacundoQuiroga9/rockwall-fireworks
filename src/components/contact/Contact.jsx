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
      <p>Lorem ipsum.</p>
    </div>
  )
}

export default Contact
