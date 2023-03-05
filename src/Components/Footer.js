import React from 'react';

export default function Footer() {
  const handleGoToTop = () => {
    window.scrollTo(0, 0);
  }
  return (
    <div style={{backgroundColor : "rgb(52, 6, 104)", color: "white", height: window.innerHeight/4.5, marginTop: "100px" }}>
        <h2 onClick={handleGoToTop} style={{cursor: "pointer", backgroundColor: "slategrey", border: "2px curved white"}}>
          Go to Top ▲
        </h2>
        <div className="container" style={{marginTop : "15px"}}>
          <div className="row">
            <div className="col">
              <h4><ins>Services</ins></h4>
              <h5>You can keep your notes</h5>
              <h5>Privacy is our top priority</h5>
              <h5>We Connect People</h5>
            </div>
            <div className="col">
              <h4><ins>Contact Us</ins></h4>
              <h5>productpurchase@gmail.com</h5>
            </div>
            <div className="col">
              <h4><ins>About Us</ins></h4>
              <h5>&#169; 2022-23</h5>
              <h5>We do Epic Shits @Team Keep</h5>
              <h5>Inspired by G Keep</h5>
            </div>
          </div>
        </div>

    </div>
  )
}
