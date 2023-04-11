import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db, storage } from "./FbConfig";
import Home from "./Home";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import firebase from 'firebase/compat/app';
import {saveAs} from "file-saver";
import UrlImageDownloader from 'react-url-image-downloader'

const ViewImages = ({ temp }) => {
  const [images, getImages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "Images"));
    const temp = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((document) => {
        temp.push({ ...document.data(), imageId: document.id });
        // console.log( document.data());
      });
      getImages(temp);
    });
  }, []);



  // const downloadImg = (e)=>{

  //   // saveAs(e, "Twitter-logo");
  //   // UrlImageDownloader(e) 
    
  //  }




  const deleteImg = (e, docID) => {
  
    const storageRef = ref(storage, e);
    
    deleteObject(storageRef)
      .then(async () => {
        await deleteDoc(doc(db, "Images", docID));
        alert("Dleted");
      })
      .catch((err) => {
        console.log("Firestore err:" + err);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="w-full h-[40vh] md:h-[60vh] bg-slate-400 flex justify-center items-center object-scale-down bg-no-repeat gap-2 ">
        <input
          type="search "
          placeholder="search here "
          className="w-[70%] bg-transparent h-[12%] md:h-[15%] border-2 rounded-xl md:rounded-2xl outline-none focus:border-black px-1 placeholder:text-neutral-600 bg-white"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button className="rounded-full  bg-white px-4  focus:outline-blue-600 w-fit h-[12%]  md:h-[15%]">
          <AiOutlineSearch />
        </button>
      </div>

      <div className=" grid grid-cols-3 gap-4">
        {images
          ?.filter((value) => {
            return search.toLocaleLowerCase === ""
              ? value
              : value.description.toLocaleLowerCase().includes(search) ||
                  value.tags.toLocaleLowerCase().includes(search) || value.title.toLocaleLowerCase().includes(search); 
          })
          .map((value, index) => {
            return (
              <div key={"image" + index}>
                <div className="p-1 bg-slate-200">
                  <img src={value?.url} alt="" />
                  <p>{"Prompt: "+value?.description}</p>
                  <p>{"Title: "+value?.title}</p>
                  <p>{"Tags: "+value?.tags}</p>
                  <p>{"Tags: "+value?.dimensions}</p>
                  {/* <p>{value?.url}</p> */}
                <div className="flex gap-x-5">
                <button  className="border-2 border-black px-1"
                    onClick={() => {
                      deleteImg(value?.reference, value?.imageId);
                    }}
                  >
                    delete
                  </button>

                  <button className="border-2 border-black px-1"
                    type="button"
                  >
                 <a href={value?.url} download={value?.title} target="_blank">
        Download Image
      </a>
                  </button>
              
                </div>

                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ViewImages;
