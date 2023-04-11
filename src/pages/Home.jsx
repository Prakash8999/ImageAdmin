import React, { useEffect, useRef, useState } from "react";
import { db, storage } from "./FbConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

const Home = () => {
  const [image, setImage] = useState(null);
  const fileref = useRef();
  const [progress, setProgress] = useState(0);
  const [deleteDoc, setDeleteDoc] = useState([]);

  const reset = () => {
    fileref.current.value = "";
  };

  const imgInfo = {
    title: "",
    description: "",
    dimensions: "",
    tags: [],
  };
  // let addTags = tags
  // imgInfo.tags.push(addTags)
  const [info, setInfo] = useState(imgInfo);
  // const storageRef = ''
  const uploadImg = () => {
    if (image) {
      const storageRef = ref(storage, `SuperheroesAi/${image.name}`);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progres =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progres);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, "Images"), {
              ...info,
              url: downloadURL,
              reference: `SuperheroesAi/${image.name}`,
            }).then(() => {
              setInfo(imgInfo);
              alert("Uploaded");
              setProgress(0);
              reset();
            });
          });
        }
      );
    }
  };
  const handleFormStateChange = (e) => {
    setInfo({
      ...info,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <div className="relative flex flex-col  justify-center items-center">
        <div className="flex flex-col pt-3 gap-y-2">
          <Link
            to="/view"
            className="border-2 p-2 rounded-md border-black shadow hover:shadow-lg absolute right-2 top-3"
          >
            ViewImages
          </Link>
          <input
            type="file"
            accept="image/*"
            ref={fileref}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />

          {image ? (
            <img
              src={image && URL.createObjectURL(image)}
              alt=""
              className="h-[60vh] border-2 border-black p-1 object-cover w-[80vh]"
            />
          ) : (
            <div className="h-[60vh] border-2 border-black p-1 object-cover w-[80vh] flex items-center justify-center">
              Please Choose Image
            </div>
          )}
        </div>

        <div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              id="title"
              onChange={handleFormStateChange}
              value={info.title}
              className="block py-2.5 px-0 w-[50vw] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="title"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Title
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              id="description"
              onChange={handleFormStateChange}
              value={info.description}
              className="block py-2.5 px-0 w-[50vw] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="description"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Write description
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              id="tags"
              onChange={handleFormStateChange}
              value={info.tags}
              className="block py-2.5 px-0 w-[50vw] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />

            <label
              htmlFor="tags"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Tags
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              id="dimensions"
              onChange={handleFormStateChange}
              value={info.dimensions}
              className="block py-2.5 px-0 w-[50vw] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />

            <label
              htmlFor="dimensions"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              dimensions
            </label>
          </div>

          <div className="w-[50vw] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="duration-200 bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={uploadImg}
          className="border-2 p-2 rounded-md border-black shadow hover:shadow-lg"
        >
          Upload Image
        </button>
        <br />
        <p>{URL}</p>
        <img src={URL} alt="" />
      </div>
    </>
  );
};

export default Home;
