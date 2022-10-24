import React, { useState } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddCate = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: "",
  });
const navigate = useNavigate()
  const [progress, setProgress] = useState(0);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };


  const handlePublish = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.image || !formData.status) {
      alert("Please fill all the fields");
      return;
    }

    const storageRef = ref (storage, `/category/${Date.now()}${formData.image.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.image);

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
          name: "",
          description: "",
          image: "",
          status: "",
        });

      

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const refrance = collection(db, "category");
          addDoc(refrance, {
            name: formData.name,
            description: formData.description,
            image: url,
            status: formData.status === "0" ? false : true, 
          })
            .then(() => {
              navigate("/category")

            })
            .catch((err) => {
              console.log("Error adding article", { type: "error" });
            });
        });
      }
    );
  };



  return (
    <Dashboard>
     <div className="add-cate">
        <h2 className='h1 text-center mb-4 mt-4'>Add New Category</h2>

        <Form className='d-block w-50 m-auto' onSubmit={handlePublish}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>The Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Action"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text" 
              name="description"
              placeholder="Descripe Your Category"
              value={formData.description}
              onChange={(e) => handleChange(e)}
                required
               />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Cover Image</Form.Label>
            <Form.Control type="file"
                     accept="image/*"
                     onChange={(e) => handleImageChange(e)}
                      required />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progress} />

          )}

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

export default AddCate