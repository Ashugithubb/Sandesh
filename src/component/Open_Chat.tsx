import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../redux/hook/hook";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Fire_Base";

interface IOnline {
  isOnline: boolean;
  isTyping: boolean;
}

export const OpenChat = () => {
  const { chatId, receiverId } = useAppSelector((state) => state.chat);
  const [receiverName, setReceiverName] = useState<string>("");
  const [isOnline, setIsOnline] = useState<IOnline>();

  useEffect(() => {
    const fetchReceiverName = async () => {
      if (!receiverId) return;
      try {
        const userRef = doc(db, "users", receiverId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReceiverName(userSnap.data().name || "Unknown");
        } else {
          setReceiverName("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setReceiverName("Error");
      }
    };

    fetchReceiverName();
  }, [receiverId]);

  if (!chatId || !receiverId) return null;

  // Listen to the online status of the receiver, not the current user
  useEffect(() => {
    if (!receiverId) return;
    const onlineRef = doc(db, "isOnline", receiverId);
    const unsub = onSnapshot(onlineRef, (doc) => {
      const data = doc.data() as IOnline;
      if (data) {
        setIsOnline(data);
      } else {
        setIsOnline(undefined);
      }
    });
    return () => unsub();
  }, [receiverId]);

  return (
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
            {(() => {
              if (isOnline?.isTyping) {
                return "Typing...";
              } else if (isOnline?.isOnline) {
                return "Online";
              } else {
                return "offline";
              }
            })()}
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", ml: "auto", gap: 2 }}>
          <MinimizeIcon />
          <CropSquareIcon />
          <CloseIcon />
        </Box>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 2 }}>
        <CallIcon sx={{ color: "#982176E5" }} />
        <VideoCallIcon sx={{ color: "#982176E5" }} />
        <MoreVertIcon sx={{ color: "#982176E5" }} />
      </Box>

      <Divider sx={{ mt: 2, borderColor: "lightgray" }} />
    </Box>
  );
};