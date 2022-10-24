import React from 'react'
import "./style.css"
import Navbar1 from './../../Components/Navbar/Navbar1';
import {  db } from "../../Firebase/firebase";
import "./style.css"

import { collection,  getDocs, query } from 'firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'

const Dashboard = ({setHasAccount, children}) => {
  const [workData, setWorkData] = useState([])
  const [cat, setCat] = useState([])

  useEffect(() => {

        const getData = async () => {
          const q = query(collection(db, 'category'))
          const snapshot = await getDocs(q)
          const data = snapshot.docs.map((doc)=>({
              ...doc.data(), id:doc.id
          }))
          setCat(data)
          data.map(async (elem)=>{
            const workQ = query(collection(db, `category/${elem.id}/videos`))
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
    <>
    <Navbar1 setHasAccount={setHasAccount} />
    {children}

    </>
    )
}

export default Dashboard;