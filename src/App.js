import './App.css';
import Footer from '../src/components/Footer/Footer'
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Class from './components/Class/Class';
import { Route, Routes } from 'react-router-dom';
import Teacher from './components/Teacher/Teacher';
import ClassDetails from './components/ClassDetail/ClassDetail';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import TeacherManagement from './components/TeacherManagement/TeacherManagement';
import AddTeacher from './components/TeacherManagement/AddTeacher';
import UpdateTeacher from './components/TeacherManagement/UpdateTeacher';
import ClassManagement from './components/ClassManagement/ClassManagement';
import UpdateClass from './components/ClassManagement/UpdateClass';
import AddClass from './components/ClassManagement/AddClass';
import MembershipManagement from './components/MembershipManagement.js/MembershipManagement';
import UpdateMember from './components/MembershipManagement.js/UpdateMember';
import AddMember from './components/MembershipManagement.js/AddMember';
import BookingManagement from './components/BookingManagement/BookingManagement';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/class' element={<Class />}></Route>
          <Route path='/teacher' element={<Teacher />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/class/:id' element={<ClassDetails />}></Route>
          <Route path='/teachermanagement' element={<TeacherManagement />}></Route>
          <Route path='/mangagement/teacher/add' element={<AddTeacher />}></Route>
          <Route path='/mangagement/teacher/update/:id' element={<UpdateTeacher />}></Route>
          <Route path='/classmanagement' element={<ClassManagement />}></Route>
          <Route path='/mangagement/class/add' element={<AddClass />}></Route>
          <Route path='/mangagement/class/update/:id' element={<UpdateClass />}></Route>
          <Route path='/membershipmanagement' element={<MembershipManagement />}></Route>
          <Route path='/mangagement/member/add' element={<AddMember />}></Route>
          <Route path='/mangagement/member/update/:id' element={<UpdateMember />}></Route>
          <Route path='/bookingmanagement' element={<BookingManagement />}></Route>
        </Routes>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default App;
