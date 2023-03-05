import React, { useState } from 'react';
import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

export default function Spinner(props) {
    const [loading, setLoading] = useState(props.loading);
  return (
    <div style={{
        width: "100vw", 
        display: "flex",
        justifyContent : "center",
        alignItems : "center",
        borderColor: "red"
    }}>
        <HashLoader
            color="red"
            loading={loading}
            size={150}
        />
    </div>
  )
}
