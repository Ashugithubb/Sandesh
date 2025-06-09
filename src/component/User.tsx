import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, Stack, Typography, Box, TextField } from "@mui/material";
import { Admin } from "./Admin"; // Adjust the path if needed

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
} from "firebase/firestore";

import { useAppDispatch } from "../redux/hook/hook";
import { setChat } from "../redux/slices/ChatSlice";
import { db, auth } from "../firebase/Fire_Base";

interface UserType {
  id: string;
  name: string;
  email: string;
}

export const User = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const currentUser = auth.currentUser ? auth.currentUser.uid : null;
  if (!currentUser) return null;

  // Realtime chat updates
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userChats", currentUser), async (res) => {
      const data = res.data();
      const items = data?.chats ?? [];

      const chatData = await Promise.all(
        items.map(async (item: any) => {
          const userDocSnap = await getDoc(doc(db, "users", item.receiverId));
          return { ...item, user: userDocSnap.data() };
        })
      );

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser]);

  // Paginated user fetch
  const fetchUsers = async () => {
    if (loadingUsers || !hasMore) return;

    setLoadingUsers(true);

    let userQuery = query(
      collection(db, "users"),
      orderBy("name"),
      limit(8)
    );

    if (lastVisible) {
      userQuery = query(
        collection(db, "users"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(8)
      );
    }

    const snapshot = await getDocs(userQuery);
    const fetchedUsers = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserType, "id">),
      }))
      .filter((user) => user.id !== currentUser);

    setUsers((prev) => [...prev, ...fetchedUsers]);

    if (snapshot.docs.length < 8) setHasMore(false);
    else setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  // Infinite scroll handler
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

  // Chat click handler
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

      dispatch(setChat({ chatId, receiverId: otherUserId, open: true }));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

 return (
  <Box
    sx={{
      width: "100%",
      height:"100vh",
      mx: "auto",
      mt: 2,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "#FFF8F6",
      overflow: "hidden",
    }}
  >
    {/* Admin Header */}
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

    {/* User List */}
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
        {filteredUsers.map((user) => (
          <Stack
            onClick={() => handelChatClick(user.id)}
            key={user.id}
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
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        ))}
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
