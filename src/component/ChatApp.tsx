import { Stack } from '@mui/material';
import { User } from './User'
// import { Admin } from './Admin';
import { Chats } from './Chats';


export const ChatApp = () => {
    return (
        <>
        <Stack direction={"row"}>
        <Stack sx={{width:"45vh", height:"100vh"}}>
        
        <User/>
        </Stack>
        <Chats />
        </Stack>

        </>
    )
}