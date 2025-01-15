import { invoke } from '@tauri-apps/api/core';
let API_BASE = import.meta.env.VITE_API_URL;
import axios from 'axios';

const ApiUtil = {

  get: async function(path: string): Promise<any>
  {
    try{
      const apiUrl = API_BASE + path; // 外部 API の URL
      const retObj = {ret: 500, data: {}}

      const response = await invoke('get_external_api', {url: apiUrl});
      //console.log(response);
      if(response){
        //@ts-ignore
        const obj = JSON.parse(response);
        //console.log(obj);
        if(obj.status){
          retObj.ret = obj.status;
          console.log("status=", obj.status);
        }
        if(obj.body){
          try {
            const target = JSON.parse(obj.body);
            retObj.data = target;
          }catch(e){
            console.log(e);
            retObj.data = "";
          }
        }
        return retObj;
      }
      return [];
    }catch(e){
      console.error(e);
      throw new Error('Error, get')

    }
  },

};
export default ApiUtil;