import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hook/hook";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/Fire_Base";
import { doc, setDoc } from "firebase/firestore";
import { setUserId } from "../redux/slices/userSlice";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleGoogleLogin = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            dispatch(setUserId(res.user.uid));
            const onlineRef = doc(db, "isOnline", res.user.uid);
            await setDoc(onlineRef, {
                isOnline: true,
                isTyping: false,
            });
            setSnackbarMessage("✅ You are logged in!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            navigate("/home");
        } catch (error: any) {
            console.log(error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const onlineRef = doc(db, "isOnline", response.user.uid);
            dispatch(setUserId(response.user.uid));
            await setDoc(onlineRef, {
                isOnline: true,
                isTyping: false,
            });
            setSnackbarMessage("✅ Logged in with email!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            navigate("/home");
        } catch (error: any) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setSnackbarMessage("Please enter your email first.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSnackbarMessage("Password reset email sent!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
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
                <Stack direction={"row"}>
                    <Typography>New User?</Typography>
                    <Typography
                        onClick={() => navigate("/signup")}
                        sx={{ paddingLeft: "10px", cursor: "pointer", color: "blue" }}
                    >
                        Signup
                    </Typography>
                </Stack>

                <Button
                    onClick={handleGoogleLogin}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Continue with Google
                </Button>

                <Typography sx={{ textAlign: "center" }}>or</Typography>

                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                <Box component="form" noValidate autoComplete="off">
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
                    <Typography
                        sx={{ color: "blue", cursor: "pointer", fontSize: 14, mt: 1, mb: 2 }}
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleLogin}
                    >
                        Login
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