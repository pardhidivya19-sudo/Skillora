import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminEnquiries.css"; // ✅ CSS import

function AdminEnquiries() {

  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get("http://localhost:5000/api/provider/contact");
    setMessages(res.data);
  };

  // ✅ MARK AS RESOLVED
const markResolved = async (id) => {
  await axios.put(
    `http://localhost:5000/api/provider/contact/resolve/${id}`
  );

  fetchMessages();
};

// ✅ REPLY SEND
const sendReply = async (id) => {
  await axios.put(
    `http://localhost:5000/api/provider/contact/reply/${id}`,
    {
      reply: replyText[id]
    }
  );

  alert("Reply sent!");
  fetchMessages();
};

  return (
    <div className="enquiries-container">

      <h2 className="enquiries-title">Contact Enquiries</h2>

      <table className="enquiries-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Status</th>
            <th>Reply</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {messages.map((msg, index) => (

            <tr key={`${msg.contact_id}-${index}`}>

              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.subject}</td>

              <td className="message-cell">{msg.message}</td>

              {/* ✅ STATUS BADGE */}
              <td>
                <span className={`status ${msg.status}`}>
                  {msg.status}
                </span>
              </td>

              {/* ✅ REPLY INPUT */}
              <td>
                <input
                  className="reply-input"
                  type="text"
                  placeholder="Type reply..."
                  value={replyText[msg.contact_id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [msg.contact_id]: e.target.value
                    })
                  }
                />
              </td>

              {/* ✅ ACTION BUTTONS */}
              <td>

                <button
                  className="action-btn reply-btn"
                  onClick={() => sendReply(msg.contact_id)}
                >
                  Reply
                </button>

                <button
                  className="action-btn resolve-btn"
                  onClick={() => markResolved(msg.contact_id)}
                >
                  Resolve
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default AdminEnquiries;