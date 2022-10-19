import React from "react";
import {  db } from "../../Firebase/firebase";
import "./style.css"
import Dashboard from './../Dashboard/Dashboard';
import {Link} from "react-router-dom"
import { useParams } from "react-router-dom";
import Delete from './Delete/Delete'
import { collection,  getDocs, query } from 'firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'

const Videos = () => {
  const { id } = useParams();
  const [workData, setWorkData] = useState([])

  useEffect(() => {

        const getData = async () => {
          const q = query(collection(db, 'category'))
          const snapshot = await getDocs(q)
          const data = snapshot.docs.map((doc)=>({
              ...doc.data(), id:doc.id
          }))
          data.map(async (elem)=>{
            const workQ = query(collection(db, `category/${id}/videos`))
            const workDetails = await getDocs(workQ)
            const workInfo = workDetails.docs.map((doc)=>({
                ...doc.data(), id:doc.id
            }))
            setWorkData(workInfo);
          })
        }
        getData()

    
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  return (

    <Dashboard>
    <section className="videos">
      <div className="container">
          <h3 className="h1 header text-center"> Videos <i className="fas fa-video fa-1x"></i></h3>

          <div className="row">
            {
              workData.length !== 0 ? workData?.map((doc, key) => (
                <div className="col-12 col-md-4" key={key}>
                    <div className="card bg-dark">
                    <video src={doc.video} alt="" controls  />
                    <div className="card-body">
                    <h3 className="card-title">{doc.title}</h3>
                    
  
                    </div>
                    <div className="card-footer">
                    <Link to={`/category/video/edit/${doc.id}/${id}`} className="btn btn-outline-success">
                    Edit <i className='fas fa-edit'></i>
                    </Link>
                    <Delete id={doc.id} cateid={id} video={doc.video} />
  
                  </div>
                </div>
                </div>
                
  
              )) :(
                <div className="msg">
                  <h2 className="h1 text-center">
                    There Is No Videos In This Category
                  </h2>
                </div>
              )
            }

    </div>
  </div>

    </section>
    </Dashboard>
          
          
            )
}

export default Videos