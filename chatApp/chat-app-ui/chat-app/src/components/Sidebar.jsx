import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Sidebar.module.css";

export default function Sidebar({ users, selectedUser, onSelectUser }) {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className={styles.sidebar}>
      <div className={styles.head}>
        <div className={styles.me}>
          <div className={styles.avatar}>
            {currentUser.username[0].toUpperCase()}
          </div>
          <span className={styles.myName}>{currentUser.username}</span>
        </div>
        <button className={styles.logout} onClick={logout}>
          Sign out
        </button>
      </div>

      <div className={styles.label}>Messages</div>

      <div className={styles.list}>
        {users.length === 0 ? (
          <p className={styles.loading}>Loading users...</p>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className={`${styles.userItem} ${
                selectedUser?._id === u._id ? styles.active : ""
              }`}
              onClick={() => onSelectUser(u)}
            >
              <div className={styles.avatar}>{u.username[0].toUpperCase()}</div>
              <div className={styles.info}>
                <p className={styles.name}>{u.username}</p>
                <p className={styles.email}>{u.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
