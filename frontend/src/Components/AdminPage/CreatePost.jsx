import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [image, setimage] = useState(null);
  const [message, setmessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price));
    try {
      if (!isNaN(price)) {
        const data = await axios.post(
          `${process.env.REACT_APP_API_URL}/createPost`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        if (data.data.error) {
          setmessage("There is an error");
        }
        if (!data.data.success) {
          setmessage("There is an error");
        } else {
          setmessage("Done");
        }
        settitle("");
        setdescription("");
        setprice("");
        setimage(null);
      } else {
        setmessage("The price should be number");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Your Post</h2>
        <span>Title</span>
        <input
          type="text"
          required
          name="title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <span>Description</span>
        <input
          type="text"
          required
          name="description"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
        />
        <span>Price</span>
        <input
          type="text"
          required
          name="price"
          value={price}
          onChange={(e) => setprice(e.target.value)}
        />
        <span>Upload Image</span>
        <input
          type="file"
          name="image"
          onChange={(e) => setimage(e.target.files[0])}
          required
        />
        <button type="submit">Submit</button>
        <p style={{ textAlign: "center", margin: "10px" }}>{message}</p>
      </form>
    </div>
  );
}

export default CreatePost;
