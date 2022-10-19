import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {  db } from "../../Firebase/firebase";
import "./style.css"
import Dashboard from './../Dashboard/Dashboard';
import {Link} from "react-router-dom"
import Delete from './Delete/Delete';
const Categories = () => {

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

    <section className="categories">
        <div className="container">
            <h3 className="h1 header text-center"> Manage Categories <i className="fab fa-delicious"></i></h3>

            <div className="row">
              <div className="col-sm-12">
              <div className="card text-white bg-dark mb-5">

              <div className="card-header border-primary">
										<i className="fas fa-folder-open"></i> Latest Categories
                                        <Link to="/category/add-category" className="btn btn-primary btn-sm float-end">Add Category <i className="fas fa-plus"></i></Link>

                                        <Link to="/category/video/add-video" className="btn btn-success btn-sm float-end me-2">Add Video <i className="fas fa-plus"></i></Link>
                                        </div>	

                     { category.map(({id, name,description,image,status}) => ( 

                       <div className="card-body " key={id}>
											<ul className="list-unstyled latest-categories">
												<div className="cate">
                          <div className="hidden-button">
                           
                           <Link to={`/category/edit/${id}`} className="btn btn-outline-success btn-sm">
                            Edit <i className='fas fa-edit'></i>
                           </Link>
                            <Delete id={id} imageUrl={image} />

                            </div>
                            <div className="row">
                              <div className="col-4 col-md-2">
                                <img src={image} alt="" />
                              </div>
                              <div className="col-md-10 col-8">

                            <h2><Link to={`/category/videos/${id}`}>{name}</Link></h2>
                            <div className="full-view">
                              <p>{description}</p>
                              {status=== true ?(
                                <span className="comment">Avilable</span>

                              ):(
                                <span className="visibility">Not Avilable</span>

                              )}
                              </div>
                            </div>
                              </div>
                              </div>
                              <hr className="hLine" />
								      </ul>
                  
                  </div>
                      ))}     



									</div>
              </div>
            </div>
        </div>
    </section>
    </Dashboard>
          
          
            )
}

export default Categories