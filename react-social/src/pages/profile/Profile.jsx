import React,{useState,useEffect} from 'react'
import Topbar from './../../components/topbar/Topbar';
import Sidebar from './../../components/sidebar/Sidebar';
import Feed from './../../components/feed/Feed';
import Rightbar from './../../components/rightbar/Rightbar';
import "./profile.css"
import axios from 'axios';
import { useParams } from 'react-router';

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_URL
    const [user,setUser] =useState({});
    const username = useParams().username;
    useEffect(() => {
        const fetchUser = async () =>{
            const res = await axios.get(`/users?username=${username}`)
            // console.log(res.data)
            setUser(res.data);
        }
        fetchUser();
    },[username])
    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture ? user.coverPicture : PF+"person/noCover.png"} alt="" className="profileCoverImg" />
                            <img src={user.profilePicture ? user.profilePicture : PF+"person/noAvatar.png"} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username}</h4>
                            <h4 className="profileInfoDesc">{user.desc}</h4>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username}/>
                        <Rightbar user={user} username={username}/>
                    </div>
                </div>
            </div>
        </>
    )
}
