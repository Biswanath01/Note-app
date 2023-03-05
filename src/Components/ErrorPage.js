import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Oops that didn't work</h1>
        <a href="/" style={{color: "blue"}}>Click here to go to home</a>
    </div>
  )
}
