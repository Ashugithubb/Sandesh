import { useEffect, useRef, useState } from "react";
import {
  Avatar, Box, Divider, IconButton, Paper, Stack, TextField, Typography
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useAppSelector } from "../redux/hook/hook";
import { auth, db } from "../firebase/Fire_Base";

interface MessageType {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: number;
  isSeen: boolean;
}

interface IOnline {
  isOnline: boolean;
  isTyping: boolean;
}

export const Chats = () => {
  const { chatId, open, receiverId } = useAppSelector((state) => state.chat);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string>("Unknown");
  const [isOnline, setIsOnline] = useState<IOnline>();
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user?.uid || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: MessageType[] = snapshot.docs.map((doc) => doc.data() as MessageType);
      setMessages(msgs);
    });

    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchReceiverName = async () => {
      if (!receiverId) return;
      try {
        const userRef = doc(db, "users", receiverId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReceiverName(userSnap.data().name || "Unknown");
        }
      } catch {
        setReceiverName("Error");
      }
    };
    fetchReceiverName();
  }, [receiverId]);

  useEffect(() => {
    if (!receiverId) return;
    const onlineRef = doc(db, "isOnline", receiverId);
    const unsub = onSnapshot(onlineRef, (doc) => {
      const data = doc.data() as IOnline;
      setIsOnline(data || undefined);
    });
    return () => unsub();
  }, [receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId || !currentUser || !receiverId) return;

    const message: MessageType = {
      senderId: currentUser,
      receiverId,
      text: newMessage,
      createdAt: Date.now(),
      isSeen: false,
    };

    const messagesRef = doc(
      db,
      "chats",
      chatId,
      "messages",
      `${Date.now()}_${currentUser}`
    );

    await setDoc(messagesRef, message);

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: message,
    });

    setNewMessage("");
  };

  const handleEmojiClick = (emojiData: any) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  if (!open) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Select any user to chat
        </Typography>
      </Box>
    );
  }

  return (
    <Stack direction="column" sx={{ height: "100vh", width: "85%" }}>
      {/* Top Bar */}
      <Box sx={{ width: "97%", p: 2 }}>
        <Stack direction="row" alignItems="center">
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar sx={{ width: 56, height: 56 }} />
            <Box
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                background: isOnline?.isOnline ? "green" : "gray",
                height: "10px",
                width: "10px",
                border: "2px solid #fff",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Stack direction="column" sx={{ ml: 2 }}>
            <Typography variant="h6">{receiverName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {isOnline?.isTyping
                ? "Typing..."
                : isOnline?.isOnline
                  ? "Online"
                  : "Offline"}
            </Typography>
          </Stack>
          <Box sx={{ display: "flex", ml: "auto", gap: 2 }}>
            <MinimizeIcon />
            <CropSquareIcon />
            <CloseIcon />
          </Box>
        </Stack>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 2 }}
        >
          <CallIcon sx={{ color: "#982176E5" }} />
          <VideoCallIcon sx={{ color: "#982176E5" }} />
          <MoreVertIcon sx={{ color: "#982176E5" }} />
        </Box>
        <Divider sx={{ mt: 2, borderColor: "lightgray" }} />
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1, width: "100%" }}>
        {messages.map((msg, index) => {
          const isSender = msg.senderId === currentUser;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

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
                  maxWidth: "80%",
                  bgcolor: isSender ? "#DCF8C6" : "#FFFFFF",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ wordBreak: "break-word" }}>{msg.text}</Typography>
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

      {/* Input Field */}
      <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #ccc", width: "100%", position: "relative" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (!currentUser) return;
            const onlineRef = doc(db, "isOnline", currentUser);
            setDoc(
              onlineRef,
              { isOnline: true, isTyping: true },
              { merge: true }
            );
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
              setDoc(onlineRef, {
                isOnline: true,
                isTyping: false,
              });
            }, 1500);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
        <IconButton onClick={() => setShowEmoji((prev) => !prev)}>
          <EmojiEmotionsIcon />
        </IconButton>
        {showEmoji && (
          <Box sx={{ position: "absolute", bottom: 60, right: 0, zIndex: 10 }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>
    </Stack>
  );
};
