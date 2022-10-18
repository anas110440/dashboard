import React, {useState, useEffect} from 'react';
import './style.css'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword  } from "firebase/auth";

const Login = ({setHasAccount}) => {
    const [user, setUser] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passErr, setPassErr] = useState("")
    
    const auth = getAuth();
  
    const clearInputs = ()=>{
      setEmail("")
      setPass("")
    } 
    const clearErrors = ()=>{
      setEmailErr("")
      setPassErr("")
    } 
  
    const handleLogin = ()=>{
      clearErrors()
  
      signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
         // eslint-disable-next-line default-case
         switch (errorCode) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailErr(errorMessage);
            break;
          case "auth/wrong-password":
            setPassErr(errorMessage);
            break;
    };
    
          authListener()
    });
    }
    const authListener = ()=>{
        onAuthStateChanged(auth, (user) => {
          if(user){
          clearInputs()
          setUser(user);
          setHasAccount(true)
        }else{
          setUser("")
        }
      });
      };
    
      useEffect(() => {
          authListener();
          }, []);

  

  return (
    <>
    <section className='login'>
        <div className="loginContainer">
            <label htmlFor="email">Email</label>
            <input 
                type="email" 
                id="email"
                autoFocus
                required
                value={email}
                onChange={(e)=> setEmail(e.target.value)} />
            <p className="errorMsg">{emailErr}</p>

            <label htmlFor="Password">Password</label>
            <input 
                type="password" 
                id="Password"
                required
                value={pass}
                onChange={(e)=> setPass(e.target.value)} />
            <p className="errorMsg">{passErr}</p>

            <div className="btnContainer">
                    <button onClick={handleLogin}>Sign In</button>
                    <p></p>
                
            </div>
        </div>
    </section>
    </>
)
}

export default Login