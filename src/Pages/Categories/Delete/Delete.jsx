import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db, storage } from "../../../Firebase/firebase";
import { deleteObject, ref } from "firebase/storage";

export default function Delete ( { id, imageUrl } ) {
  const handleDelete = async () => {
    if ( window.confirm( "Are you sure you want to delete this article?" ) ) {
      try {
        await deleteDoc( doc( db, "category", id ) );
        const storageRef = ref( storage, imageUrl  );
        await deleteObject( storageRef );

      } catch ( error ) {
        console.log( error );
      }
    }
  };
  return (
    <span className='btn btn-outline-danger btn-sm confirm' onClick={ handleDelete } >
      Delete <i className='fas fa-trash'></i></span>
  );
}