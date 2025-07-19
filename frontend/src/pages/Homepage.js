import React,{useState , useEffect , useContext} from 'react'
import LoginPage from './LoginPage'
import AuthContext from '../context/AuthContext'
import Yourmap from '../component/Yourmap'
import AllHomes from '../component/AllHomes'
import { HomeProvider } from '../context/HomeContext'
const Homepage = () => {

  let {authToken}= useContext(AuthContext)
  let [home,setHome] = useState(null)


  return (
    <div>
      <HomeProvider>
      <AllHomes/>
      </HomeProvider>

    </div>
  )
}

export default Homepage
