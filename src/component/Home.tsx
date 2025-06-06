
import { Box, Stack } from '@mui/material';
import SearchUser from './Search_User'
import {User} from './User'
import { OpenChat } from './Open_Chat';
import { ChatBar } from './Chat_Bar';
export const ChatApp = () => {
    return (
        <>
            <>
                <Stack direction={'row'}>
            
                    <Stack direction={'column'} sx={{ width: "40%" }}>
                        <SearchUser />
                        <Stack spacing={4}>
                            <User />                
                        </Stack>
                    </Stack>
                    <OpenChat/>
                </Stack>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: "60%",
                        transform: "translateX(-50%)",
                        width: "fit-content",
                        zIndex: 10,
                        mb: 2 
                    }}
                >
                    <ChatBar />
                </Box>
            </>
        </>
    )
}