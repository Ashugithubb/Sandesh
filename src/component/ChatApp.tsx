import { Box, Stack } from '@mui/material';
import SearchUser from './Search_User'
import { User } from './User'
import { Admin } from './Admin';
import { Chats } from './Chats';


export const ChatApp = () => {
    return (
        <>
        <Stack direction={"row"}>
        <Stack sx={{width:"45vh", height:"100vh"}}>
        <Admin/>
        <SearchUser/>
        <User/>
        </Stack>
        <Chats />
        </Stack>

        </>
    )
}