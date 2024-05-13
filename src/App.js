import React, { useState, useEffect, useRef } from "react";
import SpeechToText from "./stt.js"; // Import the SpeechToText component

const App = () => {
  const [language, setLanguage] = useState("English");
  const [chatMessages, setChatMessages] = useState([
    { text: "수화를 말자막", sender: "response" },
    // Existing chat messages
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [voices, setVoices] = useState([]);
  const videoRef = useRef(null); // Reference for the video element
  const [cameraOn, setCameraOn] = useState(false); // New state variable


  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => setVoices(speechSynthesis.getVoices());
    }
  }, []);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage(); // Send message when Enter key is pressed
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === "한국어") {
      utterance.lang = "ko-KR"; // Korean
      utterance.voice = voices.find(voice => voice.lang === "ko-KR");
    } else {
      utterance.lang = "en-US"; // English
      utterance.voice = voices.find(voice => voice.lang === "en-US");
    }
    speechSynthesis.speak(utterance);
  };

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = { text: messageInput, sender: "user" };
      setChatMessages([...chatMessages, newMessage]);

      // Add a response message here to simulate a response
      const responseMessage = { text: `${messageInput}`, sender: "response" };
      setChatMessages([...chatMessages, responseMessage]);

      // Speak the input text
      speakText(messageInput);

      setMessageInput(""); // Clear the input box after sending
    }
  };

  const handleCameraClick = async () => {
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        setCameraOn(true); // Set the state to indicate that the camera is on
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    } else {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraOn(false); // Set the state to indicate that the camera is off
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "English" ? "한국어" : "English");
  };

  const handleSpeechRecognition = (transcript) => {
    const newMessage = { text: transcript, sender: "user" };
    setChatMessages([...chatMessages, newMessage]);
  };

  return (
    <div>
      <div style={styles.pageContainer}>
        <h1 style={styles.header1}>Easy Talking</h1>
        <div style={styles.phoneContainer}>
          <div style={styles.header}>
          <div style={styles.icon} onClick={handleCameraClick}>📸</div>
            <div style={styles.languageToggle}>
              <span style={styles.languageLabel}>{language}</span>
              <label style={styles.switch}>
                <input type="checkbox" onChange={toggleLanguage} />
                <span style={styles.slider}></span>
              </label>
              <span style={styles.languageLabel}>
                {language === "English" ? "한국어" : "English"}
              </span>
            </div>
            <SpeechToText
              onSpeechRecognition={handleSpeechRecognition}
              language={language}
            />
          </div>
          <div style={styles.body}>
            <div style={styles.avatarContainer}>
            <video ref={videoRef} autoPlay style={{ width: "80%", height: "auto" }} />
            </div>
            <div style={styles.chatWindow}>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  style={
                    message.sender === "user"
                      ? styles.userBubble
                      : styles.responseBubble
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
          value={messageInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: 'lightblue',
  },
  header1: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: "10px",
  },
  phoneContainer: {
    fontFamily: "Arial, sans-serif",
    width: "1375px",
    height: "660px",
    margin: "auto",
    border: "1px solid #000",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  body: {
    display: "flex",
    flexGrow: 1,
  },
  avatarContainer: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderRight: "2px solid #ddd",
    backgroundColor: "#e9ecef",
  },
  avatar: {
    width: "80%",
    height: "auto",
    borderRadius: "50%",
  },
  chatWindow: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    height: '600px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#d1edc1",
    padding: "10px",
    borderRadius: "15px",
    maxWidth: "60%",
    margin: "5px",
    wordWrap: "break-word",
  },
  responseBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#bde0fe",
    padding: "10px",
    borderRadius: "15px",
    maxWidth: "60%",
    margin: "5px",
    wordWrap: "break-word",
  },
  languageToggle: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  icon: {
    fontSize: "1.5em",
  },
  languageLabel: {
    fontWeight: "bold",
  },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "25px",
    marginLeft: "10px",
    marginRight: "10px",
  },
  slider: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "25px",
    ":before": {
      position: "absolute",
      content: '""',
      height: "21px",
      width: "21px",
      left: "2px",
      bottom: "2px",
      backgroundColor: "white",
      transition: ".4s",
      borderRadius: "50%",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  },
  input: {
    flex: 1,
    borderRadius: "5px",
    border: "1px solid #ddd",
    padding: "10px",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#0d6efd",
    color: "#fff",import React, { useState, useEffect, useRef } from "react";
import SpeechToText from "./stt.js"; // Import the SpeechToText component
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { nextFrame } from "@tensorflow/tfjs";
import {drawRect} from "./utilities"; 

const App = () => {
  const [language, setLanguage] = useState("English");
  const [chatMessages, setChatMessages] = useState([
    { text: "수화를 말자막", sender: "response" },
    // Existing chat messages
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [voices, setVoices] = useState([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Reference for the video element
  const [cameraOn, setCameraOn] = useState(false); // New state variable
  const runCoco = async () => {
    const net = await tf.loadGraphModel('https://tensorflow-realtimemodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json')
    setInterval(() => {
      handleCameraClick(net);
    }, 16.7);
  };

  useEffect(() => {
    runCoco()
    setVoices(speechSynthesis.getVoices());
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => setVoices(speechSynthesis.getVoices());
    }
  }, []);

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage(); // Send message when Enter key is pressed
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === "한국어") {
      utterance.lang = "ko-KR"; // Korean
      utterance.voice = voices.find(voice => voice.lang === "ko-KR");
    } else {
      utterance.lang = "en-US"; // English
      utterance.voice = voices.find(voice => voice.lang === "en-US");
    }
    speechSynthesis.speak(utterance);
  };

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = { text: messageInput, sender: "user" };
      setChatMessages([...chatMessages, newMessage]);

      // Add a response message here to simulate a response
      const responseMessage = { text: `${messageInput}`, sender: "response" };
      setChatMessages([...chatMessages, responseMessage]);

      // Speak the input text
      speakText(messageInput);

      setMessageInput(""); // Clear the input box after sending
    }
  };

  const handleCameraClick = async (net) => {
    if (typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4 &&!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        webcamRef.current.srcObject = stream;
        setCameraOn(true); // Set the state to indicate that the camera is on

        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
  
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
  
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        const img = tf.browser.fromPixels(video)
        const resized = tf.image.resizeBilinear(img, [640,480])
        const casted = resized.cast('int32')
        const expanded = casted.expandDims(0)
        const obj = await net.executeAsync(expanded)
        console.log(obj)
  
        const boxes = await obj[1].array()
        const classes = await obj[2].array()
        const scores = await obj[4].array()
        
        const ctx = canvasRef.current.getContext("2d");
  
        requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx)}); 
  
        tf.dispose(img)
        tf.dispose(resized)
        tf.dispose(casted)
        tf.dispose(expanded)
        tf.dispose(obj)
        setCameraOn(true)
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    } else {
      if (webcamRef.current.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
        webcamRef.current.srcObject = null;
      }
      setCameraOn(false); // Set the state to indicate that the camera is off
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "English" ? "한국어" : "English");
  };

  const handleSpeechRecognition = (transcript) => {
    const newMessage = { text: transcript, sender: "user" };
    setChatMessages([...chatMessages, newMessage]);
  };

  return (
    <div>
      <div style={styles.pageContainer}>
        <h1 style={styles.header1}>Easy Talking</h1>
        <div style={styles.phoneContainer}>
          <div style={styles.header}>
          <div style={styles.icon} onClick={handleCameraClick}>📸</div>
            <div style={styles.languageToggle}>
              <span style={styles.languageLabel}>{language}</span>
              <label style={styles.switch}>
                <input type="checkbox" onChange={toggleLanguage} />
                <span style={styles.slider}></span>
              </label>
              <span style={styles.languageLabel}>
                {language === "English" ? "한국어" : "English"}
              </span>
            </div>
            <SpeechToText
              onSpeechRecognition={handleSpeechRecognition}
              language={language}
            />
          </div>
          <div style={styles.body}>
            <div style={styles.avatarContainer}>
              <div style={{ position: 'relative', width: '640px', height: '480px' }}>
              <Webcam ref={webcamRef} muted={true} 
                style={{
                  position: 'absolute',
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 8,
                  width: 640,
                  height: 480,
                }} 
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 8,
                  width: 640,
                  height: 480,
                }}
              />
              </div>
          </div>
            <div style={styles.chatWindow}>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  style={
                    message.sender === "user"
                      ? styles.userBubble
                      : styles.responseBubble
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
          value={messageInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: 'lightblue',
  },
  header1: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: "10px",
  },
  phoneContainer: {
    fontFamily: "Arial, sans-serif",
    width: "1375px",
    height: "660px",
    margin: "auto",
    border: "1px solid #000",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  body: {
    display: "flex",
    flexGrow: 1,
  },
  avatarContainer: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderRight: "2px solid #ddd",
    backgroundColor: "#e9ecef",
  },
  avatar: {
    width: "80%",
    height: "auto",
    borderRadius: "50%",
  },
  chatWindow: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    height: '600px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#d1edc1",
    padding: "10px",
    borderRadius: "15px",
    maxWidth: "60%",
    margin: "5px",
    wordWrap: "break-word",
  },
  responseBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#bde0fe",
    padding: "10px",
    borderRadius: "15px",
    maxWidth: "60%",
    margin: "5px",
    wordWrap: "break-word",
  },
  languageToggle: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  icon: {
    fontSize: "1.5em",
  },
  languageLabel: {
    fontWeight: "bold",
  },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "25px",
    marginLeft: "10px",
    marginRight: "10px",
  },
  slider: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: ".4s",
    borderRadius: "25px",
    ":before": {
      position: "absolute",
      content: '""',
      height: "21px",
      width: "21px",
      left: "2px",
      bottom: "2px",
      backgroundColor: "white",
      transition: ".4s",
      borderRadius: "50%",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f8f9fa",
  },
  input: {
    flex: 1,
    borderRadius: "5px",
    border: "1px solid #ddd",
    padding: "10px",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#0d6efd",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color .3s",
  },
};

export default App;

    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color .3s",
  },
};

export default App;
