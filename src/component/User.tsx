import { Avatar, Stack, Typography, Box } from "@mui/material"

import image2 from '../assets/EekeTIHWkAEOSNO.jpg';
import image3 from '../assets/bea3491915571d34a026753f4a872000.jpg'
import image4 from '../assets/download (1).jpeg'
import image5 from '../assets/download (2).jpeg'
import image6 from '../assets/download.jpeg'
import image7 from '../assets/photo-1438761681033-6461ffad8d80.jpeg'
import image8 from '../assets/qc9kjus5fkt91.png'
import image9 from '../assets/young-man-sad-expression_1194-2826.avif'
export const User = () => {
  return (
    <>
      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image5} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Sam
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            How are you?
          </Typography>
        </Stack>
      </Stack>

      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image2} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Sameera
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginLeft: '12px' }}>
            <Typography sx={{ margin: 0 }}>
              What are u doing
            </Typography>
            <Box
              sx={{
                background: "#5297FF",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                marginLeft: "78px", 
              }}
            />
          </Box>
        </Stack>import image from '../assets/images.jpeg';
      </Stack>

      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image3} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Andrew
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            Meeting at 5:00pm
          </Typography>
        </Stack>
      </Stack>

      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image4} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Chrish!
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            fine
          </Typography>
        </Stack>
      </Stack>

      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image6} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Mahira
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            Come Fast
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image7} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Suuzy
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            Hero 😎
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image8} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Marry
          </Typography>
           <Box sx={{ display: "flex", alignItems: "center", marginLeft: '12px' }}>
            <Typography sx={{ margin: 0 }}>
              Love you Mom❤️ 
            </Typography>
            <Box
              sx={{
                background: "#5297FF",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                marginLeft: "78px", 
              }}
            />
          </Box>
        </Stack>
      </Stack>

      <Stack direction={'row'} sx={{ backgroundColor: "#FDDFD633" }}>
        <Avatar src={image9} sx={{ mb: 2, width: 56, height: 56 }} />
        <Stack direction={'column'}>
          <Typography variant="h6" component="h4" sx={{ marginLeft: '12px' }}>
            Johnthan
          </Typography>
          <Typography sx={{ marginLeft: '12px' }}>
            Cograts Sir🥳
          </Typography>
        </Stack>
      </Stack>





    </>
  )

}