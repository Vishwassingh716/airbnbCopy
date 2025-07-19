import { createContext ,useState , useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom'
const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) =>{
    
    let [authToken,setAuthToken] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    let [user,setUser] = useState(() => localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken')) : null)
    const navigate = useNavigate()

    useEffect(() => {
        if (authToken) {
            const decoded = jwtDecode(authToken.access);
            if (decoded.exp * 1000 < Date.now()) {
                logoutUser();
            } else {
                setUser(decoded);
            }
        }
        
    }, [authToken]);
    
    let registerUser = async(e)=>{
        e.preventDefault()
        let response = await fetch('http://localhost:8000/api/register/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'email':e.target.email.value , 'password':e.target.password.value})
        })

        if(response.status === 201){
            navigate('/login')
            alert('your account is created')
        }

    }
    let loginUser = async (e)=>{
        e.preventDefault()
        let response = await fetch('http://localhost:8000/api/token/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'email':e.target.email.value , 'password':e.target.password.value})
        })

        let data = await response.json()
        console.log(data)
        console.log(response)
        if(response.status === 200){
            setAuthToken(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
            navigate('/')
        }
        else{
            alert('something gone wrong')
        }
        


    }

    let logoutUser = async (e) => {
        // e.preventDefault()
        if (e && e.preventDefault) e.preventDefault(); 
        localStorage.removeItem('authToken')
        setAuthToken(null)
        setUser(null)
        navigate('/login')
    }

    let contextData = {
        user:user,
        loginUser:loginUser,
        authToken:authToken,
        logoutUser:logoutUser,
        registerUser:registerUser
        

    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}