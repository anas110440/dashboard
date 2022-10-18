import React, { useState, useEffect } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { collection, addDoc,onSnapshot, orderBy, query } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    video: "",
    category: "",
  });
const navigate = useNavigate()

const [progress, setProgress] = useState(0);
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleImageChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };


  const handlePublish = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.video || !formData.category ) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref (storage, `/category-video/${Date.now()}${formData.video.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.video);

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
          video: "",
          category: "",
        });

      

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const refrance = collection(db, "category", formData.category, "/videos");
          addDoc(refrance, {
            title: formData.title,
            video: url,
          })
            .then(() => {
              navigate(`/category`)

            })
            .catch((err) => {
              console.log("Error adding article", { type: "error" });
              console.log(formData);
            });
        });
      }
    );
  };

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const articleRef = collection(db, "category");
    const q = query(articleRef, orderBy("name", "desc"));
    onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategory(articles);
    });
  }, []);


  return (
    <Dashboard>
     <div className="add-cate">
        <h2 className='h1 text-center mb-4 mt-4'>Add New Vedio</h2>

        <Form className='d-block w-50 m-auto' onSubmit={handlePublish}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>The Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
              required />
            </Form.Group>

    

            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Video</Form.Label>
            <Form.Control type="file"
                     accept="video/mp4,video/x-m4v,video/*"
                     onChange={(e) => handleImageChange(e)}
                      required />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progress} />

          )}

            <Form.Label>Category</Form.Label>
            <Form.Select aria-label="Default select example" className="mb-4"
              onChange={(e) => handleChange(e) }
              name="category"
              defaultValue={formData.category}
              required >
                <option value="" >Choose Category</option>
              { category.map(({id, name,description,image,status}) => ( 
                <option value={id} key={id}>{name}</option>
              ))}              
            </Form.Select>

            <Button variant="primary" type="submit" >
                Add New
            </Button>
        </Form>
     </div>
    </Dashboard>
  )
}

export default AddVideo