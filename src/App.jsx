import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "./redux/chatSlice";

const ws = new WebSocket("https://chat-app-server-1-otol.onrender.com");

const App = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [message, setMessage] = useState("");

  useEffect(() => {
    ws.onmessage = (event) => {
      
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          dispatch(addMessage(reader.result)); 
        };
        reader.readAsText(event.data);
      } else {
       
        dispatch(addMessage(event.data));
      }
    };
  }, [dispatch]);

  const sendMessage = () => {
    if (message.trim()) {
      const userMessage = `You: ${message}`;
      ws.send(message); 
      dispatch(addMessage(userMessage));
      setMessage("");  
    }
  };
  return (
    <div className=" w-100 d-flex justify-content-center align-items-center vh-100">
      <div className="w-75 p-5 d-flex justify-content-center">
        <div className="text-center p-4 border rounded shadow bg-white" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-danger">Real-Time Chat</h2>
          <div className="border border-dark overflow-auto mb-3 p-2" style={{ height: "200px" }}>
            {messages.map((msg, index) => (
              <div key={index} className="text-start">{msg}</div>
            ))}
          </div>
          <div className="d-flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="form-control"
            />
            <button onClick={sendMessage} className="btn btn-primary ms-2">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default App;