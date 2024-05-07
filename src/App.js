import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Calculator from './components/Calculator';
import AuthProvider from './hooks/AuthProvider';
import PrivateRoute from './hooks/PrivateRoute';
import Records from './components/Records';
import StringGenerator from './components/StringGenerator';
import Profile from './components/Profile';

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Calculator />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/calculator" element={<Calculator />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/operations" element={<Records />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/generator" element={<StringGenerator />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
