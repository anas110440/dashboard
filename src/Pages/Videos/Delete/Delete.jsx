import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../../../Firebase/firebase";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

export default function Delete({ id ,cateid, image}) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, `category/${cateid}/videos/${id}`));
        const storageRef2 = ref(storage, image)
        await deleteObject(storageRef2);
        navigate("/category")
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <span className='btn btn-outline-danger float-end confirm' onClick={handleDelete} >
        Delete <i className='fas fa-trash'></i></span>
  );
}