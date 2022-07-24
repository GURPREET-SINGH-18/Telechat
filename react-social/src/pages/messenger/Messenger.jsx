import React, { useContext, useState, useEffect,useRef } from 'react';
import Topbar from './../../components/topbar/Topbar';
import './messenger.css';
import Conversation from './../../components/conversations/Conversation';
import Message from './../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import {io} from 'socket.io-client';

export default function Messenger() {
    const PF = process.env.REACT_APP_PUBLIC_URL
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const { user } = useContext(AuthContext);
    const [receiverUser, setReceiverUser] = useState({});
    const [newMessage,setNewMessage] = useState("");
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState(null);
    const socket = useRef();
    const scrollRef=useRef();

    useEffect(() => {
        socket.current=io("ws://127.0.0.1:8900")
        socket.current.on("getMessage",(data) => {
            setArrivalMessage({
                sender:data.senderId,
                text:data.text,
                createdAt:Date.now(),
            })
        })
    },[]);

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev)=>[...prev,arrivalMessage])
    },[arrivalMessage,currentChat]);

    useEffect(() => {
        socket.current.emit("addUser",user._id);
        socket.current.on("getUsers",(users)=>{
            setOnlineUsers(user.following.filter((f)=>users.some((u)=>u.userId===f)))
        })
    },[user])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations()
    }, [user]);

    useEffect(() => {
        const friendId=currentChat?.members.find((m)=>( m !== user._id))
        const getMessages = async () => {
            if(currentChat){
            try {
                const res = await axios.get("/messages/"+currentChat._id);
                setMessages(res.data);
                const result=await axios.get("users?userId="+friendId);
                setReceiverUser(result.data)
            } catch (err) {
                console.log(err)
            }
        }
        }
        getMessages();
    },[currentChat,user])

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const message = {
            "conversationId":currentChat._id,
            "sender":user._id,
            "text":newMessage
        };
        
        const receiverId = currentChat.members.find(member => member!== user._id)

        socket.current.emit("sendMessage",{
            senderId:user._id,
            receiverId,
            text:newMessage

        })

        try {
            const res = await axios.post("/messages",message);
            setMessages([...messages,res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages])

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for Friends" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)} key={c._id}>
                                <Conversation convo={c}  />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat
                                ?
                                (<>
                                    <div className="chatBoxNav">
                                        <div className="chatBoxNavWrapper">
                                            <img className="conversationImg" src={receiverUser.profilePicture ? PF+receiverUser.profilePicture : PF + "person/noAvatar.png"} alt="" />
                                            <span className="chatBoxNavWrapperName">{receiverUser?.username}</span>

                                        </div>
                                    </div>
                                    <div className="chatBoxTop">
                                        {messages.map((m)=>(
                                            <div ref={scrollRef} key={m._id}>
                                            <Message message={m} own={m.sender===user._id}/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea className="chatMessageInput" placeholder="Type a message"
                                        onChange={(e)=>setNewMessage(e.target.value)}
                                        value={newMessage}
                                        ></textarea>
                                        <button className="chatSubmitButton"
                                        onClick={handleSubmit}
                                        >Send</button>
                                    </div>
                                </>
                                )
                                :
                                (
                                    <div className="noConversation">
                                        <img className="noConversationImg" src={PF + "chat.gif"} alt="" />
                                        <span className="noConversationText">Open a conversation to start a chat</span>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline 
                        onlineUsers={onlineUsers}
                        currentId={user._id}
                        setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
