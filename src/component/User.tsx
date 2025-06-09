import { useEffect, useState } from "react";
import { Avatar, Stack, Typography, Box } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { useAppDispatch } from "../redux/hook/hook";
import { setChat } from "../redux/slices/ChatSlice";

import { db, auth } from "../firebase/Fire_Base";
import image5 from "../assets/download.jpeg";

interface UserType {
  id: string;
  name: string;
  email: string;
}

export const User = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const dispatch = useAppDispatch();

  const currentUser = auth.currentUser ? auth.currentUser.uid : null;
  if (!currentUser) return null; 

  
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userChats", currentUser), async (res) => {
      const data = res.data();
      const items = data && data.chats ? data.chats : [];

      interface ChatItemType {
        receiverId: string;
        [key: string]: any;
      }

      const promises = items.map(async (item: ChatItemType) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser]);

  
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserType, "id">),
      }));

      const otherUsers = allUsers.filter((user) => user.id !== currentUser);
      setUsers(otherUsers);
    };

    fetchUsers();
  }, [currentUser]);

  // 💬 Handle chat click
  const handelChatClick = async (otherUserId: string) => {
    const chatId = [currentUser, otherUserId].sort().join("_");
    const chatDocRef = doc(db, "chats", chatId);

    try {
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        await setDoc(chatDocRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });

        await setDoc(
          doc(db, "userChats", currentUser),
          {
            chats: [
              ...(chats || []),
              {
                chatId,
                receiverId: otherUserId,
                lastmessage: "",
                updatedAt: serverTimestamp(),
              },
            ],
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "userChats", otherUserId),
          {
            chats: [
              {
                chatId,
                receiverId: currentUser,
                lastmessage: "",
                updatedAt: serverTimestamp(),
              },
            ],
          },
          { merge: true }
        );
      }

      // 🔁 Set active chat in Redux
      dispatch(setChat({ chatId, receiverId: otherUserId,open:true}));
      console.log("Chat ID:", chatId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box width="25%">
      {users.map((user) => (
        <Stack
          onClick={() => handelChatClick(user.id)}
          key={user.id}
          direction="row"
          alignItems="center"
          sx={{ backgroundColor: "#FDDFD633", p: 1, mb: 1, borderRadius: 1 }}
        >
          <Avatar  sx={{ width: 56, height: 56 }} />
          <Stack direction="column" sx={{ marginLeft: "12px" }}>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
};
