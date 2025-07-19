import { createContext ,useState , useEffect ,useContext } from "react";
import AuthContext from "./AuthContext";
const HomeContext = createContext()

export default HomeContext

export const HomeProvider = ({children}) =>{

    let {authToken , user} = useContext(AuthContext)
    const [homeData, setHomeData] = useState([]);

    const [bookingsData, setBookingsData] = useState([]);

    const [favhouseData , setFavHouse] = useState([]);

    useEffect(()=>{
        if(authToken){
            getHomeData();
            getFavHomeData();
            
        }

    },[])

    const getFavHomeData = async()=>{
        let response = await fetch(`http://localhost:8000/api/favhouse/${user.user_id}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)

            }
        })
        let data = await response.json()

        
        console.log(data)
        setFavHouse(data)
        


    }
    
    const getHomeData = async()=>{
        let response = await fetch('http://localhost:8000/api/homes/',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)

            }
        })
        let data = await response.json()
        setHomeData(data.features)
        
        console.log(data)
        console.log(homeData)
    }

    const getBookingsData = async(homeId)=>{
        let response = await fetch( `http://localhost:8000/api/gethomebookings/${homeId}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)

            }
        })
        let data = await response.json()
        // setBookingsData(data)
        // console.log("dekhhhh")
        // console.log(data)

        return(data);
        
    }
    const getUserBookingsData = async(homeId)=>{
        let response = await fetch( `http://localhost:8000/api/userbookings/${homeId}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)

            }
        })
        let data = await response.json()
        // setBookingsData(data)
        // console.log("dekhhhh")
        // console.log(data)

        return(data);
        
    }

    
    let contextData = {
        homeData: homeData,
        setHomeData: setHomeData,
        favhouseData:favhouseData,
        setFavHouse : setFavHouse,
        // bookingsData: bookingsData,
        // setBookingsData: setBookingsData,
        getFavHomeData:getFavHomeData,
        getBookingsData:getBookingsData,
        getUserBookingsData:getUserBookingsData,
    }
    return (
        <HomeContext.Provider value={contextData}>
            {children}
        </HomeContext.Provider>
    )
}