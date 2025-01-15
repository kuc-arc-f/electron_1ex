import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
//import Head from '../components/Head'
console.log("#Home.");
//
function Home() {

  const testProc = async function(){
    try{
      const url = import.meta.env.VITE_API_URL;
      console.log("url=", url);
      const item = {title : "test0115b" };
      const path = url + "/api/tauri_todo14_create";
      const res = await window.myPostExternelApi.postExternelApi(path, item);
      console.log(res);
      if(res.data){
        console.log(res.data);
      }
    } catch(e){
      console.error(e);
    }
  }

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
      <h1 className="text-4xl text-gray-700 font-bold my-2"
      >home</h1>
      <hr />
      <Link to="/about">[ about ]</Link>
      <hr />
      <span>Test</span>
      <h1>Hello, world.</h1>
      <button id="button" onClick={() => testProc()}>Open</button>
      <br />
      <span>input</span>
      <input type="text" id="text1"/>
      <p id="text"></p>
  </div>
  )
}

export default Home;