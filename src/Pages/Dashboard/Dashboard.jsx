import React from 'react'
import "./style.css"
import Navbar1 from './../../Components/Navbar/Navbar1';

const Dashboard = ({setHasAccount, children}) => {


  return (
    <>
    <Navbar1 setHasAccount={setHasAccount} />
    {children}
    </>
    )
}

export default Dashboard;