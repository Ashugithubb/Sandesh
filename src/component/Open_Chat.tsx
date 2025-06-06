import { Avatar, Box, Divider, Stack, Typography } from "@mui/material"
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';
import image10 from "../assets/mainGirl.avif"
export const OpenChat = () => {
    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Stack direction={"row"}>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Avatar src={image10} sx={{ mb: 2, width: 56, height: 56 }} />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 15,
                                right: 5,
                                background: "green",
                                height: "10px",
                                width: "10px",
                                border: "2px solid #fff",
                                borderRadius: "50%",
                            }}
                        />
                    </Box>
                    <Stack direction={'column'}>
                        <Typography variant="h4" sx={{ marginLeft: '15px' }}>
                            Edison
                        </Typography>
                        <Typography sx={{ marginLeft: '15px' }}>
                            Active Now
                        </Typography>
                    </Stack>
                    <Box sx={{ display: "flex", justifyItems: "flex-end", ml: "auto", gap: "30px" }}>
                        <MinimizeIcon />
                        <CropSquareIcon />
                        <CloseIcon />
                    </Box>
                </Stack>
                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", gap: "30px" }}>
                    <CallIcon sx={{ color: "#982176E5" }} />
                    <VideoCallIcon sx={{ color: "#982176E5" }} />
                    <MoreVertIcon sx={{ color: "#982176E5" }} />
                </Box>
                <Divider sx={{ mt: 2, borderColor: "light-black" }} />
            </Box>


        </>
    )
}