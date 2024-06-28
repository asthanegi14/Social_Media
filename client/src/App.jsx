import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Posts from "./Components/Posts";
import Home from "./Components/Home";
import AddPost from './Components/AddPost';
import Navbarr from "./Components/Navbar";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <Router>
      <Navbarr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/updatepassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
