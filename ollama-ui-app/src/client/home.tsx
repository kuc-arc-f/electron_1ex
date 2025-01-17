import React from "react";
import {useState, useEffect}  from 'react';
import { Link } from 'react-router-dom';
//import Head from '../components/Head'
import ollama from 'ollama/browser'
import { marked } from 'marked';
import chatUtil from './lib/chatUtil';
import LibConfig from './lib/LibConfig';

console.log("#Home.");
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
        const res = await ollama.list();
        console.log(res.models);
        setModels(res.models);
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
      const message = { role: 'user', content: inText }
      const response = await ollama.chat({ 
        model: selectModel, 
        messages: [message], 
        stream: true 
      });
      let target = "";
      let htm = "";
      for await (const part of response) {
        if(part.message.content){
          console.log(part.message.content);
          target = target.concat(part.message.content);
          if(containsNewline(part.message.content)){
            //console.log("#return");
            htm = marked.parse(target);
            setText(htm);
          }
          htm = marked.parse(target);
          setText(htm);
        }
      }
      elem.value = "";
      htm = marked.parse(target);
      setText(htm);
      setGetText(target);
      setIsLoading(false);
      setIsDownload(true);
      //setIsReceive(false);
      //console.log(target);
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

  const getList = async function(){
    try{    
      const response = await ollama.list();
      console.log(response);
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

  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    {/*
      <Link to="/about">[ about ]</Link>
    */}
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
      <textarea id="input_text" className="input_textarea" rows="4" 
      ></textarea>
      <div className="text-end">
        <button id="button" onClick={() => chatStart()}
        className="btn-blue"
          >GO</button>
      </div>
      {isReceive ? (
      <>
        <pre className="bg-blue-100 mt-2 p-2">{sendText}</pre>
        <hr className="my-1" />
        receive:
        <div dangerouslySetInnerHTML={{ __html: text }} id="get_text_wrap"
        className="mb-8 p-2 bg-gray-100" />
        <hr className="my-1" />
      </>
      ): null}
      {isDownload ? (
      <div className="text-center">
        <button onClick={() => textDownload()}
        className="btn-outline-blue"
          >Download</button>
        <hr className="my-1 mt-2 mb-16 " />
      </div>
      ): null}
  </div>
  )
}
export default Home;
/*
<p id="text"></p>
<input type="text" size="40" />
*/