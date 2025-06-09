import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/Fire_Base";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const navigate = useNavigate();
   const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
       
        setSnackbarMessage("✅ You are logged in!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        navigate("/home");
    } catch (error: any) {
         console.log("sign hua?");
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
};

const handleLogin = async () => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
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
            <Stack direction={"row"}>
                <Typography>New User?</Typography>
                <Typography onClick={()=> navigate("/signup")}
                    sx={{ paddingLeft: "10px", cursor: "pointer", color: "blue" }}>
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
                    onClick={() => {
                        alert("Forgot Password clicked!");
                    }}
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

// ...existing code...
        
};
