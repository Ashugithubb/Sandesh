import AddIcon from '@mui/icons-material/Add';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Stack, TextField } from '@mui/material';
export const ChatBar = () => {
    return (
        <>
        <Stack direction={'row'} spacing={3}>
            <AddIcon sx={{color:"#982176E5"}} />
            <MicIcon sx={{color:"#982176E5"}} />

            <TextField
                label="Aa"
                variant="outlined"
                size="small"
                sx={{
                    marginTop: 2,
                    marginBottom: 2,
                    width: 290,
                    borderRadius: '100px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '100px',
                    }
                }}
            />
            <EmojiEmotionsIcon sx={{color:"#982176E5"}}/>
            <SendIcon sx={{color:"#982176E5"}}/>
                </Stack>
        </>
    )
}