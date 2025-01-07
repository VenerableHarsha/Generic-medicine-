import React, { useState } from "react";

const Centerpage = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image
      setImage(imageUrl); // Set the image URL in state

      // Prepare FormData for API call
      const formData = new FormData();
      formData.append("file", file); // Append the selected file to FormData

      try {
        // Send image to the API
        const response = await fetch("https://your-model-api-url.com/upload", {
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
      <form>
        <div className="text-6xl">
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
    </div>
  );
};

export default Centerpage;

