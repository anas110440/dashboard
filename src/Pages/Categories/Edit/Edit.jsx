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
import { Link } from 'react-router-dom';


const Edit = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [img, setImg] = useState("");
    const [status, setStatus] = useState("");
    const [formData, setFormData] = useState({
    name: name,
    description: desc,
    image: img,
    status: status ,
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

    // if (!formData.name || !formData.description || !formData.status) {
    //   alert("Please fill all the fields");
    //   return;
    // }

    if(formData.image.name){

        const handleDelete = async () => {
                const storageRef = ref(storage, img);
                await deleteObject(storageRef);
            }
            handleDelete()
        const storageRef = ref (storage, `/category/${Date.now()}${formData.image.name}`);
        const uploadImage = uploadBytesResumable(storageRef, formData.image );

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
              const refrance = doc(db, "category", id);
              updateDoc(refrance, {
                name: formData.name || name,
                description: formData.description || desc,
                image:  url,
                status: formData.status === "true" ? true : false || status === "true" ? true : false,
              })
                .then(() => {
                  navigate(`/category/$`)
        
                })
                .catch((err) => {
                  console.log("Error Edit Category", { type: "error" });
                });
            });
          }
        );
        }else{
            const refrance = doc(db, "category", id);
            updateDoc(refrance, {
                name: formData.name || name,
                description: formData.description || desc,
                image:  img,
                status: formData.status === "true" ? true : false || status === "true" ? true : false,
              })
                .then(() => {
                  navigate("/category")
        
                })
                .catch((err) => {
                  console.log("Error Edit Category", { type: "error" });
                });
        }
    }



      


  const editHandler = async () => {
   
    try {
      const docSnap = await BookDataService.getBook(id);
      setName(docSnap.data().name);
      setDesc(docSnap.data().description);
      setImg(docSnap.data().image);
      setStatus(docSnap.data().status);
      setFormData({
        name: name,
        description: desc,
        image: img,
        status: status,
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
        <h2 className='h1 text-center mb-4 mt-4'>Edit Category</h2>

        <Form className='d-block w-50 m-auto' onSubmit={handlePublish}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>The Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Action"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text" 
              name="description"
              placeholder="Descripe Your Category"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
                required
               />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Cover Image</Form.Label>
            <Form.Control type="file"
                     accept="image/*"
                     onChange={(e) => handleImageChange(e)}
                       />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progress} />

          )}

            <Form.Label>Status</Form.Label>
            <Form.Select aria-label="Default select example" className="mb-4"
              onChange={(e) => handleChange(e) }
              name="status"
              defaultValue={status}
              required
               >
              <option value="" >Choose Status</option>
              <option value={true}>Available</option>
              <option value={false}>Not Available</option>
            </Form.Select>

            <Button variant="success" type="submit" className='w-25 float-end' >
                Edit
            </Button>
            <Link to="/category" className='w-25 btn btn-primary' >
                Back
            </Link>
        </Form>
     </div>
    </Dashboard>
  )
}

export default Edit