
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';

import './componets/style.css';
import { useState } from 'react';
import Profile from './Profile.jsx';
import Chat from './Chat.jsx';

function App() {
  const [activeRoute, setActiveRoute] = useState('');
  const [loginSuccess, setLoginSuccess]=useState(false);
  const [profile, setProfile]=useState(null);
  const [socket, setSocket]=useState(null);
  const [roomName, setRoomName]=useState('')
  const [descriptionRoom,setDescriptionRoom]=useState('')
  return (
    <div className={`App ${activeRoute}`} >
      <Router>
        <Routes>
          <Route path="/" element={<Login setActiveRoute={setActiveRoute} setLoginSuccess={setLoginSuccess} setProfile={setProfile}/>} />
          <Route path="/profile" element={loginSuccess?<Profile setActiveRoute={setActiveRoute} profile={profile} setSocket={setSocket} setRoomName={setRoomName} setDescriptionRoom={setDescriptionRoom}/>:<div className='warning-message'>Você não tem permissão para acessar essa página. Faça login com suas credenciais</div>}/>
          <Route path="/register" element={<Register setActiveRoute={setActiveRoute}/>} />  
          <Route path="/chat" element={<Chat setActiveRoute={setActiveRoute} socket={socket} roomName={roomName} descriptionRoom={descriptionRoom} profile={profile}/>} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
