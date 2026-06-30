import { useEffect, useRef } from "react";
import styles from "./MessageList.module.css";
import basePath from "../config.json";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return <div className={styles.empty}>No messages yet. Say hi!</div>;
  }

  return (
    <div className={styles.list}>
      {messages.map((msg) => {
        const senderId = msg.senderId?._id || msg.senderId;
        const isMine = senderId === currentUser._id;

        return (
          <div
            key={msg._id}
            className={`${styles.msgWrap} ${isMine ? styles.mine : styles.theirs}`}
          >
            <div
              className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}
            >
              {/* <p>{msg.text}</p> */}
              <div>
                {msg.text && <p>{msg.text}</p>}

                {msg.fileUrl && msg.type === "image" && (
                  <img src={`${basePath.baseUrl}${msg.fileUrl}`} width={200} />
                )}

                {msg.fileUrl && msg.type === "file" && (
                  <a href={`${basePath.baseUrl}${msg.fileUrl}`} target="_blank">
                    {msg.fileName}
                  </a>
                )}
              </div>
              <span className={styles.time}>{formatTime(msg.createdAt)}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
