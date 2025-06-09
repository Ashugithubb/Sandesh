import { Avatar, Box, Button, Stack, Typography } from "@mui/material"
import { auth, db } from "../firebase/Fire_Base";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hook/hook";
export const Admin = () => {
    const [name, setName] = useState<string>("");
    const navigate = useNavigate();
    const currentUser = useAppSelector((state) => state.user?.userId);

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.name);
                } else {
                    setName("Unknown User");
                }
            }
        };
        fetchUserName();
    }, []);

    const handelLogOut = async () => {
        if (!currentUser) return;
        const onlineRef = doc(db, "isOnline", currentUser);
        await setDoc(onlineRef, {
            isOnline: false,
            isTyping: false,
        });
        navigate("/login");
    };

    return (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      px: 2,
      py: 1.5,
      backgroundColor: "#FFE5D9",
      borderRadius: 2,
      boxShadow: 2,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        sx={{ width: 48, height: 48, bgcolor: "#FF8C66" }}
      />
      <Typography variant="h6" fontWeight="bold" color="text.primary">
        {name}
      </Typography>
    </Stack>

    <Button
      variant="contained"
      size="small"
      color="error"
      sx={{ textTransform: "none", borderRadius: 2 }}
      onClick={handelLogOut}
    >
      Log out
    </Button>
  </Box>
);

};