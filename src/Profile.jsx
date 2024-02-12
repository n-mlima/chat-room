import { useEffect, useState } from "react";
import {CgProfile} from "react-icons/cg"
import {MdClose} from "react-icons/md"
import {BsTrash} from "react-icons/bs"
import { GoPasskeyFill } from "react-icons/go";
import { MdOutlineAddComment } from "react-icons/md";
import Modal from 'react-modal';
import io from 'socket.io-client'
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";


const API="http://localhost:3001"
const Profile=({setActiveRoute,profile,setSocket,setDescriptionRoom,setRoomName})=>{

    const appElement = document.getElementById('root');

    // Configure o elemento raiz para o React Modal
    Modal.setAppElement(appElement);
    


    const [room,setRoom]=useState([]);
    const [roomAtual,setRoomAtual]=useState("")
    const [author, setAuthor]=useState(profile.person)
    const [privacy, setPrivacy]=useState('Público')
    const [invite, setInvite]=useState('')
    const [confirmInvite, setComfirmInvite]=useState(false)
    const [inputInvite,setInputInvite]=useState("")
    const [codigoInvite, setCodigoInvite]=useState('')
    const [generateCode, setGenerateCode]=useState('')
    const [nameRoom,setNameRoom]=useState('')
    const [description,setDescription]=useState('')
    const [data, setData]=useState('')
    const [loading,setLoading]=useState(false);
    const [modalIsOpen, setModalIsOpen]=useState(false);
    const [notification,setNotification]=useState(false);
    const history=useNavigate();

    useEffect(()=>{
        setActiveRoute("profile-container")
    },[setActiveRoute]);

    useEffect(() => {
      // Define o timer para ocultar a notificação após 5 segundos
      const timer = setTimeout(() => {
          setNotification(false); // Limpa a notificação após 5 segundos
      }, 6000);

      
      return () => clearTimeout(timer);
    }, [notification]);

    useEffect(() => {
        const loadData = async () => {
          try {
            setLoading(true);
      
            const data = await fetch(API + "/room")
              .then((res) => res.json());
      
            setLoading(false);
            setRoom(data);

            
          } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            setLoading(false);
          }
        };
      
        loadData();
      },[]);

          
      
      function openModal(){
        setModalIsOpen(true)
      }

      function closeModal(){
        setModalIsOpen(false)
      }
      const joinRoom=async (roomName,codigo,descriptionRoom)=>{
        const socket = await io('http://localhost:3000');
        setCodigoInvite(codigo)

        if(codigo===""){
          setSocket(socket);
          socket.emit("set_user",profile.username)
          socket.emit('listRoom', room);
          socket.emit('joinRoom',roomName)
          setRoomName(roomName)
          setDescriptionRoom(descriptionRoom)
        
          history('/chat');

        }else{
          setComfirmInvite(true)

        }
        
      }
      const joinMyRoom=async (roomName)=>{
        const socket = await io('http://localhost:3000');
        setSocket(socket);
        socket.emit("set_user",profile.username)
        socket.emit('listRoom', room);
        socket.emit('joinRoom',roomName)
        setRoomName(roomName)
      
        history('/chat');
       
        
      }

      const validInvite= async(roomName)=>{
        const socket = await io('http://localhost:3000');
        if(inputInvite===codigoInvite){
          setSocket(socket);
          socket.emit("set_user",profile.username)
          socket.emit('listRoom', room);
          socket.emit('joinRoom',roomName)
          setRoomName(roomName)
          console.log("invite, sala"+roomName)
          history('/chat');
          setComfirmInvite(false)

        }else{
          console.log("Código inválido")
        }


      }

      const logout=()=>{
        history('/');
      }

      const addRoom= async(e)=>{
        e.preventDefault()

        let listRoom={
          id:'id-'+nameRoom,
          nameRoom,
          data,
          description,
          usuario:profile.username,
          author,
          privacy,
          invite
        }

        await fetch(API+"/room",{
          method:'POST',
          body:JSON.stringify(listRoom),
          headers:{
            "Content-Type":"application/json",
          },

        });
        clearInput()
        setNotification(true)
        setRoom((prevent)=>[...prevent,listRoom])
        setInvite("")

        
      }

      const handleDelete = async(id, ev)=>{
        ev.stopPropagation();

        await fetch(API+"/room/"+id, {
          method:"DELETE",
        })

        setRoom((prevent)=>(prevent.filter((item)=>item.id!==id)))


        
      }

      const clearInput=()=>{
        setNameRoom("")
        setDescription("")
      }

      const generateAccessCode=()=> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let accessCode = '';
    
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            accessCode += characters[randomIndex];
        }

        setInvite(accessCode)
        console.log(invite)
    }

      

    return(
        <>
            <Modal className={'modal'}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel='Adicionar Sala'
              >
                
                <span className="form-header">
                    <MdClose onClick={closeModal} className="close" />
                </span>
                <form className={"form"} onSubmit={addRoom}>
                  
                  <div className="div-form">
                    <h1>Crie uma sala de bate papo</h1>
                    {notification &&(<div className='success-message-bp'>Sala Criada com Sucesso!</div>)}
                    <div className="div-login-group">
                      <label htmlFor="nameRoom">Nome da sala:</label>
                      <input 
                      id="nameRoom"
                      placeholder="ex.:Trabalho"
                      onChange={(e)=>setNameRoom(e.target.value)}
                      value={nameRoom}
                      required
                      />
                    </div>
                    
                    <div className="div-login-group">
                      <label htmlFor="data">Criado em:</label>
                      <input 
                      id="data"
                      defaultValue={data}
                     />
                    </div>
                    
                    <div className="div-login-group">
                      <label htmlFor="description">Descrição:</label>
                      <input 
                      id="description"
                      placeholder="Descrição da sala"
                      onChange={(e)=>setDescription(e.target.value)}
                      value={description}
                      required
                      />
                    </div>
                    
                    <div className="div-login-group">
                      <label htmlFor="author">Criado por:</label>
                      <input 
                      id="author"
                      defaultValue={author}
                      disabled
                      />
                    </div>
                    
                    <div className="div-login-group-radio">
                      <label htmlFor="privacy">Privacidade:</label>
                      <input
                        type="radio"
                        name="privacy"
                        value="Público"
                        checked={privacy === 'Público'}
                        onChange={(e)=>{
                          setPrivacy(e.target.value)
                          setInvite("")
                        }}
                      />
                      <label>Público</label>
                      <input
                        type="radio"
                        name="privacy"
                        value="Privado"
                        
                        checked={privacy === 'Privado'}
                        onChange={(e)=>{
                          setPrivacy(e.target.value)
                          generateAccessCode();}}
                      />
                      <label>Privado</label>
                      
                    </div>
                    
                    <div className="div-login-group">
                      <label htmlFor="invite">Convite:</label>
                      <input 
                      id="invite"
                      defaultValue={invite}
                      disabled
                      />
                    </div>


                    <input className="inputSubmit" type="submit" value={"Criar"}></input>


                  </div>
                </form>
              
            </Modal>
            <div className="profile-container">
                <div className="container-cg">
                    <span>
                        <CgProfile className="cg-profile"/>
                        <h2 className="h2-profile">{profile.person}</h2>
                        <h2 className="h2-profile">Usuário:{profile.username}</h2>
                    </span>
                    <ul className="profile-ul">
                        <li onClick={openModal}><MdOutlineAddComment/> Criar uma sala</li>
                        <li><GoPasskeyFill/> Configurações de conta</li>
                    </ul>  
                <button className="logout-btt" onClick={logout}>Sair</button>
                </div>

                < div className="container-room">
                    <h1>Salas de bate papo disponíveis</h1>
                    <div className="subcontainer-room">
                    {confirmInvite &&(<div className="code-notification">
                          <MdClose onClick={()=>setComfirmInvite(false)} className="close-notification" />
                          <h2>Sala Privada</h2>
                          <label>Insira o código:</label>
                      <input type="text" value={inputInvite} onChange={(e)=>(setInputInvite(e.target.value))}/>
                      <button className="btt-privacy" onClick={()=>validInvite(roomAtual)}>Ok</button>
                    </div>)}
                      {room.length===0?<p>Não há salas disponíveis</p>:room.map((item,index)=>(
                        <div onClick={()=>{
                          joinRoom(item.nameRoom,item.invite,item.description)
                          setRoomAtual(item.nameRoom)
                        }} className="div-room" key={index}>

                          <div className="div-span">
                            <h3>{item.nameRoom}</h3>
                            <p>Criado por: {item.usuario}</p>
                            <p>Privacidade: {item.privacy}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="my-room">
                      <h1>Minhas salas de bate papo</h1>
                      <div className="subcontainer-room">
                      {room.length===0?<p>Não há salas disponíveis</p>:room.map((item,index)=>(

                        profile.person===item.author?

                        <div onClick={()=>joinMyRoom(item.nameRoom)} className="div-room" key={index}>

                          <div className="div-span">
                            <h3>{item.nameRoom}</h3>
          
                            <p>Privacidade: {item.privacy}</p>
                            <div>{item.privacy !=="" &&(<div>Código de Convite: {item.invite}</div>)}</div>
                            
                          </div>
                        <span className='icon'>
                            <BsTrash onClick={(event) =>handleDelete(item.id, event)} />
                          </span>
                          
                        </div>:""
                        
                      ))}

                    </div>
                      
                    </div>

                </div>

                
            </div>
        </>
        
    )
}

export default Profile;