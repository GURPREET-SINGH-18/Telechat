import React from 'react';
import './message.css';
import {format} from 'timeago.js'

export default function Message({message, own }) {
    const PF = process.env.REACT_APP_PUBLIC_URL
    return (
        <div className={own ? "message own" : "message"}>
            <div className={own ? "messageTop own" : "messageTop"}>
                <img className="messageImg" src={PF + "person/noAvatar.png"} alt="" />
                <p className="messageText">
                    {message.text}
                    
                </p>
            </div>
            <div className={own ? "messageBottom own" : "messageBottom"}>
                        <span>
                            {format(message.createdAt)}
                        </span>
            </div>
        </div>
    )
}
