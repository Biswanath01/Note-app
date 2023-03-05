import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';

export default function () {
    const params = useParams();
    const [userDetails, setUserDetails] = useState();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        axios.post('/api/get-user-details/', {
            userId : params.userId
        })
            .then((res) => setUserDetails((prev) => res.data.data))
            .catch((err) => console.log(err));
    }, []);

    const handleChangePassword = () => {
        if(newPassword !== confirmNewPassword){
            notifyNewConfirmPWDNotSame();
        }
        else if(oldPassword === newPassword){
            notifyNewAndOldPWDSame();
        }
        else{
            axios.post('/api/change-password', {
                userId : params.userId,
                oldPassword : oldPassword,
                newPassword : newPassword
            })
            .then((res) => {
                
                if(res.data.success === true){
                    notifyPasswordChanged();
                }
                else{
                    notifyWrongPassword(res.data.message);
                }
            })
            .catch((err) => console.log(err));
        }
    }

    const notifyNewConfirmPWDNotSame = () => toast.error("New Password and Confirmed Password are not the same!");
    const notifyNewAndOldPWDSame = () => toast.error("Old Password and New Password could not be the same!");
    const notifyPasswordChanged = () => toast.success("Password changed successfully!");
    const notifyCopiedUserId = () => toast.success("UserId copied to Clipboard! Share it with your friends so that they can share notes with you");
    const notifyWrongPassword = (message) => toast.error(message);


  return (
    <div>
        <Navbar userId = {params.userId}/>
        <h2 style={{textDecoration: "underline", margin: "20px 0px 20px 0px"}}>Your Profile</h2>
        {userDetails && 
            <div style={{paddingBottom: "50px"}}>
                <h5><strong>Your UserName :</strong> {userDetails.userName}</h5>
                <h5><strong>Your Email :</strong> {userDetails.email.slice(0, 2)} * * * * * * * {userDetails.email.slice(9)}</h5>
                <h5><strong>Your UserId :</strong> {userDetails.userId}</h5>
                <button onClick={() => {
                    navigator.clipboard.writeText(`${userDetails.userId}`)
                    notifyCopiedUserId();
                }} style={{color: "black", marginBottom: "10px"}}>Click to copy userId</button>
                <h4>**Note: This USER ID will be required by your friend to share notes</h4>
                <div style={{color : "black", margin: "30px"}}>
                    <h4 style={{color: "white"}}>Want to Change Password ? </h4>
                    <input type="password" placeholder='Enter Old Password' onChange={(e) => {
                        setOldPassword((prev) => e.target.value);
                    }}/>
                    <input type="password" placeholder='Enter New Password' onChange={(e) => {
                        setNewPassword((prev) => e.target.value);
                    }}/>
                    <input type="password" placeholder='Confirm New Password' onChange={(e) => {
                        setConfirmNewPassword((prev) => e.target.value);
                    }}/>
                    <button disabled = {!oldPassword || !newPassword || !confirmNewPassword} onClick={handleChangePassword} style={{color: "white"}}>Change Password</button>
                </div>
            </div>
        }
        <ToastContainer />
        <Footer/>
    </div>
  )
}
