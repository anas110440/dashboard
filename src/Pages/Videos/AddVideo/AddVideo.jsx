import React, { useState, useEffect } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { collection,onSnapshot, orderBy, query, setDoc, doc as Docc  } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddVideo = () => {
  const [formData, setFormData] = useState({
    tittle: "",
    video: "",
    image: "",
    category: "",
    status: "",

  });
const navigate = useNavigate()

const [progress, setProgressImg] = useState(0);



const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};


const handleImageCov = (e) => {
  setFormData({ ...formData, image: e.target.files[0] });
};





// Publish =--------------------------------------------------------------------
  const handlePublish = (e) => {

    e.preventDefault();

    if (!formData.tittle || !formData.image || !formData.category ) {
      alert("Please fill all the fields");
      return;
    }

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
          tittle: "",
          video: "",
          category: "",
          status: "",

        });

      

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                const idDoc = Math.floor(100000 + Math.random() * 900000).toString();

                const refrance = collection(db, "category", formData.category, "/videos");
                setDoc(Docc(refrance, idDoc), {
                  id : idDoc,
                  tittle: formData.tittle,
                  video: formData.video,
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
        <h2 className='h1 text-center mb-4 mt-4'>Add New Video</h2>

        <Form className='d-block w-50 m-auto mb-4' onSubmit={handlePublish}>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>The Tittle</Form.Label>
            <Form.Control 
              type="text" 
              name="tittle"
              value={formData.tittle}
              onChange={(e) => handleChange(e)}
              required />
            </Form.Group>

    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Video URL</Form.Label>
            <Form.Control 
              type="url" 
              name="video"
              value={formData.video}
              onChange={(e) => handleChange(e)}
              required />
            </Form.Group>

         

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Cover Image</Form.Label>
            <Form.Control type="file"
                     accept="image/*"
                     onChange={(e) => handleImageCov(e)}
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
            
            <Button variant="success" type="submit" className='w-auto  float-end' >
                Add
            </Button>
            <Link to="/category" className='w-auto  btn btn-primary' >
                Back
            </Link>
        </Form>
     </div>
    </Dashboard>
  )
}

export default AddVideo