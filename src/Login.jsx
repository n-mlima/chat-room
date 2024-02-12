import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {BiHide,BiShow} from 'react-icons/bi'


const API="http://localhost:3001"
const Login=({setActiveRoute,setLoginSuccess,setProfile})=>{
   

    useEffect(()=>{
        setActiveRoute("")
    },[setActiveRoute]);

    useEffect(() => {
        const loadData = async () => {
          try {
            setLoading(true);
      
            const data = await fetch(API + "/users")
              .then((res) => res.json());
      
            setLoading(false);
            setUsers(data);
          } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            setLoading(false);
          }
        };
      
        loadData();
      },);


    const [loading, setLoading]=useState(false)
    const [showHidePassword,setShowHidePassword]=useState(false)
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [loginInvalid,setLoginInvalid]=useState(false)
    const [users, setUsers]=useState([])
    const history=useNavigate();

   const showPassword= ()=>{
    setShowHidePassword(!showHidePassword)
   }
   function windowRegister(){
        history("/register");
   }

   const login=(email,password)=>{
        const userOn=users.find(user=>user.email===email&&user.password===password);
        if(userOn){
            setLoginSuccess(true);
            const id= userOn.id;
            const username = userOn.userName;
            const person =userOn.person;
            const list={
              id,
              person,
              username
            }
            setProfile(list);
            console.log("Username do usuário logado:", username);
            history("/profile");
            
        }else{
            setLoginInvalid(true);
        }


   }
    
    return (
        
            
        <div className="div-login">
            <label className="login-title">Insira suas credenciais</label>
            {loginInvalid && <div className="invalid-login-message">E-mail e/ou senha inválidos. Por favor, tente novamente.</div>}
            <div className="div-login-group">
                <label>Login:</label>
                <input placeholder='Seu e-mail' onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="div-login-group">
                <label>Senha:</label>
                <input placeholder='Sua senha' onChange={(e)=>setPassword(e.target.value)} type={showHidePassword?'text':'password'}/>
                <span className="hide" onClick={showPassword}>{showHidePassword?<BiShow className="icon-hide"/>:<BiHide  className="icon-hide"/>}</span>
            </div>
            <div className='div-btts'>
                <button className='btt' onClick={windowRegister}>Cadastre-se aqui</button>
                <button className='btt-entry' onClick={()=>login(email,password)}>Entrar</button>
            </div>
        </div>
            
        
    );
}

export default Login;


