import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)


    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
        let getNotes = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/notes/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setNotes(data)
            }else if(response.statusText === 'Unauthorized'){
                logoutUser()
            }
            
        }

        getNotes()

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [])


    return (
        <div>
            <p>You are logged to the home page!</p>


            <ul>
                {notes.map(note => (
                    <li key={note.id} >{note.body}</li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage
