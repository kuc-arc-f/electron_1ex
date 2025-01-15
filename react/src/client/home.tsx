import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
//import Head from '../components/Head'
console.log("#Home.");
//
function Home() {

  const testProc = async function(){
    const res = await window.mytest1api.test1api("test1");
    console.log(res);
  }

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
      <h1 className="text-4xl text-gray-700 font-bold my-2"
      >home</h1>
      <hr />
      <Link to="/about">[ about ]</Link>
      <hr />
      <h1>Test</h1>
      <button id="button" onClick={() => testProc()}>Open</button>
      <br />
      <p id="text"></p>
  </div>
  )
}
export default Home;
/*
<span>input</span>
<input type="text" id="text1"/>
*/