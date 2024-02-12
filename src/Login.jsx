import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://api-chat-room.vercel.app";

const Login = ({ setActiveRoute, setLoginSuccess, setProfile }) => {
  const [loading, setLoading] = useState(false);
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInvalid, setLoginInvalid] = useState(false);
  const [users, setUsers] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    setActiveRoute("");
  }, [setActiveRoute]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API}/users`);
        setUsers(response.data);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showPassword = () => {
    setShowHidePassword(!showHidePassword);
  };

  const windowRegister = () => {
    history("/register");
  };

  const login = () => {
    const userOn = users.find(
      (user) => user.email === email && user.password === password
    );
    if (userOn) {
      setLoginSuccess(true);
      const id = userOn.id;
      const username = userOn.userName;
      const person = userOn.person;
      const list = {
        id,
        person,
        username,
      };
      setProfile(list);
      console.log("Username do usuário logado:", username);
      history("/profile");
    } else {
      setLoginInvalid(true);
    }
  };

  return (
    <div className="div-login">
      <label className="login-title">Insira suas credenciais</label>
      {loginInvalid && (
        <div className="invalid-login-message">
          E-mail e/ou senha inválidos. Por favor, tente novamente.
        </div>
      )}
      <div className="div-login-group">
        <label>Login:</label>
        <input placeholder="Seu e-mail" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="div-login-group">
        <label>Senha:</label>
        <input
          placeholder="Sua senha"
          onChange={(e) => setPassword(e.target.value)}
          type={showHidePassword ? "text" : "password"}
        />
        <span className="hide" onClick={showPassword}>
          {showHidePassword ? <BiShow className="icon-hide" /> : <BiHide className="icon-hide" />}
        </span>
      </div>
      <div className="div-btts">
        <button className="btt" onClick={windowRegister}>
          Cadastre-se aqui
        </button>
        <button className="btt-entry" onClick={login}>
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Login;