import { createContext ,useState , useEffect ,useContext } from "react";
import AuthContext from "./AuthContext";


const ProfileContext = createContext()

export default ProfileContext

export const ProfileProvider = ({children}) =>{

    let {authToken} = useContext(AuthContext)
    const { user } = useContext(AuthContext);
    const [profilestate , setProfilestate] = useState([]);

    const [profilephotostate , setProfilephotostate] = useState([]);



    
    const getProfileData = async () => {
            let response = await fetch(`http://localhost:8000/api/profile/${user.user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)
            }
            });
            let data = await response.json();
            console.log(data)
            setProfilestate(data);
            console.log('uyuyuyy');
            console.log(user.user_id);
        };

    const getProfilephotoData = async () => {
            let response = await fetch(`http://localhost:8000/api/profileimages/${user.user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authToken.access)
            }
            });
            let data = await response.json();
            console.log(data)
            setProfilephotostate(data);
            console.log('lllllllll');
            console.log(user.user_id);
        };
    
        useEffect(() => {
            if(authToken){
                getProfileData();
                getProfilephotoData();
            }
        }, [user]);
    
    let contextData = {
        profilestate : profilestate,
        setProfilestate : setProfilestate,
        profilephotostate : profilephotostate,
        setProfilephotostate : setProfilephotostate
    }
    return (
        <ProfileContext.Provider value={contextData}>
            {children}
        </ProfileContext.Provider>
    )
}