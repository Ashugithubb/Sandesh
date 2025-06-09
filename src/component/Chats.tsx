import {
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { db, auth } from "../firebase/Fire_Base";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { OpenChat } from "./Open_Chat";

interface MessageType {
  senderId: string;
  text: string;
  createdAt: any;
}

export const Chats = () => {
  const { chatId, open } = useAppSelector((state) => state.chat);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ Set current user UID
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user?.uid || null);

    });
    return () => unsub();
  }, []);

  
  useEffect(() => {
    if (!chatId) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      }
    });

    return () => unsub();
  }, [chatId]);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId || !currentUser) return;

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentUser,
        text: newMessage,
        createdAt:   new Date(),
      }),
    });

    setNewMessage("");
  };

  if (!open) return <Typography>Select any user to chat</Typography>;

  return (
    <Stack direction="column" sx={{ height: "100vh", width:"65vh" }}>
      <OpenChat />

     
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1, width: "235%" }}>

        {messages.map((msg, index) => {
          const isSender = msg.senderId === currentUser;

   
          const time = msg.createdAt?.seconds
            ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Sending...";

          return (
            <Stack
              key={index}
              direction="row"
              justifyContent={isSender ? "flex-end" : "flex-start"}
              sx={{ mb: 1 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 1.5,
                  maxWidth: "100%",
                  bgcolor: isSender ? "#DCF8C6" : "#FFFFFF",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ wordBreak: "break-word" }}>
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    textAlign: isSender ? "right" : "left",
                    color: "gray",
                    fontSize: "0.75rem",
                  }}
                >
                  {time}
                </Typography>
              </Paper>
            </Stack>
          );
        })}
        <div ref={bottomRef} />
      </Box>

     
      <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #ccc", width:"200%" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
