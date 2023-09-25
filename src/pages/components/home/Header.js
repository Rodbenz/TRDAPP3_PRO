import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button, Divider } from "@mui/material";
// import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export default function Header() {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Kanit',
                'Roboto',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });
    const [profilePicture, setProfilePicture] = useState('/FemaleAvatar.png');
    const [profile, setProfile] = useState(false);
    const handleMoreProfile = () => {
        setProfile(!profile);
    }
    const profilestatus = {
        display: profile ? 'block' : 'none',
    }
    const gotoLogout = () => {
        window.location.href = '/Logout'
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{
                backgroundImage: 'url(/topH.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',  zIndex: 99
            }}>
                <Grid item md={4} xs={4} sx={{ px: 5,display: 'flex', alignItems: 'center' }}>
                    <img src={"/Exlorer_Illustration2.svg"} width={60} height={60} alt='' />
                    <Typography sx={{ pl: 1, fontWeight: 600, fontSize: { md: '12pt', xs: '6pt', color: '#D7A203', lineHeight: '16px' } }}>
                        กรมธนารักษ์ <br /> THE TREASURY DEPARTMENT
                    </Typography>
                </Grid>
                <Grid item md={5} xs={5} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* <img src={"/Exlorer_Illustration2.svg"} width={60} height={60} alt='' /> */}
                    <Typography sx={{ pl: 3, fontWeight: 600, fontSize: { md: '12pt', xs: '6pt', textAlign: 'center', width: '100%', color: '#FFF' } }}>
                        ระบบการประเมินราคาที่ดินสำหรับเอกสารสิทธิประเภทอื่น <br /> นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)
                    </Typography>
                </Grid>
                <Grid item md={3} xs={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'right', width: '100%' }}>
                    <Typography sx={{ fontSize: '10pt', mx: 1 ,color:'white'}}>
                        {window.sessionStorage.getItem("name")} {window.sessionStorage.getItem("lastname")}<br />{window.sessionStorage.getItem("org")}
                    </Typography>
                    <Stack direction="row" spacing={2} xs={{ my: 2, }}>
                        {/* <Avatar alt="Remy Sharp" src={profilePicture} onClick={handleMoreProfile} /> */}
                        <Avatar alt="Remy Sharp" src={profilePicture} />
                    </Stack>

                    <Button color="primary" sx={{ my: 0.7 }} onClick={gotoLogout} title={'ออกจากระบบ'}>
                        <img src={"/power1.png"} width={20} height={20} />
                        <Typography sx={{ fontSize: '10pt', display: 'inline', ml: 1 }}>
                            {/* ออกจากระบบ */}
                        </Typography>
                    </Button>
                </Grid>
                <Grid container sx={{ position: 'absolute', top: 50, right: 5, height: '200px', width: '200px', background: 'linear-gradient(0deg, #FFFFFF 70%, #C8EAD1 70%)', boxShadow: "0 0 2px #000000", textAlign: 'center' }} style={profilestatus}>
                    <Grid item md={12} xs={12}>
                        <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center', }}>
                            <Avatar alt="Remy Sharp" src={profilePicture} sx={{ border: '2px solid gray', width: '80px', height: '80px', mx: '60px', mt: 2.5 }} />
                        </Stack>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Typography sx={{ fontSize: '10pt', my: 1 }}>
                            {window.sessionStorage.getItem("name")} {window.sessionStorage.getItem("lastname")}<br />{window.sessionStorage.getItem("org")}
                        </Typography>
                        <Divider />
                        <Button sx={{ my: 0.7 }} onClick={gotoLogout}>
                            <img src={"/power1.png"} width={20} height={20} />
                            <Typography sx={{ fontSize: '10pt', display: 'inline', ml: 1 }}>
                                ออกจากระบบ
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid sx={{ display: 'flex', alignItems: 'center', minHeight: '6px', backgroundColor: '#0D7377' }}>

            </Grid>
        </ThemeProvider >
    )
}