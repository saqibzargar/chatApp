import { useRef, useState } from "react";
import styles from "./MessageInput.module.css";

export default function MessageInput({ onSend}) {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleSend = () => {
  const hasText = text && text.trim().length > 0;
  const hasFile = file instanceof File;

  if (!hasText && !hasFile) return;
    onSend(text.trim(), file);
    setText("");
    setFile(null);

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    console.log("file is being slected triggred");
    setFile(e.target.files[0]);
  };

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {file && <div>{file?.name}</div>}
      <button className={styles.btn} onClick={handleAttach}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16.5 6.5v11a4.5 4.5 0 1 1-9 0v-13a3 3 0 1 1 6 0v12a1.5 1.5 0 1 1-3 0v-10" />
        </svg>

        <input
          ref={fileInputRef}
          type="file"
          accept=" image/*,.pdf, .doc, .docx,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </button>

      <button className={styles.btn} onClick={handleSend}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
