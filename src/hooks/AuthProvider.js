import { useContext, createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import config from '../config';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || undefined);
  const navigate = useNavigate();
  
  const validateLogin = (username, password) => {
    if (!username || !password) {
        throw new Error('Fields can not be empty');
    }
  };

  const operation = async (operation, num1, num2) => {
    try {
      if (token) {
        const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/${operation}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ num1, num2 })
        });
        const res = await response.json();
        if (res.status === 401)
          logout();
        if (res.result) {
          return res.result;
        } else {
          throw new Error(res.error);
        }
      }
      throw new Error('Not valid token');
    } catch (error) {
      throw new Error(error);
    }
  };

  const login = async (username, password) => {
    try {
      validateLogin(username, password);
      const pass = password
      // Make API call to authenticate user
      const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, pass })
      });
      const res = await response.json();
      if (res.status === 401)
        logout();
      if (res.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
        const user = jwtDecode(res.token);
        setUser(user);
        navigate("/");
        return;
      }
      throw new Error(res.error);
    } catch (err) {
      throw new Error(err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getRecords = async (limit, offset, orderBy, order) => {
    try {
      const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/records/?limit=${limit}&offset=${offset}&orderBy=${orderBy}&order=${order}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const res = await response.json();
      if (res.status === 401)
        logout();
      if (res.result) {
        return res.result;
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const delRecords = async (ids) => {
    try {
      const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/records/delete`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids })
      });
      const res = await response.json();
      if (res.status === 401)
        logout();
      if (res.status === 200) {
        return res.status;
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const buyBalance = async (amount) => {
    try {
      const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/user/balance/buy`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const res = await response.json();
      if (res.status === 200) {
        return res.result;
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const generateStr = async (len) => {
    const apiUrl = `${config[process.env.NODE_ENV].apiUrl}/random-string`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ len })
    });
    const res = await response.json();
    if (res.status === 401)
      logout();
    if (res.result) {
      return res.result;
    } else {
      throw new Error(res.error);
    }
  };

  return (
    <AuthContext.Provider value={{
        token,
        user,
        login,
        logout,
        operation,
        getRecords,
        generateStr,
        delRecords,
        buyBalance
      }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};