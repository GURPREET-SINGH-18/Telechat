import React, { useState, useEffect,useContext } from 'react'
import "./rightbar.css"
// import Online from '../online/Online'
import axios from 'axios'
import { Link } from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function Rightbar({ user, username }) {
    const PF = process.env.REACT_APP_PUBLIC_URL

    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img src="/assets/gift.png" alt="" className="birthdayImg" />
                    <span className="birthdayText">
                        <b>Ammy virk</b> and <b>4 other friends</b> have their birthdays today.
                    </span>
                </div>
                <img className="rightbarAd" src="/assets/ad.png" alt="" />
                <h4 className="rightbarTitle">
                    Online Friends
                </h4>
                <ul className="rightbarFriendList">
                    {/* {Users.map(u=>(
                        <Online key={u.id} user={u} />
                    ))} */}
                </ul>
            </>
        )
    }
    const ProfileRightbar = () => {
        const [friends, setFriends] = useState([]);
        const {user:currentUser,dispatch} = useContext(AuthContext)
        const [followed, setFollowed] = useState(currentUser.following.includes(user?._id));
        console.log(user?._id)

        useEffect(() => {
            const getFriends = async () => {
                try {
                    const friendList = await axios.get("/users/friends/" + username)
                    setFriends(friendList.data);
                } catch (err) {
                    console.log(err);
                }
            }
            getFriends();
        }, [])

        const handleClick = async () => {
            console.log("user "+ (username !== currentUser.username));
            console.log(username);
            console.log(currentUser.username)
            console.log(followed)
            try {
                if(followed){
                    await axios.put(`/users/${user._id}/unfollow`,{userId:currentUser._id});
                    dispatch({type:"UNFOLLOW",payload:user._id})
                }
                else {
                    await axios.put(`/users/${user._id}/follow`,{userId:currentUser._id});
                    dispatch({type:"FOLLOW",payload:user._id})
                }
                setFollowed(!followed);
                console.log(followed)
            } catch (err) {
                console.log(err);
            }
        }

        return (
            <>
                {username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <RemoveCircleOutlineIcon/> : <AddIcon/>}
                    </button>
                )}
                <h4 className="rightbarTitle">User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City: </span>
                        <span className="rightbarInfoValue">
                            {user.city}
                        </span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From: </span>
                        <span className="rightbarInfoValue">
                            {user.from}
                        </span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship: </span>
                        <span className="rightbarInfoValue">
                            {user.relationship === 1 ? 'Single' : user.relationship === 2 ? 'Married' : user.relationship === 3 ? "In Relationship" : "prefer not to say"}
                        </span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link to={"/profile/"+friend.username} style={{textDecoration:"none",color:"black"}}>
                        <div className="rightbarFollowing" key={friend._id}>
                            <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">
                                {friend.username}
                            </span>
                        </div>
                        </Link>
                    ))}

                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
