import React,{useState,useEffect,useContext} from 'react'
import './conversation.css'
import {AuthContext} from "../../context/AuthContext";
import axios from 'axios';

export default function Conversation({convo}) {
    const PF = process.env.REACT_APP_PUBLIC_URL
    const [myUser,setUser]=useState(null);
    const {user:currentUser} = useContext(AuthContext);

    
    useEffect(() => {
        const friendId=convo.members.find((m)=>( m !== currentUser._id))
        const getUser = async ()=> {
            try {
                const res = await axios.get("/users?userId="+friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err)
            }
        };
        getUser();
    },[convo,currentUser]);

    

    return (
        <div className="conversation">
            <img className="conversationImg" src={ myUser?.profilePicture ? PF+myUser.profilePicture : PF + "person/noAvatar.png"} alt="" />
            <span className="conversationName">{myUser?.username}</span>

        </div>
    )
}
