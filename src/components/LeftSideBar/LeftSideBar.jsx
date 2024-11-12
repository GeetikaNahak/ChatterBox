import React, { useContext, useEffect, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users"); // Reference to 'users' collection
      const usersSnapshot = await getDocs(usersRef); // Get all documents from 'users'
      const usersList = usersSnapshot.docs.map((doc) => doc); // Extract data from each document
      setUsers(usersList); // Set the fetched users in state
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        // console.log(userRef);
        const q = query(userRef, where("name", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          querySnap.docs.map((doc) => {
            if (doc.data().id === querySnap.docs[0].data.id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Error while Searching");
    }
  };

  const addChat = async () => {
    const existingChat = chatData.find((chat) => chat.rId === user.id);

    if (existingChat) {
      toast.info("Chat with this user already exists.");
      return; // Exit if chat with user already exists
    }


    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
          // userData: user,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
          // userData: userData,
        }),
      });
      // console.log(chatData)
      // console.log(userData);
      console.log(chatData)
    } catch (error) {}
  };

  const setChat = async (item) => {
    // console.log(chatData[index]);
    // console.log(item);
    setChatUser(item);
    setMessagesId(item.messageId);
    // console.log(chatData)
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo1} className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} onClick={handleToggle} />
            {isVisible && (
              <div className="sub-menu">
                <p
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Edit profile
                </p>
                <hr />
                <p>Logout</p>
              </div>
            )}
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="search here ...(add Users)"
          /><i className="fa-solid fa-user-plus icon" ></i>
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} />
            <p>{user.name}</p>
          </div>
          
        ) : (
          chatData?.map((item, index) => (
            <div
              onClick={() => {
                setChat(item);
                addChat;
              }}
              key={index}
              className="friends"
            >
              <img src={item.userData.avatar || assets.arrow_icon} alt="" />
              <div>
                <p>{item.userData.name || "name"}</p>
                <span>{item.lastMessage || "message"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
