import React, { useState } from "react";
import { useRef } from "react";
import Loader from "./Loader";



const Centerpage = () => {
  const [addloader,setloader]=useState(false);
  const [response, setResponse] = useState(null);
  const input_box=useRef();
  const [image, setImage] = useState(null);
  const make_call_toapi = async (e) => {
    setloader(!addloader);
    const text = input_box.current.value; // Get input value
  
    try {
      const res = await fetch("http://127.0.0.1:8000/submit-json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set JSON header
        },
        body: JSON.stringify({ name: text }), // Send JSON body
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const response2 = await res.json();
      setResponse(response2);
      console.log(response2);
    } catch (error) {
      console.error("Error:", error);
      setResponse({ error: error.message });
    }
  };
  
  const handleImageChange = async (e) => {
    setloader(!addloader);
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image
      setImage(imageUrl); // Set the image URL in state

      // Prepare FormData for API call
      const formData = new FormData();
      formData.append("file", file); // Append the selected file to FormData

      try {
        // Send image to the API
        const response = await fetch("http://127.0.0.1:8000/image", {
          method: "POST",
          body: formData, // Send FormData in the body
        });

        const result = await response.json();
        console.log(result); // Handle the response from the API
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="mt-10 min-h-[450px] mx-8 md:mx-44 rounded-3xl bg-gradient-to-br from-purple-300 to-purple-500 flex flex-col items-center justify-center">
      {addloader&&<Loader/>}
   {!addloader&&<div className="flex flex-col items-center justify-center">
      <form>
        <div className="text-4xl md:text-6xl ">
          Add the photo of the <span className="text-white">medicine</span>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        onChange={handleImageChange} // Call handleImageChange when file is selected
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: 'none' }} // Hide the file input
      />

      {/* Custom label styled as a button to trigger file input */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-white text-black py-2 px-4 rounded-md mt-4"
      >
        Upload image
      </label>

      {/* Display the uploaded image */}
      {false && (
        <div className="mt-4">
          <img
            src={image}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div className="mt-6 mb-6">OR</div>
      <div>
        <div className="flex">
       <div>Enter the medicine name</div> 
        <input ref={input_box} type="text" className="ml-4 p-1 rounded-md"></input>
        </div>
        <br></br>
        <button className="p-1  px-8 rounded-md mt-8 bg-white" onClick={()=>{
          make_call_toapi();
        }}>Submit</button>
      </div>
      </div>}
    </div>
  );
};

export default Centerpage;

