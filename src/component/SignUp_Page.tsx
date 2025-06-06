import { useState } from "react";
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
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/Fire_Base";

export const SignUp = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setOpenSnackbar(true); // Show success message
        } catch (error) {
            console.error(error);
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
        <>
            <Paper elevation={3} sx={{ padding: 4, minWidth: 320, marginLeft: "120%" }}>
                <Stack direction={"row"}>
                    <Typography>New User?</Typography>
                    <Typography
                        sx={{ paddingLeft: "10px", cursor: "pointer", color: "blue" }}
                    >
                        Signup
                    </Typography>
                </Stack>

                <Button
                    onClick={handleLogin}
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
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                    />
                    <Typography
                        sx={{ color: "blue", cursor: "pointer", fontSize: 14, mt: 1, mb: 2 }}
                        onClick={() => {
                            // Add your forgot password logic here, e.g., open a dialog or navigate
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
                    >
                        Login
                    </Button>
                </Box>
            </Paper>

            {/* ✅ Snackbar for success */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    ✅ Sign up Complete Now Login
                </Alert>
            </Snackbar>
        </>
    );
};
