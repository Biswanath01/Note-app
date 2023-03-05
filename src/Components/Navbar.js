import React, {useEffect, useState} from 'react';
import './navbar.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import note_background from './wave_background1.jpg';
import logo from './keep_notes_logo.png';
import BarLoader from "react-spinners/BarLoader";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


export default function (props) {
  const navigate = useNavigate();
  const params = useParams();
  const [userIdFromLocalStorage, setUserIdFromLocalStorage] = useState();

    useEffect(() => {
        console.log("Stuff from Navbar");
        const checkPrevLogin = localStorage.getItem("note-app");
        setUserIdFromLocalStorage((prev) => (JSON.parse(checkPrevLogin)).userId)
        if (checkPrevLogin) {
            // const user = JSON.parse(checkPrevLogin);
            // // setSignInStatus(true);
            // navigate(`/${user.userId}/shop`);
        }
        else{
          navigate('/');
        }
      }, []);
    
    const handlelogout = (e) =>{
        localStorage.removeItem('note-app');
        navigate('/');
      }


  return (
    <div>
      <header>
      
      <div className='navbar-custom'>
        
        <div className='links' style={{backgroundImage : `url(${note_background})`, backgroundSize: "cover"}}>
          <img src={logo} alt="logo" style={{width: "65px", height:"67px", margin: "10px 0px 0px 50px" , cursor: "pointer"}} 
            onClick= {(e) => navigate(`/home/${props.userId}`)}
          />
          <div onClick= {(e) => navigate(`/home/${props.userId}`)} style={{margin: "25px 0px 0px 0px", cursor : "pointer"}}>
            <h1 style={{color: "white"}}>KEEP NOTES</h1>
              <BarLoader
                color="white"
                loading={true}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
          </div>
    
          <div style={{marginRight: "0", marginLeft: "auto"}}>
            <ul style={{color: "white", display:"flex", textDecoration : "none", listStyle: "none", alignItems: "right", margin:"20px"}}>
              
              {/* <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
              onClick = {(e) => navigate(`/${props.userId}/profile`)}>
               {userDp && <Avatar src={userDp.data[0].userDp} alt="user Dp" sx={{marginTop : "-7px", border: "3px solid white"}} />} 
              </li> */}
      
              <li style={{margin: "10px 20px 10px 20px", cursor: "pointer"}}  
                onClick = {(e) => navigate(`/binned-notes/${props.userId}`)}>
                  <DeleteIcon fontSize='large'/>
              </li>
              
              {/* <li style={{margin: "2px 30px 10px 30px", cursor: "pointer"}} 
              onClick = {(e) => navigate(`/${props.userId}/cart`)}>
                <IconButton aria-label="cart">
                  <StyledBadge badgeContent={props.cartItemLength} color="secondary">
                    <ShoppingCartIcon fontSize='large' sx={{color: "white"}}/>
                  </StyledBadge>
                </IconButton>
              </li> */}
  
              <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
              onClick = {(e) => navigate(`/profile/${props.userId}`)}>
                <PersonIcon fontSize='large'/></li>
  
              {/* <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
              onClick = {(e) => navigate(`/${props.userId}/sell-product`)}>
                <PaidIcon fontSize='large'/></li> */}
                
              <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
              onClick = {(e) => handlelogout(e)}>
                <LogoutIcon fontSize='large'/></li>
            </ul>
          </div>
        </div>
      </div>
      
    </header>
    </div>
  )
}
