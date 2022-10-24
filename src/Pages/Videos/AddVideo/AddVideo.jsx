import React, { useState, useEffect } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { collection, addDoc,onSnapshot, orderBy, query } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    video: "",
    image: "",
    category: "",
    status: "",

  });
const navigate = useNavigate()

const [progress, setProgress] = useState(0);
const [progressImg, setProgressImg] = useState(0);



const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleImageChange = (e) => {
  setFormData({ ...formData, video: e.target.files[0] });
};

const handleImageCov = (e) => {
  setFormData({ ...formData, image: e.target.files[0] });
};





// Publish =--------------------------------------------------------------------
  const handlePublish = (e) => {

    e.preventDefault();

    if (!formData.title || !formData.video || !formData.category ) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref (storage, `/${formData.category}/${Date.now()}${formData.video.name}`);

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
          status: "",

        });

      

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          let vidUrl = url;

          const storageRef = ref (storage, `/${formData.category}/${Date.now()}${formData.image.name}`);

          const uploadImage = uploadBytesResumable(storageRef, formData.image);
      
          uploadImage.on(
            "state_changed",
            (snapshot) => {
              const progressPercent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgressImg(progressPercent);
            },
            (err) => {
              console.log(err);
            },
            () => {
              setFormData({
                title: "",
                video: "",
                category: "",
                status: "",
      
              });
      
            
      
              getDownloadURL(uploadImage.snapshot.ref).then((url) => {
      
                const refrance = collection(db, "category", formData.category, "/videos");
                addDoc(refrance, {
                  title: formData.title,
                  video: vidUrl,
                  image : url,
                  status: formData.status === "0" ? false : true, 
                })
                  .then(() => {
                    navigate(`/category`)
      
                  })
                  .catch((err) => {
                    console.log("Error adding Video", { type: "error" });
                    console.log(formData);
                  });
              });
            }
          );
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

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Cover Image</Form.Label>
            <Form.Control type="file"
                     accept="image/*"
                     onChange={(e) => handleImageCov(e)}
                      required />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progressImg} />

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

            <Form.Label>Status</Form.Label>
            <Form.Select aria-label="Default select example" className="mb-4"
              onChange={(e) => handleChange(e) }
              name="status"
              defaultValue={formData.status}
              required >
              <option value="" >Choose Status</option>
              <option value="1">Available</option>
              <option value="0">Not Available</option>
            </Form.Select>
            
            <Button variant="success" type="submit" className='w-25 float-end' >
                Add
            </Button>
            <Link to="/category" className='w-25 btn btn-primary' >
                Back
            </Link>
        </Form>
     </div>
    </Dashboard>
  )
}

export default AddVideo