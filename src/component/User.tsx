import { useEffect, useState, useRef, useCallback } from "react";
import {
  Avatar,
  Stack,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  limit,
  startAfter,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/Fire_Base";
import { useAppDispatch } from "../redux/hook/hook";
import { setChat } from "../redux/slices/ChatSlice";
import { Admin } from "./Admin";

interface UserType {
  id: string;
  name: string;
  email: string;
}

const markAllMessagesAsSeen = async (chatId: string, currentUserId: string) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    where("receiverId", "==", currentUserId),
    where("isSeen", "==", false)
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    await updateDoc(docSnap.ref, { isSeen: true });
  });
};

export const User = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const currentUser = auth.currentUser?.uid;
  if (!currentUser) return null;

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser)
    );

    const unsubscribeChats = onSnapshot(q, async (snapshot) => {
      const unsubscribers: (() => void)[] = [];

      const chatDataPromises = snapshot.docs.map(async (docSnap) => {
        const chat = docSnap.data();
        const chatId = docSnap.id;
        const otherUserId = chat.users.find((id: string) => id !== currentUser);
        const userSnap = await getDoc(doc(db, "users", otherUserId));

        // ✅ Message listener — only count if currentUser is receiver
        const unsubscribeMessages = onSnapshot(
          collection(db, "chats", chatId, "messages"),
          (msgSnapshot) => {
            let unread = 0;
            msgSnapshot.docs.forEach((msg) => {
              const data = msg.data();
              if (data.receiverId === currentUser && !data.isSeen) {
                unread++;
              }
            });

            setChats((prev) => {
              const updated = prev.map((c) =>
                c.chatId === chatId
                  ? { ...c, unreadCount: unread }
                  : c
              );
              return updated;
            });
          }
        );

        unsubscribers.push(unsubscribeMessages);

        return {
          chatId,
          user: { id: userSnap.id, ...userSnap.data() },
          lastMessage: chat.lastMessage,
          unreadCount: 0,
        };
      });

      const chatData = await Promise.all(chatDataPromises);
      if (chatData.length) setChats(chatData);

      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    });

    return () => unsubscribeChats();
  }, [currentUser]);

  const fetchUsers = async () => {
    if (loadingUsers || !hasMore) return;
    setLoadingUsers(true);

    let q = query(collection(db, "users"), orderBy("name"), limit(8));
    if (lastVisible) {
      q = query(
        collection(db, "users"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(8)
      );
    }

    const snapshot = await getDocs(q);
    const fetched = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<UserType, "id">) }))
      .filter((u) => u.id !== currentUser);

    setUsers((prev) => [...prev, ...fetched]);
    if (snapshot.docs.length < 8) setHasMore(false);
    else setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleScroll = useCallback(() => {
    const ref = listRef.current;
    if (!ref || loadingUsers || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = ref;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchUsers();
    }
  }, [loadingUsers, hasMore]);

  useEffect(() => {
    const ref = listRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handelChatClick = async (otherUserId: string) => {
    const chatId = [currentUser, otherUserId].sort().join("_");
    const chatDocRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatDocRef);

    if (!chatSnap.exists()) {
      await setDoc(chatDocRef, {
        users: [currentUser, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: {
          text: "",
          senderId: "",
          receiverId: "",
          timestamp: serverTimestamp(),
          isSeen: true,
        },
      });
    } else {
      const chatData = chatSnap.data();
      const lastMsg = chatData?.lastMessage;

      if (lastMsg && lastMsg.receiverId === currentUser && !lastMsg.isSeen) {
        await updateDoc(chatDocRef, {
          "lastMessage.isSeen": true,
        });
        await markAllMessagesAsSeen(chatId, currentUser);
      }
    }

    dispatch(setChat({ chatId, receiverId: otherUserId, open: true }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        mx: "auto",
        mt: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#FFF8F6",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFC5B3",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Admin />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FDDFD680",
          p: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            width: "100%",
            borderRadius: "100px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "100px",
            },
          }}
        />

        <Box
          ref={listRef}
          width="100%"
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#FFFFFF",
            px: 2,
            borderRadius: 1,
          }}
        >
          {filteredUsers.map((user) => {
            const chat = chats.find((c) => c.user?.id === user.id);
            return (
              <Stack
                key={user.id}
                onClick={() => handelChatClick(user.id)}
                direction="row"
                alignItems="center"
                sx={{
                  backgroundColor: "#FDDFD633",
                  p: 1,
                  mb: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              >
                <Avatar sx={{ width: 56, height: 56 }} />
                <Stack direction="column" sx={{ ml: 2 }}>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {chat?.lastMessage?.text || "Start a conversation"}
                  </Typography>
                  {chat?.unreadCount > 0 && (
                    <Typography color="error" variant="caption">
                      • {chat.unreadCount} unread
                    </Typography>
                  )}
                </Stack>
              </Stack>
            );
          })}
          {loadingUsers && <Typography textAlign="center">Loading...</Typography>}
          {!hasMore && (
            <Typography textAlign="center" color="text.secondary" py={1}>
              No more users.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
