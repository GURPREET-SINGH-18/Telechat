import React from 'react'
import "./closeFriend.css"
import {Link} from "react-router-dom"

export default function CloseFriend({user}) {
    const PF = process.env.REACT_APP_PUBLIC_URL
    return (
        <Link to={`/profile/${user.username}`} style={{textDecoration:"none", color:"black"}}>
        <li className="sidebarFriend">
            <img src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" className="sidebarFriendImg" />
            <span className="sidebarFriendName">
                {user.username}
            </span>
        </li>
        </Link>
    )
}
