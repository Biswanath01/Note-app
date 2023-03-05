import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import PushPinIcon from '@mui/icons-material/PushPin';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import CloseIcon from '@mui/icons-material/Close';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { Pin } from 'react-bootstrap-icons';
import { Pencil } from 'react-bootstrap-icons';
import { BsFillPinFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSProperties } from "react";
import BarLoader from "react-spinners/BarLoader";
import Spinner from './Spinner';
import noteBackground from './noteBackground.jpg';
import Navbar from './Navbar';
import Footer from './Footer';

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleImageModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -30%)',
  // width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function () {
  const params = useParams();
  const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [note, setNote] = useState();
    const [data, setData] = useState();
    const [pinnedNotes, setPinnedNotes] = useState();
    const [newEditedTitle, setNewEditedTitle] = useState("");
    const [newEditedNote, setNewEditedNote] = useState("");
    const [noteObject, setNoteObject] = useState();
    const [open, setOpen] = useState(false);
    const [productImage, setProductImage] = useState(); 
    const [imageUrl, setImageUrl] = useState();
    const [picUploaded, setPicUploaded] = useState(false);
    const [imageObject, setImageObject] = useState();
    const [openImageModal, setOpenImageModal] = useState(false);
    const [sharedEditNoteObject, setSharedEditNoteObject] = useState();
    const [openEditSharedModal, setOpenEditSharedModal] = useState(false);
    const [noPinnedNotesFound, setNoPinnedNotesFound] = useState(false);
    const [noSharedNotesFound, setNoSharedNotesFound] = useState(false);
    const [noNotesFound, setNoNotesFound] = useState(false);
    const [sharedToUserId, setSharedToUserId] = useState("");
    const [sharedNotes, setSharedNotes] = useState();
    const [receiverIdtoRevoke, setReceiverIdtoRevoke] = useState("");
    const [hoveredId, setHoveredId] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [sharedSearchResult, setSharedSearchResult] = useState();
    const [noSearchResultFound, setNoSearchResultFound] = useState(false);
    const [noSharedSearchResultFound, setNoSharedSearchResultFound] = useState(false);

    const handleImageOpen = (e, imageObject) => {
      setImageObject((prev) => imageObject);
      setOpenImageModal(true);
    }
    const handleOpen = (e, noteObj) => {
      setNoteObject((prev) => noteObj);
      setOpen(true);
    };
    
    const handleOpenEditSharedModal = (e, sharedEditObj) => {
      setSharedEditNoteObject((prev) => sharedEditObj);
      setOpenEditSharedModal(true);
    };
    
    const handleClose = () => setOpen(false);
    const handleImageClose = () => setOpenImageModal(false);
    const handleCloseEditSharedModal = () => setOpenEditSharedModal(false);

    useEffect(() => {
      const noteDetails = JSON.parse(localStorage.getItem("note-app"));
      if(noteDetails?.userId !== params.userId){
        navigate(`/home/${noteDetails.userId}`);
      }
    }, []);

    useEffect(() => {
        if(productImage){
            setImageUrl(prev => URL.createObjectURL(productImage));
        } 
        else return;
      }, [productImage]);

      useEffect(() => {
        const getSharedNotes = () => {
          axios.get(`/api/get-shared-notes/${params.userId}/`)
          .then((res) => {
            if(res.data.success === false){
              notifyError(res.data.message);
            }
            if(res.data.data === undefined){
              setNoSharedNotesFound((prev) => true);
            }
            else{
              setNoSharedNotesFound((prev) => false);
            }
            // console.log(res.data.data);
            setSharedNotes((prev) => res.data.data);
          })
          .catch((err) => console.log(err));
        }
        getSharedNotes();
      }, [])
      
    
    //for getting normal notes
    useEffect(() => {
      const getNotes = async() => {
        await axios.get(`/api/get-notes/${params.userId}`)
          .then((res) => {
            if(res.data.message === "No unpinned notes are present!" || res.data.data === undefined){
              setNoNotesFound((prev) => true);
            }
            else{
              setNoNotesFound((prev) => false);

            }
            // console.log(res.data.data);
            setData((prev) => res.data.data);
          })
          .catch((err) => console.log(err));
      }

      getNotes();
    }, []);

    //for getting pinned notes
    useEffect(() => {
      const getPinnedNotes = async() => {
        await axios.get(`/api/get-pinned-notes/${params.userId}`)
          .then((res) => {
            if(res.data.message === "No pinned notes are present!" || res.data.data === [] || res.data.data === null || res.data.data === undefined){
              setNoPinnedNotesFound((prev) => true);
            }
            else{
              setNoPinnedNotesFound((prev) => false);

            }
            // console.log("pinnedNotes", res.data.data);
            setPinnedNotes((prev) => res.data.data);
          })
          .catch((err) => console.log(err));
      }
      getPinnedNotes();
    }, []);

    useEffect(() => {
      const addDelay = setTimeout(() => {
        getSearch();
      }, 1000);
      return () => clearTimeout(addDelay);
    }, [search]);

    useEffect(() => {
      const addDelay = setTimeout(() => {
        getSharedSearch();
      }, 1000);
      return () => clearTimeout(addDelay);
    }, [search]);

   
    const getSearch = async() => {
      await axios.post('/api/get-search/', {
        search : search,
        userId : params.userId
      })
        .then((res) => {
          // console.log(res.data.data);
          if(res.data.message === "No search term. Initial rendering"){
            <Spinner loading={false}/>
            setNoSearchResultFound((prev) => false);
          }
          else if(res.data.data === undefined){
            setNoSearchResultFound((prev) => true);
          }
          else{
            setNoSearchResultFound((prev) => false);
            <Spinner loading={false}/>
          }
          setSearchResult((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }
    
    const getSharedSearch = async() => {
      await axios.post('/api/get-shared-search/', {
        search : search,
        userId : params.userId
      })
        .then((res) => {
          // console.log(res.data.data);
          if(res.data.message === "No search term. Initial rendering"){
            <Spinner loading={false}/>
            setNoSharedSearchResultFound((prev) => false);
          }
          else if(res.data.data === undefined){
            setNoSharedSearchResultFound((prev) => true);
          }
          else{
            setNoSharedSearchResultFound((prev) => false);
            <Spinner loading={false}/>
          }
          setSharedSearchResult((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }
    
    const getSharedNotes = () => {
      axios.get(`/api/get-shared-notes/${params.userId}/`)
      .then((res) => {
        if(res.data.success === false){
          notifyError(res.data.message);
        }
        if(res.data.data === undefined){
          setNoSharedNotesFound((prev) => true);
        }
        else{
          setNoSharedNotesFound((prev) => false);
        }
        // console.log(res.data.data);
        setSharedNotes((prev) => res.data.data);
      })
      .catch((err) => console.log(err));
    }

    //for getting normal notes
    const getNotes = async() => {
      await axios.get(`/api/get-notes/${params.userId}`)
        .then((res) => {
          // console.log(res.data.data);
          if(res.data.message === "No unpinned notes are present!" || res.data.data === undefined){
            setNoNotesFound((prev) => true);
          }
          else{
            setNoNotesFound((prev) => false);

          }
          setData((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }

    //for getting pinned notes
    const getPinnedNotes = async() => {
      await axios.get(`/api/get-pinned-notes/${params.userId}`)
        .then((res) => {
          // console.log("PinnedNotes: ", res.data.data);
          if(res.data.message === "No pinned notes are present!" || res.data.data === [] || res.data.data === null || res.data.data === undefined){
            setNoPinnedNotesFound((prev) => true);
          }
          else{
            setNoPinnedNotesFound((prev) => false);

          }
          setPinnedNotes((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }

    const handleAddNote = async () => {
        let formData = new FormData();
        formData.append("userId", params.userId);
        formData.append("title", title);
        formData.append("note", note);
        formData.append("pinnedStatus", false);
        productImage && formData.append("image", productImage, productImage.name);
        await axios.post('/api/add-note/', formData)
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
        setTitle("");
        setNote("");
        setImageUrl((prev) => "");
        setPicUploaded((prev) => false);
        getNotes();
    }

    const handleEditSharedNote = async (e, nId, oldNoteTitle, oldNote) => {
      if(newEditedTitle !== "" && newEditedNote !== ""){
        axios.post('/api/edit-shared-note/', {
          noteId : nId,
          newEditedTitle : newEditedTitle,
          newEditedNote : newEditedNote
        })
          .then((res) => {
            // console.log(res.data.data);
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
      }
      else if(newEditedTitle === "" || newEditedTitle === null){
        await axios.post('/api/edit-shared-note/', {        //if the user doesnt change the title but chnages the note only
          noteId : nId,
          newEditedTitle : oldNoteTitle,
          newEditedNote : newEditedNote
        })
        .then((res) => {
          // console.log(res.data.data);
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      }
      else if(newEditedNote === "" || newEditedNote === null){
        await axios.post('/api/edit-shared-note/', {        //if the user doesnt change the note but changes the title only
          noteId : nId,
          newEditedTitle : newEditedTitle,
          newEditedNote : oldNote
        })
        .then((res) => {
          // console.log(res.data.data);
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      }
      setNewEditedNote((prev) => "");
      setNewEditedTitle((prev) => "");

      setOpenEditSharedModal((prev) => false);
      getSharedNotes();
    }

    const handleEditNote = async(e, nId, oldNoteTitle, oldNote) => {
      let flag = 0;  
      let pinnedStatus = false;   
      
      pinnedNotes.map((value, index) => {    
        if(value.noteId === nId){          
          flag = 1;
          console.log("Yes true");
        }
      })

      if(flag === 1){                 //for editing pinned note
        pinnedStatus = true;
        console.log("Yes true");
      }
      else{
        pinnedStatus = false;         //for editing normal note
        console.log("No false");
      }

      if(newEditedTitle === "" || newEditedTitle === null){
        await axios.post('/api/edit-note', {        //if the user doesnt change the title but chnages the note only
          userId : params.userId,
          newEditedTitle : oldNoteTitle,
          newEditedNote : newEditedNote,
          noteId : nId,
          pinnedStatus : pinnedStatus
        })
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
      }
      else if(newEditedNote === "" || newEditedNote === null){
        await axios.post('/api/edit-note', {        //if the user doesnt change the note but chnages the title only
          userId : params.userId,
          newEditedTitle : newEditedTitle,
          newEditedNote : oldNote,
          noteId : nId,
          pinnedStatus : pinnedStatus
        })
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
      }
      else{
        await axios.post('/api/edit-note', {
          userId : params.userId,
          newEditedTitle : newEditedTitle,
          newEditedNote : newEditedNote,
          noteId : nId,
          pinnedStatus : pinnedStatus
        })
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
      }
      setNewEditedNote((prev) => "");
      setNewEditedTitle((prev) => "");
        setOpen((prev) => false);
        getNotes();
        getPinnedNotes();
    }

    const handleDeleteNote = async(e, nId) => {
      await axios.post('/api/add-note-to-bin/', {
        userId : params.userId,
        noteId : nId
      })
        .then((res) => {
          if(res.data.success === true){
            // notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));


      await axios.post('/api/delete-note/', {
        userId : params.userId,
        noteId : nId
      })
        .then((res) => {
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else if(res.data.message === "Successfully deleted the note!"){
            notifyError(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      getNotes();
      getPinnedNotes();
    } 

    const handleDeleteSharedNoteforAll = async(e, nId, ownerId) => {
      await axios.post('/api/delete-note-for-everyone/', {
        ownerId : ownerId,
        noteId : nId
      })
        .then((res) => {
          // console.log(res.data.data)
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
        getSharedNotes();
    }

    const handleDeleteSharedNotebyReceiver = async(e, nId, receiverId) => {
      await axios.post('/api/delete-shared-note-by-receiver/', {
        receiverId : receiverId,
        noteId : nId
      })
        .then((res) => {
          // console.log(res.data.data)
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      getSharedNotes();
    }

    const handleRevokeReceiver = async(e, ownerId, receiverId, nId) => {
      await axios.post('/api/revoke-receiver/', {
        ownerId : ownerId,
        receiverId : receiverId,
        noteId : nId
      })
        .then((res) => {
          // console.log(res.data.data)
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      
      getSharedNotes();
    }



    const handleAddNoteToPinned = async (e, nId) => {
      await axios.post('/api/add-note-to-pinned/', {
        userId : params.userId,
        noteId : nId
      })
        .then((res) => {
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      getNotes();
      getPinnedNotes();
    }

    const handleRemoveNoteFromPinned = async(e, nId) => {
      await axios.post('/api/remove-note-from-pinned/', {
        userId : params.userId,
        noteId : nId
      })
        .then((res) => {
          if(res.data.success === true){
            notifySuccess(res.data.message);
          }
          else{
            notifyError(res.data.message);
          }
        })
        .catch((err) => console.log(err));
      getNotes();
      getPinnedNotes();
    }

    const handleMakeCopy = async(e, nId, prevTitle, prevNote, isPinned) => {
        await axios.post('/api/copy-note/', {
          userId : params.userId,
          title : prevTitle,
          note : prevNote,
          noteId : nId,
          pinnedStatus : isPinned
        })
          .then((res) => {
            if(res.data.success === true){
              notifySuccess(res.data.message);
            }
            else{
              notifyError(res.data.message);
            }
          })
          .catch((err) => console.log(err));
        setTitle("");
        setNote("");

      getPinnedNotes();
      getNotes();
    }

    const handleUploadImage = (event) => {
      setProductImage(event.target.files[0]);
      // console.log(event.target.files[0]);
      setPicUploaded(true);
    }

    const handleShareNote = async(e, noteId, isPinned) => {
      await axios.post('/api/share-note/', {
        ownerId : params.userId,
        receiverId : sharedToUserId,
        noteId : noteId,
      })
        .then((res) => {
          if(res.data.success === false){
            notifyError(res.data.message);
          }
          else{
            notifySuccess(res.data.message);
          }
          setSharedToUserId((prev) => "");
          // console.log(res.data.data);
        })
        .catch((err) => console.log(err));

      getSharedNotes();
    }

    const handleGoToTop = () => {
      window.scrollTo(0, 0);
    }

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);


  return (
    <div style={{backgroundColor: "rgb(22, 32, 51)", color: "white",height: "100%"}}>
      <Navbar userId = {params.userId}/>

        <div style={{backgroundColor: "rgb(22, 32, 51)", color: "white"}}>
          <div>
            <OutlinedInput
              value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ 
                  width: "400px", 
                  height: "50px", 
                  fontSize: "15px", 
                  color: "white",
                  margin: "10px 5px 10px auto",
                  border: "2px solid white",
                  borderRadius: "7px"
                }}
                color="secondary" focused
                InputProps={{style:{fontSize : "15px", color:"white"}}} InputLabelProps={{style:{fontSize : "14px", marginTop: "1px"}}}
                endAdornment={
                <InputAdornment position="start">
                    <IconButton>
                      {search && <CloseIcon fontSize = 'large' sx={{color: "white", marginRight: "10px"}} onClick = {()=> setSearch((prev) => "")}/>}
                      <SearchIcon fontSize='large' sx={{color: "white", marginRight: "-10px", cursor: "auto"}}/>
                    </IconButton>
                </InputAdornment>
                }
                placeholder="Search"
              />




          </div>
          {!search && <div style={{display : "flex", flexDirection: "column", width: "40%", margin: "auto"}}>
            <TextField
              error
              id="outlined-error"
              label="Enter title..."
              value={title}
              onChange={(e) => setTitle((prev) => e.target.value)}
              sx={{margin: "5px"}}
              InputProps={{style:{fontSize : "14px", color:"white"}}} InputLabelProps={{style:{fontSize : "14px", marginTop: "1px"}}}
            />
            <TextField
              error
              id="outlined-error"
              label="Enter note..."
              multiline
              rows={5}
              value={note}
              onChange={(e) => setNote((prev) => e.target.value)}
              sx={{margin: "5px"}}
              InputProps={{style:{fontSize : "14px", color:"white"}}} InputLabelProps={{style:{fontSize : "14px", marginTop: "3px"}}}
            />
            <h3 align="left">Enter image(Optional): </h3>
            <input type="file" accept='image/*' onChange={handleUploadImage}/>
            {picUploaded && 
                <img 
                  src={imageUrl}
                  style={{width: "50px", height: "50px" ,borderRadius: "50%", margin: "10px 200px 20px 10px"}}
                />
              }
            <Button variant="contained" color="success" size="large" disabled={!note} sx={{margin: "15px", color: "white"}} onClick={(e) => {
              handleAddNote();
              setTitle("");
              setNote("");
            }}>Add note</Button>
          </div>}

            {/* For showing searched normal notes */}
            {searchResult && <h1 style={{margin: "20px", textDecorationLine: "underline", textDecorationStyle: "wavy", textDecorationThickness: "1.5px", textUnderlinePosition: "under"}}>Search Result</h1>}
            <div style={{display : "grid", gridTemplateColumns : "25% 25% 25% 25%"}}>
            {/* <div style={{display : "flex", flexDirection: "column",alignItems: "center", height: "100vh", width: "25%", flexWrap : "wrap"}}> */}
              {/* {noSearchResultFound === false && <Spinner loading={true}/>} */}
              {noSearchResultFound === true  ? <h3 style={{color: "yellow"}}><Spinner loading={false}/></h3> : 
               searchResult && searchResult.map((value, index) => {
                  let noteObject = {
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  let imageObject = {
                    image : value.image,
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  return (
                    <div key={index} 
                      onMouseEnter = {(e) => setHoveredId((prev) => "pinnednote" + value.noteId)}
                      onMouseLeave = {(e) => setHoveredId((prev) => "")}
                    style={{
                      border : "2px solid rgb(122, 14, 247)", 
                      margin: "10px 10px 10px 10px", 
                      borderRadius : "7px", 
                      height: "fit-content", 
                      backgroundColor: hoveredId === "pinnednote" + value.noteId ? "rgb(255, 132, 0)" : "rgb(244, 71, 3)", 
                      transition: hoveredId === "pinnednote" + value.noteId ? "0.3s" : "0.3s", 
                      color: "white",
                      textAlign : "justify",
                      // flexBasis: "calc(25% - 10px)",
                      // margin : "10px"
                    }}
                  >
                      <div style={{marginLeft: "20px", marginRight: "20px"}}>
                          <div style={{display : "flex", justifyContent: "space-between", marginTop: "20px"}}>
                            {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                          </div>
                          <div onClick = {(e) => handleImageOpen(e, imageObject)} style={{cursor: "pointer"}}>
                          <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                            <h5>{value.note}</h5>
                            {value.image && <img className='pinned-note-image' src={value.image} alt="image" style={{width: "30%"}} />}
                            <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                          </div>
                      </div>
                    </div>
                  )
                })  
              }
            </div>

            {/* For showing searched shared notes */}
            <div style={{display : "grid", gridTemplateColumns : "25% 25% 25% 25%"}}>
            {/* <div style={{display : "flex", flexDirection: "column",alignItems: "center", height: "100vh", width: "25%", flexWrap : "wrap"}}> */}
              {/* {noSharedSearchResultFound === false && <Spinner loading={true}/>} */}
              {noSharedSearchResultFound === true && noSearchResultFound === true ? <h3 style={{color: "yellow"}}><Spinner loading={false}/>No such note present</h3> : 
               sharedSearchResult && sharedSearchResult.map((value, index) => {
                  let noteObject = {
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  let imageObject = {
                    image : value.image,
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  return (
                    <div key={index} 
                      onMouseEnter = {(e) => setHoveredId((prev) => "pinnednote" + value.noteId + value.createdAt)}
                      onMouseLeave = {(e) => setHoveredId((prev) => "")}
                    style={{
                      border : "2px solid rgb(122, 14, 247)", 
                      margin: "10px 10px 10px 10px", 
                      borderRadius : "7px", 
                      height: "fit-content", 
                      backgroundColor: hoveredId === "pinnednote" + value.noteId + value.createdAt ? "rgb(255, 132, 0)" : "rgb(244, 71, 3)", 
                      transition: hoveredId === "pinnednote" + value.noteId + value.createdAt ? "0.3s" : "0.3s", 
                      color: "white",
                      textAlign : "justify",
                      // flexBasis: "calc(25% - 10px)",
                      // margin : "10px"
                    }}
                  >
                      <div style={{marginLeft: "20px", marginRight: "20px"}}>
                          <div style={{display : "flex", justifyContent: "space-between", marginTop: "20px"}}>
                            {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                              <ShareIcon fontSize='large'/>
                          </div>
                          <div onClick = {(e) => handleImageOpen(e, imageObject)} style={{cursor: "pointer"}}>
                          <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                            <h5>{value.note}</h5>
                            {value.image && <img className='pinned-note-image' src={value.image} alt="image" style={{width: "30%"}} />}
                            <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                          </div>
                      </div>
                      <div style={{margin: "20px"}}>
                        {params.userId === value.sharedBy && 
                          <div>
                            <div>Owner : You </div> 
                            <div>
                              Shared with : {value.sharedTo.length !== 0 ? 
                              value.sharedTo.map((val, ind) => {
                                  return (
                                  <div style={{display: "flex"}}>
                                    <div>{ind+1}. {val.sharedName}</div>
                                  </div>)
                                }
                              ): <span>None</span>}
                            </div>
                          </div>
                        }
                        {params.userId !== value.sharedBy && 
                          <div>
                            <div>Owner: {value.sharedBy}</div> 
                            <div> 
                              Shared with (other than you):  {value.sharedTo.length === 1 ? 'None' : value.sharedTo.filter((val) => val.sharedId !== params.userId).map((val, ind) => 
                                {return (
                                <div style={{display: "flex"}}>
                                  <div>{ind+1}. {val.sharedName}</div>
                                </div>)}
                              )}
                            </div>
                          </div>}
                      </div>
                    </div>
                  )
                })  
              }
            </div>


          {/* ********************************************************************************* */}
          {/* ********************************************************************************* */}

          {!search && 
          <div>
            <div style={{marginBottom : "50px", marginTop: "50px"}}>
              <h1 style={{textDecorationLine: "underline", textDecorationStyle: "wavy", textDecorationThickness: "1.5px", textUnderlinePosition: "under"}}>
                SHARED NOTES
              </h1>
            {/* <div style={{display : "grid", gridTemplateColumns : "25% 25% 25% 25%"}}> */}
            <div style={{display : "flex", flexDirection: "column",alignItems: "center", height: "150vh", width: "25%", flexWrap : "wrap"}}>
              {sharedNotes === undefined && noSharedNotesFound === false && <Spinner loading={true}/>}
              {noSharedNotesFound === true ? <h3 style={{color: "yellow"}}><Spinner loading={false}/>No shared notes present</h3> :
                sharedNotes && sharedNotes.map((value, index) => {
                  let sharedEditNoteObject = {
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  let imageObject = {
                    image : value.image,
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  return (
                    <div key={index} 
                      onMouseEnter = {(e) => setHoveredId((prev) => "sharednote" + value.noteId)}
                      onMouseLeave = {(e) => setHoveredId((prev) => "")}
                      style={{
                        border : "2px solid red",
                        margin: "10px 10px 10px 10px", 
                        borderRadius : "7px", 
                        height: "fit-content", 
                        backgroundColor: hoveredId === "sharednote" + value.noteId ? "rgb(81, 10, 161)" : "rgb(52, 6, 104)",  
                        transition: hoveredId === "sharednote" + value.noteId ? "0.3s" : "0.3s",  
                        color: "white",
                        textAlign : "justify",
                        flexBasis: "calc(25% - 10px)",
                      margin : "10px"
                      }}
                    >
                      <div style={{marginLeft: "20px", marginRight: "20px"}}>
                          <div style={{display : "flex", justifyContent: "space-between", marginTop: "20px"}}>
                            {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                          </div>
                          <div onClick = {(e) => handleImageOpen(e, imageObject)} style={{cursor: "pointer"}}>
                          <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                            <h5>{value.note}</h5>
                            {value.image && <img className='pinned-note-image' src={value.image} alt="image" style={{width: "30%"}} />}
                            <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                          </div>
                      </div>

                      <div style={{margin : "20px"}}>
                        {params.userId === value.sharedBy && 
                          <div>
                            <div>Owner : You </div> 
                            
                            <div>
                              Shared with : {value.sharedTo.length !== 0 ? 
                              value.sharedTo.map((val, ind) => {
                                  return (<div style={{display: "flex"}}>
                                    <div>{ind+1}. {val.sharedName}</div>
                                  </div>)
                                }
                              ): <span>None</span>}
                            </div>
                          </div>
                        }
                        {params.userId !== value.sharedBy && 
                          <div>
                            <div>Owner: {value.sharedBy}</div> 
                            <div> 
                              Shared with (other than you):  {value.sharedTo.length === 1 ? 'None' : value.sharedTo.filter((val) => val.sharedId !== params.userId).map((val, ind) => 
                                {return (
                                <div style={{display: "flex"}}>
                                  <div>{ind+1}. {val.sharedName}</div>
                                </div>)}
                              )}
                            </div>
                          </div>}
                      </div>

                      <div style={{color: "black", margin: "20px"}}>
                        <TextField color="secondary" focused 
                          style={{
                            color: "black", 
                            width: "230px", 
                            backgroundColor: "white",
                            marginRight: "5px",
                            marginBottom : "5px",
                            borderRadius: "7px",
                            }} 
                          // value = {sharedToUserId}
                          onChange={(e) => setSharedToUserId((prev) => e.target.value)} 
                          placeholder='Enter userId you want to share this note with'
                          InputProps={{style:{fontSize : "10px", color:"black", height: "30px"}}}
                        />
                        <Button variant="contained" color="success" onClick={(e) => handleShareNote(e, value.noteId, value.isPinned)}>
                          Add User
                        </Button>
                        {value.sharedTo.length !== 0 && 
                            <div>
                              <select 
                                onChange={(e) => setReceiverIdtoRevoke((prev) => e.target.value)} 
                                style={{color: "black"}}
                              >
                                <option>Select user you want to revoke</option>
                                {value.sharedTo.map((val, ind) => 
                                  (<option value={val.sharedId}>{val.sharedName}</option>)
                                )}
                              </select>
                              <Button variant="contained" color="error" onClick={(e) => handleRevokeReceiver(e, value.sharedBy, receiverIdtoRevoke, value.noteId)}>
                                Revoke User
                              </Button>
                            </div>
                          }
                      </div>
  
                      <div style={{display: "flex", justifyContent: "space-between", margin: "10px 40px 10px 20px"}}>
                        <Pencil onClick={(e) => handleOpenEditSharedModal(e, sharedEditNoteObject)} size={20} style = {{cursor : "pointer", marginLeft: "10px"}}>Edit</Pencil>
                        
                         {params.userId === value.sharedBy ?
                            <DeleteIcon fontSize='large' sx={{cursor: "pointer"}} onClick={(e) => {
                              handleDeleteSharedNoteforAll(e, value.noteId, value.sharedBy);
                            }}/>
                          :
                            <DeleteIcon fontSize='large' sx={{cursor: "pointer"}} onClick={(e) => {
                              handleDeleteSharedNotebyReceiver(e, value.noteId, value.sharedTo);
                            }}/>
                        }
      
                        
                      </div>
                    </div>
                  )
                })  
              }
              
            </div>
          </div>
          <div style={{border: "2px solid white", marginTop: "10px"}}></div>
          <div style={{border: "2px solid white", marginTop: "10px"}}></div>
            

          {/* ******************************************************************************************************* */}
          {/* ******************************************************************************************************* */}

          <div style={{marginBottom : "50px", marginTop: "50px"}}>
            <h1 style={{textDecorationLine: "underline", textDecorationStyle: "wavy", textDecorationThickness: "1.5px", textUnderlinePosition: "under"}}>
              PINNED NOTES
            </h1>
            {/* <div style={{display : "grid", gridTemplateColumns : "25% 25% 25% 25%"}}> */}
            <div style={{display : "flex", flexDirection: "column",alignItems: "center", height: "150vh", width: "25%", flexWrap : "wrap"}}>
              {pinnedNotes === undefined && noPinnedNotesFound === false && <Spinner loading={true}/>}
              {noPinnedNotesFound === true  ? <h3 style={{color: "yellow"}}><Spinner loading={false}/>No pinned notes present</h3> : 
                pinnedNotes && pinnedNotes.map((value, index) => {
                  
                  let noteObject = {
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  let imageObject = {
                    image : value.image,
                    noteTitle : value.noteTitle,
                    note : value.note,
                    date : new Date(value.createdAt).toString().slice(0, 21),
                    noteId : value.noteId
                  }
                  return (
                    <div key={index} 
                    onMouseEnter = {(e) => setHoveredId((prev) => "pinnednote" + value.noteId)}
                      onMouseLeave = {(e) => setHoveredId((prev) => "")}
                    style={{
                      border : "2px solid rgb(122, 14, 247)", 
                      margin: "10px 10px 10px 10px", 
                      borderRadius : "7px", 
                      height: "fit-content", 
                      backgroundColor: hoveredId === "pinnednote" + value.noteId ? "rgb(255, 132, 0)" : "rgb(244, 71, 3)", 
                      transition: hoveredId === "pinnednote" + value.noteId ? "0.3s" : "0.3s", 
                      color: "white",
                      textAlign : "justify",
                      flexBasis: "calc(25% - 10px)",
                      margin : "10px"
                    }}
                  >
                      <div style={{marginLeft: "20px", marginRight: "20px"}}>
                          <div style={{display : "flex", justifyContent: "space-between", marginTop: "20px"}}>
                            {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                            <BsFillPinFill size={25} color="black" 
                              style={{cursor: "pointer"}}
                              onClick={(e) => handleRemoveNoteFromPinned(e, value.noteId)}
                            />
                          </div>
                          <div onClick = {(e) => handleImageOpen(e, imageObject)} style={{cursor: "pointer"}}>
                          <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                            <h5>{value.note}</h5>
                            {value.image && <img className='pinned-note-image' src={value.image} alt="image" style={{width: "30%"}} />}
                            <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                          </div>
                      </div>
                      <div style={{color: "black", margin: "20px"}}>
                        <TextField color="secondary" focused 
                          style={{
                            color: "black", 
                            width: "230px", 
                            backgroundColor: "white",
                            marginRight: "5px",
                            borderRadius: "7px"
                            }} 
                            // value = {sharedToUserId}
                            onChange={(e) => setSharedToUserId((prev) => e.target.value)} 
                            placeholder='Enter userId you want to share this note with'
                            InputProps={{style:{fontSize : "10px", color:"black", height: "30px"}}}
                        />
                        <Button variant="contained" color="success" onClick={(e) => handleShareNote(e, value.noteId, value.isPinned)}>
                          Add User
                        </Button>
                      </div>
                      <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                        <Pencil onClick={(e) => handleOpen(e, noteObject)} size={20} style = {{cursor : "pointer", marginLeft: "10px"}}>Edit</Pencil>
                        <DeleteIcon fontSize='large' sx={{cursor: "pointer"}} onClick={(e) => {
                          handleDeleteNote(e, value.noteId);
                        }}/>
                        <ContentCopyIcon fontSize='large' sx={{cursor: "pointer", marginRight: "10px"}} onClick={(e) => {
                          handleMakeCopy(e, value.noteId, value.noteTitle, value.note, true, value.image)
                        }}>Make a Copy</ContentCopyIcon>
                      </div>
                    </div>
                  )
                })  
              }
            </div>
          </div>
          <div style={{border: "2px solid white", marginTop: "10px"}}></div>
          <div style={{border: "2px solid white", marginTop: "10px"}}></div>

          {/* ################################################################################################################# */}
          {/* ################################################################################################################# */}

          <div>
            <h1 style={{marginTop: "50px", textDecorationLine: "underline", textDecorationStyle: "wavy", textDecorationThickness: "1.5px", textUnderlinePosition: "under"}}>
              Other NOTES
            </h1>
            {/* <div style={{display : "grid", gridTemplateColumns : "auto auto auto auto", marginBottom: "30px"}}> */}
            <div style={{display : "flex", flexDirection: "column", alignItems: "center", height: "150vh", width: "25%", flexWrap : "wrap"}}>
            {data === undefined && noNotesFound === false && <Spinner loading={true}/>}
            {noNotesFound === true ? <h3 style={{color: "yellow"}}><Spinner loading={false}/>No other notes present</h3> :
              data && data.map((value, index) => {
                <Spinner loading={false}/>
                let noteObject = {
                  noteTitle : value.noteTitle,
                  note : value.note,
                  date : new Date(value.createdAt).toString().slice(0, 21),
                  noteId : value.noteId
                }
                let imageObject = {
                  image : value.image,
                  noteTitle : value.noteTitle,
                  note : value.note,
                  date : new Date(value.createdAt).toString().slice(0, 21),
                  noteId : value.noteId
                }
                return(
                  <div key={index} 
                    onMouseEnter = {(e) => setHoveredId((prev) => "othernotes" + value.noteId)}
                    onMouseLeave = {(e) => setHoveredId((prev) => "")}
                    style={{
                      border : "2px solid red", 
                      margin: "10px 10px 10px 10px", 
                      borderRadius : "7px", 
                      height: "fit-content", 
                      backgroundColor: hoveredId === "othernotes" + value.noteId ?  "blue" : "royalblue", 
                      transition: hoveredId === "othernotes" + value.noteId ?  "0.3s" : "0.3s", 
                      color: "white",
                      textAlign : "justify",
                      flexBasis: "calc(25% - 10px)",
                      margin : "10px"
                    }}
                  >
                    <div style={{marginLeft: "20px", marginRight: "20px"}}>
                        <div style={{display : "flex", justifyContent: "space-between", marginTop: "20px"}}>
                          {value.noteTitle !== undefined ? <h2>{value.noteTitle}</h2> : null}
                          <Pin 
                              size={25} color="black" fill="white" 
                              style={{cursor: "pointer", color: "white"}}
                              onClick={(e) => handleAddNoteToPinned(e, value.noteId)}
                              />
                        </div>
                        <div onClick = {(e) => handleImageOpen(e, imageObject)} style={{cursor: "pointer"}}>
                          <div style={{border: "1.5px solid white", margin: "5px 0px 5px 0px", textDecoration: "wavy"}}></div>
                          <h5>{value.note}</h5>
                          {value.image && <img className='note-image' src={value.image} alt="image" style={{width: "30%", cursor: "pointer"}}/>}
                          <p>{new Date(value.createdAt).toString().slice(0, 21)}</p>
                        </div>
                    </div>
                    <div style={{color: "black", margin : "20px"}}>
                      <TextField color="secondary" focused 
                          style={{
                            color: "black", 
                            width: "230px", 
                            backgroundColor: "white",
                            marginRight: "5px",
                            borderRadius: "7px"
                            }} 
                          // value = {sharedToUserId}
                          onChange={(e) => setSharedToUserId((prev) => e.target.value)} 
                          placeholder='Enter userId you want to share this note with'
                          InputProps={{style:{fontSize : "10px", color:"black", height: "30px"}}}
                        />
                      <Button variant="contained" color="success" onClick={(e) => handleShareNote(e, value.noteId, value.isPinned)}>
                        Add User
                      </Button>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                      <Pencil onClick={(e) => handleOpen(e, noteObject)} size={20} style = {{cursor : "pointer", marginLeft: "10px"}}>Edit</Pencil>
                      <DeleteIcon fontSize='large' sx={{cursor: "pointer"}} onClick={(e) => {
                        handleDeleteNote(e, value.noteId);
                      }}/>
                      <ContentCopyIcon fontSize='large' sx={{cursor: "pointer", marginRight: "10px"}} onClick={(e) => {
                        handleMakeCopy(e, value.noteId, value.noteTitle, value.note, false, value.image)
                      }}>Make a Copy</ContentCopyIcon>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>}

        {
          openEditSharedModal && sharedEditNoteObject && <Modal
            open={openEditSharedModal}
            onClose={handleCloseEditSharedModal}
            closeAfterTransition
          >
            <Fade in={openEditSharedModal}>
              <Box sx={style}>
                <input type="text" defaultValue={sharedEditNoteObject.noteTitle} placeholder='Enter note title' style={{color: "black"}} onChange={(e) => {
                  setNewEditedTitle((prev) => (e.target.value))
                }}/>
                <input type="text" defaultValue={sharedEditNoteObject.note} placeholder='Enter note' style={{color: "black"}} onChange={(e) => {
                  setNewEditedNote((prev) => (e.target.value))
                }}/>
                <button onClick={(e) => handleEditSharedNote(e, sharedEditNoteObject.noteId, sharedEditNoteObject.noteTitle, sharedEditNoteObject.note)}>Edit note</button>
              </Box>
            </Fade>
          </Modal>
        }

        {open && noteObject && <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Fade in={open}>
            <Box sx={style}>
              <input type="text" defaultValue={noteObject.noteTitle} placeholder='Enter note title' onChange={(e) => {
                setNewEditedTitle((prev) => (e.target.value))
              }}/>
              <input type="text" defaultValue={noteObject.note} placeholder='Enter note' onChange={(e) => {
                setNewEditedNote((prev) => (e.target.value))
              }}/>
              <button onClick={(e) => handleEditNote(e, noteObject.noteId, noteObject.noteTitle, noteObject.note)}>Edit note</button>
            </Box>
          </Fade>
        </Modal>}
        <div>
          {openImageModal && imageObject && <div style={{margin: "auto"}}>
            <Modal
              open={openImageModal}
              onClose={handleImageClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{height: "400px", marginTop : "20px"}}
            >
              <Box sx={{...styleImageModal, width: "500px", overflowY : "scoll", margin : "auto"}}>
                <h1>{imageObject.noteTitle}</h1>
                <div style={{border: "1px solid black", marginBottom: "20px"}}></div>
                <h3>{imageObject.note}</h3>
                <h4>{imageObject.date}</h4>
                {imageObject.image && <img align="center" src={imageObject.image} style={{width: "70%", border: "2px solid black", margin: "auto auto", display: "block"}}/>}
              </Box>
            </Modal>  
          </div>}
        </div>
        
        <ToastContainer />
        <Footer/>
      </div>
    </div>
  )
}

