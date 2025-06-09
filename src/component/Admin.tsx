import { Avatar, Box, Button, Stack, Typography } from "@mui/material"
import { auth, db } from "../firebase/Fire_Base";
import { doc, getDoc } from "firebase/firestore";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
export const Admin = () => {
    const [name, setName] = useState<string>("");
    const navigate = useNavigate();
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
    return (
        
            <Stack direction="row" alignItems="center" spacing={0}>
                <Avatar />
                <Typography fontWeight="bold">{name}</Typography>
                <Button variant="outlined" size="small"  onClick={() => navigate("/login")}>Log out</Button>
            </Stack>
       
    );
}