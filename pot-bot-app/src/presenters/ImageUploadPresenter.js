import React, {useState} from 'react';
import {updatePlantData, useAuth} from "../firebaseModel";
import {Link, useLocation} from "react-router-dom";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import ImageUploadView from "../views/ImageUploadView";

function ImageUploadPresenter() {
  const {state} = useLocation()
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()


  const uploader = async (event) => {
    const file = event.target.files[0]
    setSelectedImage(URL.createObjectURL(file));
    setLoading(true)
    const storage = getStorage()
    const imageRef = ref(storage, `/users/${user.uid}/${state.plantName}/${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file, {contentType: 'image/jpeg'})
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running');
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log('File available at', downloadURL);
          updatePlantData(user, `/plants/${state.plantName}/plantRecommendedVitals`, {image: downloadURL}).then(() => {
            //console.log('URL updated at database ')
          })
        });
      }
    );
  }
  return (
    <div style={{textAlign: "center"}}>
      <ImageUploadView uploader={uploader} loading={loading} setLoading={setLoading} setSelectedImage={setSelectedImage}
                       plantName={state.plantName}/>
      {selectedImage && (
        <Link to="/home">
          <div>
            <p style={{fontSize: '1.2rem'}}>Your picture was uploaded successfully</p>
            <img src={selectedImage} style={{width: 150, height: 150}} alt="Uploaded"/>
          </div>
        </Link>
      )}
    </div>
  );
}

export default ImageUploadPresenter;
