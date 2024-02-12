import { useEffect, useRef, useState } from "react";
import {IoMdSend} from 'react-icons/io'



const Chat =({socket,roomName,descriptionRoom,profile, setActiveRoute})=>{
    const [message, setMessage]=useState("");
    const [messageList, setMessageList]=useState([]);
    const messagesEnd=useRef(null)
    
    useEffect(()=>{
        setActiveRoute("route-chat")
    },[setActiveRoute]);

    useEffect(()=>{
        messagesEnd.current.scrollIntoView({behavior:'smooth'})
    },[messageList]);

    useEffect(()=>{
        socket.on('receive_message', data=>{
            setMessageList((prevent)=>[...prevent,data])
        });

        return ()=>socket.off('receive_message');

    },[socket])

    const sendMessage=()=>{
        if(!message.trim()) return

        socket.emit('message', message,roomName)

        setMessage("")

    }
    const getEnterKey=(e)=>{
        if(e.key==='Enter'){
            sendMessage()
        }
    }

    

    /*
    return (
        <>
            <div className="div-chat">
                <h1>Chat</h1>
                {
                    messageList.map((message,index)=>(
                        message.room===roomName?
                        <span className="span-chat" key={index}>
                            {message.author}: {message.message}
                        </span>:""
                    ))
                }
                
                <input type="text" placeholder="Digite..." value={message} onChange={(e)=>setMessage(e.target.value)}/>
                <button onClick={()=>sendMessage()}>Enviar</button>
            </div>
        </>
    );*/
    return (
        <>
            <div className="telegram-chat">
            <h1>Sala - {roomName}</h1>
            <h2>{descriptionRoom}</h2>
            <hr></hr>
            
            <div className="message-container">
                {messageList.map((message, index) => (
                    <div className={`message ${message.author === profile.username ? 'sent' : 'received'}`} key={index}>
                        <div className="message-content">
                            <span className="author">{message.author}</span>
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEnd}/>
            </div>
            </div>
            <div className="input-container">
                <input className="input-chat" type="text" placeholder="Digite..." onKeyDown={(e)=>getEnterKey(e)} value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className='buttonSend' onClick={() => sendMessage()}><IoMdSend className="icon-chat"/></button>
            </div>   
        </>
    );
    

}

export default Chat;