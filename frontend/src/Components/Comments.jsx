import { useState, useEffect } from "react";
import axios from "axios";
function Comments() {
  const [comment, setcomment] = useState("");
  const [message, setmessage] = useState("");
  const [comments, setcomments] = useState([]);
  useEffect(() => {
    async function fetchComments() {
      try {
        const data = (await axios.get(`${process.env.REACT_APP_API_URL}/fetchComments`))
          .data;
        setcomments(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, [comment]);

  const fetch = comments.map((item) => {
    return (
      <div key={item.id} className = "comment-box">
        <h3>{item.full_name}</h3>
        <p>{item.message}</p>
      </div>
    );
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const data = await axios.post(
        `${process.env.REACT_APP_API_URL}/Comments`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!data.data.msg) {
        setmessage("Your Can Comment One Time Only!");
      } else {
        setmessage("Thank You For Your Comment");
      }
      setcomment("");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="Home-page">
      <h1>Comments Page</h1>
      <form onSubmit={handleSubmit}>
        <span>Enter Your Comment</span>
        <textarea
          name="comment"
          required
          value={comment}
          onChange={(e) => setcomment(e.target.value)}
        ></textarea>
        <p>{message}</p>
        <button>Send</button>
      </form>
      <div className  = "comm-container">{fetch}</div>
    </div>
  );
}

export default Comments;
