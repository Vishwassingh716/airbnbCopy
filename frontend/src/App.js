import {BrowserRouter as Router , Route ,Routes} from 'react-router-dom'
import './App.css';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Header from './component/Header';
import PrivateBrowser from './utils/PrivateBrowser';
import PrivateBrowserLog from './utils/PrivateBrowserLog';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Yourmap from './component/Yourmap';
import CreateHostPage from './pages/CreateHostPage';
import HomeContext, { HomeProvider } from './context/HomeContext';
import PropertyPage from './pages/PropertyPage';
import ProfilePage from './pages/ProfilePage';
import { ProfileProvider } from './context/ProfileContext';
import { cyan } from '@mui/material/colors';


function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100%'}}>
        <div>
         <Router>
          
         <AuthProvider>
          <ProfileProvider>
         <HomeProvider>
         
          <Header/>
          
            <Routes>
            <Route  element={<PrivateBrowser path = '/'><Homepage /></PrivateBrowser>} path="/" exact/>
            
            <Route element={<PrivateBrowserLog path = '/'><LoginPage /></PrivateBrowserLog>} path="/login"/>
            <Route element = {<RegisterPage />} path = "/register"/>
            
            </Routes>
            
            <Routes>
            
            <Route element = {<CreateHostPage />} path = "/becomehost"/>
            <Route element = {<ProfilePage />} path = "/p"/>
            <Route element = {<PropertyPage />} path = "/property">
            <Route element = {<PropertyPage />} path = ":id"/></Route>
            
            
            </Routes>
            
            </HomeProvider>
            </ProfileProvider>
          </AuthProvider>
          
         </Router>
      
        </div>
       
    </div>
  );
}

export default App;
