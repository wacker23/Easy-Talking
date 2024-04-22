import React, { useState} from "react";

const SpeechToText = ({ onSpeechRecognition, language }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === "English" ? "en-US" : "ko-KR"; // Use the passed language prop
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSpeechRecognition(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.start();
  };

  return (
    <div>
      <div onClick={startListening} style={styles.icon}>
        {isListening ? "Listening..." : "🎙️"}
      </div>
    </div>
  );
};

const styles = {
  icon: {
    fontSize: "1.5em",
    cursor: "pointer",
  },
};

export default SpeechToText;
