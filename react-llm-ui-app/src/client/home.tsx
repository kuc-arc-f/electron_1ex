import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
//import Head from '../components/Head'
import { marked } from 'marked';
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const LLM_MODELS = [
  {name: "gemini-1.5-flash"},
  {name: "gemini-2.0-flash-exp"},
  {name: "gemini-exp-1206"},
];
//console.log("#API_KEY=" , API_KEY);
let selectModel = "";

function Home() {
  const [updatetime, setUpdatetime] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [getText, setGetText] = useState<string>("");
  const [sendText, setSendText] = useState<string>("");
  const [models, setModels] = useState([{name: ""}]);
  const [isDownload, setIsDownload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReceive, setIsReceive] = useState(false);

  const containsNewline = (str) => /\r\n|\r|\n/.test(str);

  useEffect(() => {
    (async () => {
      try{
        const model = chatUtil.getModelName(LibConfig.STORAGE_KEY_LLM_MODEL);
        console.log("model=", model);
        selectModel = model;
        console.log(LLM_MODELS);
        //setModels(res.models);
        setModels(LLM_MODELS);
      }catch(e){
        console.erros(e);
      }
    })()
  }, []);

  const chatStart = async function(){
    try{    
      setText("");
      setSendText("");
      setIsDownload(false);
      const elem = document.getElementById("input_text");
      let inText = "";
      if(elem){
        inText = elem.value;
      };
      console.log("inText=", inText);
      console.log("selectModel=", selectModel);
      if(!selectModel){
        alert("Error, model set")
         return; 
      }
      if(!inText){ return; }
      setSendText(inText);
      setIsLoading(true);
      setIsReceive(true);
      const model = genAI.getGenerativeModel({ model: "gemini-exp-1206"});

      const result = await model.generateContent(inText);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      let target = text;
      elem.value = "";
      let htm = marked.parse(target);
      setText(htm);
      setGetText(target);
      setIsLoading(false);
      setIsDownload(true);
    } catch(e){
      console.error(e);
    }
  }

  const textDownload = async function(){
    try{    
      const ret = await chatUtil.downloadTextFile("text.md", getText);
    } catch(e){
      console.error(e);
    }
  }

  const handleChange = (event) => {
    selectModel = event.target.value;
    setUpdatetime(String(new Date().getTime()));
    console.log("event.target.value=", event.target.value);
    localStorage.setItem(LibConfig.STORAGE_KEY_LLM_MODEL, selectModel);
  };

  const topScroll = function(){}

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <div className="text-end">
      <span>model: </span>
      <select value={selectModel} onChange={handleChange}>
        <option value="" disabled>-- Select Please --</option>
        {models.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
        ))}
      </select>
    </div>
      <hr />
      <h1 className="text-3xl text-gray-700 font-bold my-2"
      >AI-chat</h1>
      <hr />
      <textarea id="input_text" 
      className="border border-gray-400 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" 
      rows="4" 
      ></textarea>

      <div className="flex flex-row">
        <div className="flex-1 text-center p-1">
        {isLoading ? (
          <div 
          className="animate-spin rounded-full h-8 w-8 mx-4 border-t-4 border-b-4 border-blue-500">
          </div>
        ): null}
        </div>
        <div className="flex-1 text-end p-2">
          <button id="button" onClick={() => chatStart()}
          className="btn-blue"
          >GO</button>
        </div>
      </div>
      
      {isReceive ? (
      <>
        <pre className="bg-blue-100 mt-1 p-2">{sendText}</pre>
        receive:
        <div dangerouslySetInnerHTML={{ __html: text }} id="get_text_wrap"
        className="mb-8 p-2 bg-gray-100" />
        <hr className="my-1" />
      </>
      ): null}
      {isDownload ? (
      <div className="flex flex-row">
        <div className="flex-1 text-center p-2">
          <button onClick={() => textDownload()}
          className="btn-outline-blue"
            >Download</button>
        </div>
        <div className="flex-1 text-end p-2">
          <button 
          className="btn-outline-blue"
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth'});
          }}>⇑ Top </button>
        </div>
        <hr className="my-1 mt-2 mb-16 " />
      </div>
      ): null}
  </div>
  )
}
export default Home;
/*
*/