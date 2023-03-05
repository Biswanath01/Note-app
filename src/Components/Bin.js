import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './Footer';

export default function () {
    const [binnedNotes, setBinnedNotes] = useState();
    const [showBinnedNotes, setShowBinnedNotes] = useState(false);
    const [noBinnedNotesFound, setNoBinnedNotesFound] = useState(false);
    const params = useParams();

    useEffect(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight, 
          behavior: 'smooth'});
      }, [showBinnedNotes]);

    useEffect(() => {
    const getBinnedNotes = async () => {
        axios.get(`/api/get-binned-notes/${params.userId}`)
        .then((res) => {
            // console.log(res.data.message);
            if(res.data.message === "No binned notes present!"){
            setNoBinnedNotesFound((prev) => true);
            // console.log("No binned notes present!");
            }
            else{
            setNoBinnedNotesFound((prev) => false);
            }
            setBinnedNotes((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }
    getBinnedNotes();
    }, []);

    const getBinnedNotes = async () => {
        axios.get(`/api/get-binned-notes/${params.userId}`)
          .then((res) => {
            // console.log(res.data.message);
            if(res.data.message === "No binned notes present!"){
              setNoBinnedNotesFound((prev) => true);
              // console.log("No binned notes present!");
            }
            else{
              setNoBinnedNotesFound((prev) => false);
            }
            setBinnedNotes((prev) => res.data.data);
          })
          .catch((err) => console.log(err));
    }

    const handleRestore = (e, nId) => {
        axios.post('/api/restore-note/', { 
          userId : params.userId,
          nId : nId
        })
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
              getBinnedNotes();
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
          
    }

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

  return (
    <div>
        <div>
            <Navbar userId = {params.userId}/>
            <h1 style={{marginTop: "30px", textDecorationLine: "underline", textDecorationStyle: "wavy", textDecorationThickness: "1.5px", textUnderlinePosition: "under"}}>
              BINNED NOTES
            </h1>
              {noBinnedNotesFound === true ? <h3 style={{color: "white"}}>No items in Bin!</h3> : null}
              
                <div style={{display : "grid", gridTemplateColumns : "25% 25% 25% 25%", paddingBottom: "50px", height: "100%"}}>
                {
                  binnedNotes && binnedNotes.map((value, index) => {
                    return(
                      <div key={index} 
                      style={{
                            border : "2px solid red", 
                            margin: "10px 5px 0px 5px", 
                            borderRadius : "7px", 
                            height: "fit-content", 
                            backgroundColor: "green", 
                            color: "white",
                            textAlign : "justify",
                          }}
                        >
                          <div style={{marginLeft: "20px", marginRight: "20px", marginTop : "20px"}}>
                              <div style={{display : "flex", justifyContent: "space-between"}}>
                                {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                                <ArrowOutwardIcon onClick = {(e) => handleRestore(e, value.noteId)} fontSize='large' sx={{cursor : "pointer", margin: "5px"}}/>
                              </div>
                              <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                              <h5>{value.note}</h5>
                              <img className='note-image' src={value.image} alt="image" style={{width: "30%"}}/>
                              <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                              {/* <h3>{value.noteId}</h3> */}
                          </div>
                          
                      </div>
                    )
                  })
                }
                
              </div>
              
          </div>
          <ToastContainer />
          <Footer/>
    </div>
  )
}
