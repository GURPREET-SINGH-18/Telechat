import React,{useState,useContext,useEffect} from 'react'
import "./sidebar.css"
import FeedIcon from '@mui/icons-material/Feed';
import ChatIcon from '@mui/icons-material/Chat';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import { Users } from "../../dummyData"
import CloseFriend from '../closeFriend/CloseFriend';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

export default function Sidebar() {
  const [unknownUsers,setUnknownUsers]=useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("/users/allUsers");
        setUnknownUsers(res.data.filter((u)=>{return !user.following.includes(u._id)&&(u._id!==user._id)}))
      } catch (err) {
        console.log(err);
      }
    }
    getAllUsers();
  },[user])
  return (
    <div className="sidebar">
        <div className="sidebarWrapper">
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <FeedIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Feed
              </span>
            </li>
            <li className="sidebarListItem">
              <ChatIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Chats
              </span>
            </li>
            <li className="sidebarListItem">
              <VideoLibraryIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Videos
              </span>
            </li>
            <li className="sidebarListItem">
              <GroupsIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Groups
              </span>
            </li>
            <li className="sidebarListItem">
              <BookmarksIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Bookmarks
              </span>
            </li>
            <li className="sidebarListItem">
              <LiveHelpIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Questions
              </span>
            </li>
            <li className="sidebarListItem">
              <WorkIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Jobs
              </span>
            </li>
            <li className="sidebarListItem">
              <EventIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Events
              </span>
            </li>
            <li className="sidebarListItem">
              <SchoolIcon className="sidebarIcon"/>
              <span className="sidebarListItemText">
                Courses
              </span>
            </li>
          </ul>
          <button className="sidebarButton">Show More</button>
          <hr className="sidebarHr"/>
          <h5 className="sidebarUnknownFriends">Friend you may know</h5>
          <ul className="sidebarFriendList">
            {unknownUsers.map(u=>(
              <CloseFriend key={u._id} user={u}/>
            ))}
          </ul>
        </div>
    </div>
  )
}
