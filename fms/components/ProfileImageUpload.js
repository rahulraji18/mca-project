import React, { useState, useRef,useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Img from '../public/assets/img/basic_image.png';

// Import the FontAwesome camera icon

const ProfileImageUpload = ({createObjectURL,onImageChange}) => {

    // console.log(createObjectURL)
  const [image, setImage] = useState(createObjectURL);
  const fileInputRef = useRef(null); // Initialize fileInputRef using useRef

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      // Use a FileReader to display a preview of the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
      onImageChange(selectedImage);
    }
  };
  useEffect(() => {
   setImage(createObjectURL)
//    console.log(image)

  }, [createObjectURL])
  
  const handleImageRemove = () => {
    setImage(null);
    fileInputRef.current.value = ''; 
    onImageChange(null);
  };

  const handleCameraIconClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
    <style jsx>
        {
            `
            .image-container {
  position: relative;
  display: inline-block;
}

.default-image {
  position: relative;
}

.default-image i.fa-camera {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px!important
}

.default-image:hover i.fa-camera {
  display: flex;
}



            `
        }
    </style>
      <div className="image-container">
        {image ? (
          <div className="mb-3">
            <img
              src={image}
              alt="Profile Preview"
              className="img-fluid rounded-circle01 uplaod-after01"
              style={{ maxWidth: '100px' }}
            />
            <Button className="profile-upload-close" variant="light" size="sm" onClick={handleImageRemove}>
             <i className='fa fa-close'></i>
            </Button>
          </div>
        ) : (
          <div className="default-image">
            <i
              className="fa fa-camera fa-3x"
              onClick={handleCameraIconClick} // Handle click on camera icon
            ></i>
            {/* <br /> */}
            <img
              src={Img.src} // Replace with your default image path
              alt="Default Profile"
              className="img-fluid rounded-circle01 upload-before01"
              style={{ maxWidth: '100px' }}
            />
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="d-none"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImageUpload;
