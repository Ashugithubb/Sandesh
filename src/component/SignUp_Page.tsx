import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    // Stack,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/Fire_Base";

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const navigate = useNavigate();




    const handleSignup = async () => {
        try {
          const res =   await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login");
            setOpenSnackbar(true);
            await setDoc(doc(db, "users", res.user.uid), {
             id:res.user.uid,
             name,
             email,
             password
            });
             await setDoc(doc(db, "userChats", res.user.uid), {
             chats:[]
            });
            setSnackbarMessage("🎉 Account created successfully!");
            setSnackbarSeverity("success");
            setTimeout(() => {
            navigate("/login");
        }, 20000);
        } catch (error: any) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };
    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };


    // ...existing code...

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f6fa",
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, minWidth: 320 }}>




                <Typography variant="h5" align="center" gutterBottom>
                    Create A Account
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="Text"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleSignup}
                    >
                        SignUp
                    </Button>
                </Box>
            </Paper>

            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );


};
