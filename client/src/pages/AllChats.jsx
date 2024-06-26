import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalStyles.css';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../images/default_avatar.png';
import groupChatIcon from '../images/group_icon.png';
import '../styles/AllChats.css';

/**
 * Component that displays all the chats that the
 * user has after they log in with their credentials.
 */
const AllChats = ({listUpdate}) => {
  const [chats, setChats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);
  let [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails(); 
    console.log("UPDATING LIST DUE TO LIST UPDATE");
      // eslint-disable-next-line
  },[listUpdate]);

  // runs every time the component mounts (i.e., when the page refreshes)
  useEffect(() => {
    // ensures the chat is still selected after page refresh
    const storedSelectedChatId = sessionStorage.getItem('selectedChatId');
    if (storedSelectedChatId) {
      setSelectedChatId(storedSelectedChatId);
    }
    // eslint-disable-next-line
  }, [])
  

  /**
   * Fetches the details of the current user that is logged in
   * from the server.
   */
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PARLONS_URL}/user/details`, { withCredentials: true });
      console.log("User response: " + JSON.stringify(response, null, 2));
      setUserId(response.data.userId);
      fetchData(response.data.userId);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };
  
  /**
   * Fetches the list of contacts that includes all users that are registered 
   * in the website. Then, it fetches the list of chats that the current user 
   * has already initiated with other users.
   * @param {number} userId - The ID of the current user.
   */
  const fetchData = async (userId) => {
    try {
      const contactsResponse = await axios.get(`${process.env.REACT_APP_PARLONS_URL}/contacts/all?type=friends`, { withCredentials: true });
      const nonContactsResponse = await axios.get(`${process.env.REACT_APP_PARLONS_URL}/contacts/all?type=non-friends`, { withCredentials: true });
      const chatsResponse = await axios.get(`${process.env.REACT_APP_PARLONS_URL}/chats/${userId}`, { withCredentials: true });
      console.log("Contacts Response: ", JSON.stringify(contactsResponse, null, 2));
      console.log("Non-contacts Response: ", JSON.stringify(nonContactsResponse, null, 2));
      console.log("Chats Response: ", JSON.stringify(chatsResponse, null, 2));
      if (contactsResponse.data.users && chatsResponse.data.chats) {
        const updatedChats = await Promise.all(chatsResponse.data.chats.map(async (chat) => {
          if (chat.chat_type === 'one-on-one') {
            const otherUserId = chat.sender_id === userId ? chat.recipient_id : chat.sender_id;
            const contact = contactsResponse.data.users.find(user => user.user_id === otherUserId) ||
                            nonContactsResponse.data.users.find(user => user.user_id === otherUserId);
            return { ...chat, recipient_username: contact ? contact.username : 'Unknown' };
          } else if (chat.chat_type === 'group') {
            return { ...chat, recipient_username: chat.name };
          }
        }));
        setChats(updatedChats);
        setContacts(contactsResponse.data.users);
      }
    } catch (error) {
      console.error("Error: ", error.response?.data.message || error.message);
    }
  };
  
  /**
   * Whenever the user clicks on the checkbox, it shall
   * display a checkmark. If the user clicks on it again, then
   * it will remove the checkmark. 
   * @param {number} contactId - The ID of the contact that the user selects to start a new chat with.
   */
  const handleCheckboxChange = (contactId) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  /**
   * Creates a chat between two users (1-on-1 chat)
   * @param {string} chatName - not needed for one-on-one chats, so this is set to "one-on-one"
   * @param {number} userIds  - the ID of the users that are part of the chat
   * @returns the response from the API - successful insertion in the database or not.
   */
  const createOneOnOneChat = (chatName, userIds) => {
    const requestBody = {
      chatName,
      userIds
    };
  
    return axios.post(`${process.env.REACT_APP_PARLONS_URL}/oneOnOneChat/createOneOnOneChat`, requestBody, { withCredentials: true })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };
  
  /**
   * Creates a chat between more than two users (Group Chat)
   * @param {string} chatName - not needed for one-on-one chats, so this is set to "one-on-one"
   * @param {number} userIds  - the ID of the users that are part of the chat
   * @returns the response from the API - successful insertion in the database or not.
   */
  const createGroupChat = (chatName, userIds) => {
    const requestBody = {
      chatName,
      userIds
    };
  
    return axios.post(`${process.env.REACT_APP_PARLONS_URL}/groupChats/createGroupChat`, requestBody, { withCredentials: true })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          // If the status code is 409, it means the chat name already exists
          console.error("Error creating group chat: " + error.response.data.message);
          return Promise.reject(error.response.data.message);
        } else {
            console.error("An error occurred while creating the group chat.");
            return Promise.reject("An error occurred while creating the group chat.");
        }
      });
  };

  /**
   * Starts a chat with a new contact 
   * by redirecting the user to the appropriate endpoint.
   * @param {number} contactId - The ID of the contact that the user selects to start a new chat with.
   */
  const startChat = (contactId) => {
    setIsModalOpen(false);
    if (selectedContacts.length === 1) {
      // including the user who starts the one-on-one chat to add them as a participant
      selectedContacts = [...selectedContacts, userId];
      // Handle one-on-one chat initiation
      createOneOnOneChat("one-on-one", selectedContacts)
        .then(result => {
          setSelectedChatId(result.chatId);
          console.log("one-on-One chat created successfully with ID:", result.chatId);
          navigate(`/chatblock`, { state: { chatName: "one-on-one", chatId: result.chatId, 
                              contactId: selectedContacts[0], chatType: 'one-on-one', isNewChat: true }});
         })
        .catch(error => {
          console.error("Failed to create one-on-one chat:", error.response ? error.response.data.message : error.message);
        });
    } else if (selectedContacts.length > 1) {
      // Handle group chat initiation
      let chatName = prompt("Enter a name for the group chat: ");
      if (chatName === "") {
        alert("Chat name cannot be empty.");
        return;
      }
      if (!chatName) return; // User cancelled the prompt

      // Removing leading and trailing whitespace
      chatName = chatName.trim();

      // including the user who starts the one-on-one chat to add them as a participant
      selectedContacts = [...selectedContacts, userId];

      createGroupChat(chatName, selectedContacts)
      .then(data => {
        const { chatId } = data;
        setSelectedChatId(chatId);
        navigate(`/chatblock`, { state: { chatId, chatType: 'group', chatName, isNewChat: true }});
      })
      .catch(error => {
        alert("Failed to create group chat: " + error);
      });
    }
  }

  /**
   * Opens the modal to start a new chat.
   */
  const handleNewChat = () => {
    setIsModalOpen(true);
  }

  /**
   * Handles continuing an existing chat.
   * @param {Object} chat - The chat object that contains information 
   * about a chat.
   */
  const continueChat = (chat) => {
    sessionStorage.setItem('selectedChatId', chat.chat_id);
    setSelectedChatId(chat.chat_id);
    const contactId = chat.sender_id === userId ? chat.recipient_id : chat.sender_id;
    navigate(`/chatblock`, { state: { chatName: chat.name, chatType: chat.chat_type, chatId: chat.chat_id, contactId: contactId, isNewChat: true } });
  };

  /**
   * Component that allows the user to open 
   * a modal whenever they want to start a new
   * chat with another user.
   * @param {Object} props - Props contain isOpen, onClose, contacts, and startChat. 
   * isOpen - whether the modal is open or not.
   * onClose - disable the modal when it is closed.
   * contacts - list of users that are registered on the website.
   * startChat - function that allows the user to start a new chat with a contact. 
   */
  const ContactsModal = ({ isOpen, onClose, contacts }) => {
      if (!isOpen) return null;
      return (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            {contacts.length === 0 ? (
              <p>No Contacts to Display</p>
            ) : (
              <ul>
                {contacts.map(contact => (
                  <li key={contact.user_id} className="contact-item">
                    <div className="contact-name">{contact.username}</div>
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.user_id)}
                      onChange={() => handleCheckboxChange(contact.user_id)}
                    />
                  </li>
                ))}
              </ul>
            )}
            <button className="chatButton" onClick={startChat}>Start Chat</button>
          </div>
        </div>
      );
    };

    return (
      <div>
        <div className='header'>
          <h1>Your Chats</h1>
          <button class="chatButton" onClick={handleNewChat}>New Chat</button>
        </div>
        <ContactsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contacts={contacts}
          startChat={startChat}
        />
      <ul>
        {chats.map((chat, index) => {
          // debugging purposes 
          console.log("Contacts Response Output: " + JSON.stringify(contacts, null, 2));
          console.log("Chat Object Output: " + JSON.stringify(chat, null, 2));
          const userContact = contacts.find(contact => contact.user_id === (chat.sender_id === userId ? chat.recipient_id : chat.sender_id));
  
          const profilePictureURL = userContact?.picture && userContact.picture !== "/path/pic1" 
          ? `${process.env.REACT_APP_PARLONS_PROFILE_URL}/profileUploads/${userContact.picture}` 
          : defaultAvatar;

          const isSelected = Number(chat.chat_id) === Number(selectedChatId);
          return (
            // Making a selected chat stand out by making the box of the chat gray
            <li key={chat.chat_id} className={`chat-item ${isSelected ? 'selected-chat' : ''}`}>
              <img 
                src={chat.chat_type === 'group' ? groupChatIcon : profilePictureURL}
                alt="" 
                title={chat.chat_type === 'group' ? "Group Chat" : "Direct Chat"}
              />
              <span className="username" onClick={() => continueChat(chat)} style={{cursor: 'pointer'}}>
                {chat.recipient_username}
              </span>
            </li>
          );
        })}
      </ul>
  
      </div>
    );
}

export default AllChats;