import React, { useState,useEffect } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { updateDoc, doc } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BookDataService from "./BookDataService";


const EditVideo = () => {
    const { id, cateid } = useParams();
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState("");
    const [formData, setFormData] = useState({
    title: title,
    video: video,
  });


const navigate = useNavigate()
  const [progress, setProgress] = useState(0);


  const handleImageChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };


  const handlePublish = (e) => {
    e.preventDefault();



    if(formData.video.name){

        const handleDelete = async () => {
                const storageRef = ref(storage, video);
                await deleteObject(storageRef);
            }
            handleDelete()
        const storageRef = ref (storage, `/category-video/${Date.now()}${formData.video.name}`);
        const uploadImage = uploadBytesResumable(storageRef, formData.video );

        uploadImage.on(
          "state_changed",
          (snapshot) => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progressPercent);
          },
          (err) => {
            console.log(err);
          },
          () => {
            setFormData({
              title: "",
            });
            getDownloadURL(uploadImage.snapshot.ref).then((url) => {
              const refrance = doc(db, "category", cateid, "videos", id);
              updateDoc(refrance, {
                title: formData.title || title,
                video:  url,
              })
                .then(() => {
                  navigate(`/category/videos/${cateid}`)
        
                })
                .catch((err) => {
                  console.log("Error Edit Category", { type: "error" });
                });
            });
          }
        );
        }else{
            const refrance = doc(db, "category", cateid, "videos", id );
            updateDoc(refrance, {
                title: formData.title || title,
                video:  video,
              })
                .then(() => {
                  navigate(`/category/videos/${cateid}`)
        
                })
                .catch((err) => {
                  console.log("Error Edit Category", { type: "error" });
                });
        }
    }



      


  const editHandler = async () => {
   
    try {
      const docSnap = await BookDataService.getBook(id, cateid);
      setTitle(docSnap.data().title);
      setVideo(docSnap.data().video);
      setFormData({
        title: title,
        video: video,
      })
    } catch (err) {
      console.log({ error: true, msg: err.message });
    }
  };
  useEffect(() => {
    if (id !== undefined && id !== "") {
      editHandler();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);





  return (
    <Dashboard>
     <div className="add-cate">
        <h2 className='h1 text-center mb-4 mt-4'>Edit Video</h2>

        <Form className='d-block w-50 m-auto' onSubmit={handlePublish}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>The Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required />
            </Form.Group>

       

            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Vides </Form.Label>
            <Form.Control type="file"
                     accept="video/mp4,video/x-m4v,video/*"
                     onChange={(e) => handleImageChange(e)}
                       />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progress} />

          )}

       

            <Button variant="primary" type="submit" >
                Update
            </Button>
        </Form>
     </div>
    </Dashboard>
  )
}

export default EditVideo