import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import styles from "./Chat.module.css";

export default function Chat() {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api("/auth/getAllUsers").then((data) => {
      const others = data.filter((u) => u._id !== currentUser._id);
      setUsers(others);
    });
  }, []);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setConversation(null);

    const conv = await api("/chat/createConverstion", {
      method: "POST",
      body: JSON.stringify({
        senderId: currentUser._id,
        receiverId: user._id,
      }),
    });

    setConversation(conv);

    const msgs = await api(`/chat/getMessages/${conv._id}`);
    setMessages(Array.isArray(msgs) ? msgs : []);
  };

  const handleSend = async (text, attach) => {
    if (!conversation) return;

    const hasText = text && text.trim().length > 0;
    const hasFile = attach instanceof File;

    if (!hasText && !hasFile) return;

    const formData = new FormData();
    formData.append("file", attach);
    formData.append("conversationId", conversation._id);
    formData.append("senderId", currentUser._id);
    formData.append("text", text);

    const msg = await api("/chat/sendMessage", {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
      />

      <div className={styles.main}>
        {selectedUser ? (
          <>
            <div className={styles.header}>
              <div className={styles.avatar}>
                {selectedUser.username[0].toUpperCase()}
              </div>
              <div>
                <p className={styles.headerName}>{selectedUser.username}</p>
                <p className={styles.headerEmail}>{selectedUser.email}</p>
              </div>
            </div>

            <MessageList messages={messages} currentUser={currentUser} />
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>💬</span>
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
