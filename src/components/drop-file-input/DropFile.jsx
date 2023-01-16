import React, { useRef,useState,useCallback,useEffect } from 'react'
import axios from 'axios';
import { Button } from '@mui/material';
import '../../assets/css/dropFile.css'
import './drop-file-input.css'
import { ImageConfig } from '../../config/ImageConfig';
import uploadImage from '../../assets/images/cloud-upload.png'
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import Progress from '../Progress/Progress.js'
import {Box} from '@mui/material';
import uuid from "react-uuid";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CircularProgress from '@mui/material/CircularProgress';
import CachedSharpIcon from '@mui/icons-material/CachedSharp';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const URL_SERVER='http://localhost:8690'
function DropFile({websckt}) {
  // console.log(websckt)
  const wrapperRef = useRef(null)
  const onDragEnter = () => wrapperRef.current.classList.add('dragover')
  const onDragLeave = () => wrapperRef.current.classList.remove('dragover')
  const onDrag = () => wrapperRef.current.classList.remove('dragover')

  const [downloadFileList, setDownloadFileList] = useState({})
  const [fileStorageList, setFileStorageList] = useState([]);
  const [isDownloadFile, setIsDownloadFile] = useState(false)
  const [successUploadFileList,setsuccessUploadFileList] = useState([])
  const [successExcuteFileList,setsuccessExcuteFileList ] = useState([])
  const [failExcuteFileList,setFailExcuteFileList ] = useState([])
  const [queueCal,setququeCal] = useState([])
  const [prevList,setPrevList] =  useState(null)
  const [isClickBtn,setisClickBtn] = useState(null)
  
  const [age, setAge] = React.useState(1);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    // action on update of movies
    if(prevList){
      setsuccessUploadFileList([...successUploadFileList,prevList])
    }else{
      setsuccessUploadFileList([])
    }
  }, [prevList]);

  useEffect(() => {
    // action on update of movies
    if(isClickBtn!==-1){
      setququeCal([...queueCal,isClickBtn])
    }else{
      setququeCal([])
    }
  }, [isClickBtn]);

  const onFileDrop =(e) => {
    const fileStype = ["xlsx","xlsb"]

    var newFile = []
    for(var i=0;i<=e.target.files.length;i++){
      if(e.target.files[i] && fileStype.indexOf(e.target.files[i].name.split(".")[1]) !== -1){
        newFile=[...newFile,[e.target.files[i],e.target.files[i].size]]
      }
    }

    newFile.sort(
      (first, second) => { return first[1] - second[1] }
    );
    newFile = newFile.map((e) => { 
      return { file : e[0], uuid_item : uuid() } 
    });

    const newStorageList = [...fileStorageList,...newFile]
    setFileStorageList(newStorageList);
    for (const key in newFile) {
      if (newFile.hasOwnProperty(key)) {
        var formData = new FormData()
        formData.append('file', newFile[key].file);
        axios.post( URL_SERVER+'/upload/'+newFile[key].uuid_item+'/', 
          formData, {
          headers: {
            'Content-Type': newFile[key].file.type
          }
        }).then(response => {
          console.log("Response!-"+newFile[key].uuid_item)
          if(response.status==200){
            setPrevList(newFile[key].uuid_item)
          }          
        });
      }
    }
  }
  const fileRemove = (uuid_item) =>{
    var updatedList = []
  
    for (const key in fileStorageList) {
      if (fileStorageList.hasOwnProperty(key)) {
        if(fileStorageList[key].uuid_item !== uuid_item){
          updatedList = [...updatedList,fileStorageList[key]]
        }
      }
    }
    setFileStorageList(updatedList)
  }

  function postdata(url,uuid_token) {
    return axios.post(url, {
      uuid_token: uuid_token
    });
  }
  const onExcuteFile = (e) =>{ 
    
    setisClickBtn(e.target.value)
    if(e.target.value){
      try {
        postdata(URL_SERVER+"/file_handling",e.target.value).then((response)=>{
        console.log(response.data.content)
        if(response.status!==200){
           alert("Request Fail!")
        }else{
            if(response.data.content === "error format file"){
              setFailExcuteFileList([...failExcuteFileList,e.target.value])
            }else{
              setsuccessExcuteFileList([...successExcuteFileList,e.target.value])
              document.getElementById("download_"+e.target.value).href = response.data.content
              setisClickBtn(-1)
            }
            }
          
        })
       
      }
      catch(err) {
        alert("ERRO");
      }
      
    }
  }
  
  const onDownloadFile = (e) =>{
    console.log(e.target.value)
    document.getElementById("download_"+e.target.value).click()
  }
  const onClearAll = ()=>{
    setFileStorageList([])
  }
  return (
    <>
    <div style={{width:'100%',margin:'10px 0 10px 0'}}>
          <Button onClick={onClearAll} style={{position:'absolute',top:'0px',right:'0px'}}  endIcon={<CachedSharpIcon></CachedSharpIcon>}>Clear All</Button>
    </div>
    <div ref={wrapperRef} className='drop-file-input' 
          onDragEnter={onDragEnter}
          onDrag = {onDrag}
          onDragLeave= {onDragLeave}
    > 
      <div className='drop-file-input_label'>
          <img src={uploadImage}></img>
          <p>Drag & Drop your files here</p>
      </div>
      <input type="file"   value="" onChange={onFileDrop} multiple></input>
    </div>
    {

      fileStorageList.length > 0 ? (
        <div className='drop-file-preview'>
            
            <p className='drop-file-preview_title'>
              Ready to upload
            </p>
            <Box style={{width:"100%", marginBottom:"10px"}}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Select your processing</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Select your processing"
                            onChange={handleChange}
                           
                          >
                            <MenuItem value={1}>Process 101: Customer credit</MenuItem>
                          </Select>
                        </FormControl>
                  </Box>
            {
              fileStorageList.map((item) => (
                
                  <div key={item.uuid_item} className="drop-file-preview_item">
                      <img  src={ImageConfig[item.file.type.split('/')[1]] || ImageConfig['xlsx']}
                        className="drop-file-preview_item_info"
                      alt="" />
                      <div>
                      <p>{item.file.name}</p>
                      <p>{parseFloat((item.file.size/1024).toFixed(1))} KB</p>
                      </div>
                      <CancelPresentationIcon className='drop-file-preview_item_del' onClick={()=>
                        fileRemove(item.uuid_item)
                      }></CancelPresentationIcon>
                      <a id={"download_"+item.uuid_item}  hidden={true}></a>
                      
                     
                     <Progress  value_progress={successUploadFileList.indexOf(item.uuid_item)!==-1?100:0}  ></Progress>
                    
                              {
                                failExcuteFileList.indexOf(item.uuid_item)!==-1 ? (
                                  <Box  className='box_btn_item'>
                                  <Alert severity="error" style={{marginTop:"5px"}}>Error! Please check format file!</Alert>
                                  </Box>
                                ): (
                                  <Box  className='box_btn_item'>
                                            <div className='btn_item_item'  hidden={successUploadFileList.indexOf(item.uuid_item)!==-1? false:true} >
                                              <Button id={'loading_btn_'+item.uuid_item} style={{width:'100%',height:'100%' }} 
                                            
                                              onClick={onExcuteFile}  value={item.uuid_item} endIcon={
                                              successExcuteFileList.indexOf(item.uuid_item)!==-1 ?
                                              <CheckCircleOutlineSharpIcon></CheckCircleOutlineSharpIcon>:null}
                                              disabled={
                                                successExcuteFileList.indexOf(item.uuid_item)!==-1 ?
                                                true:false
                                              } 
                                              >
                                                {
                                                  queueCal.indexOf(item.uuid_item)!==-1 ? (
                                                      <CircularProgress style={{width:'22px',height:'22px',color:"white"}}></CircularProgress>
                                                  ): 'Calculator'
                                                }
                                                
                                              </Button>
                                          </div>
                                          {
                                            successExcuteFileList.indexOf(item.uuid_item)!==-1 ? (  <div  className='btn_item_item' >
                                            <Button style={{width:'100%',height:'100%' }}  onClick={onDownloadFile}  value={item.uuid_item}>Download File</Button>
                                            </div>): null
                                          }
                                  </Box>
                                )
                              }
                </div>
                ))
            }
            </div>
      ):null
    }

     
    </>
  )
}

export default DropFile