import React,{useState,useEffect,useContext} from 'react'
import "./chatOnline.css"
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";

export default function ChatOnline({onlineUsers,currentId,setCurrentChat}) {
    const PF = process.env.REACT_APP_PUBLIC_URL
    const [friends,setFriends]= useState([]);
    const [onlineFriends,setOnlineFriends]= useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/userId/"+currentId);
            setFriends(res.data);

        }
        getFriends();
    },[currentId]);

    useEffect(() =>{
        setOnlineFriends(friends.filter((f)=>onlineUsers?.includes(f._id)));
    },[friends,onlineUsers])

    const handleClick = async (o) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${o._id}`)
            setCurrentChat(res.data)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="chatOnline">
            {onlineFriends.map((o) =>( 

            
            <div className="chatOnlineFriend" key={o._id} onClick={()=>(handleClick(o))}>
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src={o?.profilePicture ? PF+o?.profilePicture : PF + "person/noAvatar.png"} alt="" />
                    <div className="chatOnlineBadge">
                    </div>
                </div>
                    <span className="chatOnlineName">
                        {o?.username}
                    </span>
            </div>
        ))}
        </div>
    )
}
