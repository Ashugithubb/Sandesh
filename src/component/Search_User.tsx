import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
const SearchUser = () => {
    return (
        <>
            <Box display="flex" alignItems="flex-start"   >

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column", 
                        alignItems: "center",    
                        justifyContent: "flex-start", 
                        height: '10vh',
                        width: '100%',
                        backgroundColor: "#FDDFD680",
                    }}
                >
                    <TextField
                        label="search"
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
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column", 
                        alignItems: "center",    
                        justifyContent: "flex-start", 
                        height: '100vh',
                        width: '100%',
                        backgroundColor: "#FFFFFF"
                    }}></Box>
                </Box>

            </Box>
        </>
    )
}

export default SearchUser