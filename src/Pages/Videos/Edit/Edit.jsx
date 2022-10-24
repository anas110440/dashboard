import React, { useState,useEffect } from 'react'
import Dashboard from '../../Dashboard/Dashboard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { updateDoc, doc } from "firebase/firestore";
import { storage, db } from "../../../Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BookDataService from "./BookDataService";


const EditVideo = () => {
    const { id, cateid } = useParams();
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState("");
    const [img, setImg] = useState("");
    const [status, setStatus] = useState("");
    const [formData, setFormData] = useState({
    title: "",
    video: "",
    status: "" ,
    image: "" ,

  });

  console.log(formData)

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


  const handlePublish = (e) => {
    e.preventDefault();



    if(formData.video.name && formData.image.name ){

      const handleDelete = async () => {
        const storageRef = ref(storage, video);
        await deleteObject(storageRef);

        const storageRef2 = ref(storage, img);
        await deleteObject(storageRef2);
    }
    handleDelete()
    const storageRef = ref (storage, `/${cateid}/${Date.now()}${formData.video.name}`);

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
          status: "",

        });

      

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          let vidUrl = url;

          const storageRef = ref (storage, `/${cateid}/${Date.now()}${formData.image.name}`);

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
      
                const refrance = doc(db, "category", cateid, "videos", id );
                updateDoc(refrance, {
                    title: title || formData.title,
                    video:  vidUrl,
                    image: url,
                    status: formData.status === "true" ? true : false || status === "true" ? true : false,
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
        });
      }
    );
        }else if(formData.video.name){
          const handleDelete = async () => {
            const storageRef = ref(storage, video);
            await deleteObject(storageRef);
        }
        handleDelete()
        const storageRef = ref (storage, `/${cateid}/${Date.now()}${formData.video.name}`);

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
              status: "",
    
            });
    
          
    
            getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                    const refrance = doc(db, "category", cateid, "videos", id );
                    updateDoc(refrance, {
                        title: title || formData.title,
                        video:  url,
                        image: img,
                        status: formData.status === "true" ? true : false || status === "true" ? true : false,
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
        }else if(formData.image.name){
          const handleDelete = async () => {
            const storageRef = ref(storage, img);
            await deleteObject(storageRef);
        }
        handleDelete()
        const storageRef = ref (storage, `/${cateid}/${Date.now()}${formData.image.name}`);

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
              title: "",
              video: "",
              status: "",
    
            });
    
          
    
            getDownloadURL(uploadImage.snapshot.ref).then((url) => {
                    const refrance = doc(db, "category", cateid, "videos", id );
                    updateDoc(refrance, {
                        title: title || formData.title,
                        video:  video,
                        image: url,
                        status: formData.status === "true" ? true : false || status === "true" ? true : false,
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
              title:  title || formData.title ,
              video:  video,
              status: formData.status === "true" ? true : false || status === "true" ? true : false,
              image: img,

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
      setImg(docSnap.data().image);
      setStatus(docSnap.data().status);
      setFormData({
        title: docSnap.data().title,
        video: docSnap.data().video,
        status: docSnap.data().status,
        image : docSnap.data().image
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
               />
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
          
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select The Cover Image</Form.Label>
            <Form.Control type="file"
                     accept="image/*"
                     onChange={(e) => handleImageCov(e)}
                      
                       />
            </Form.Group>
            {progress === 0 ? null : (
                  <ProgressBar striped variant="success" now={progressImg} />

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
                Update
            </Button>
            <Link to={`/category/${id}`} className='w-25 btn btn-primary' >
                Back
            </Link>
        </Form>
     </div>
    </Dashboard>
  )
}

export default EditVideo