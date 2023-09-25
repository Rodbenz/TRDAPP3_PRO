import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
// import Image from 'next/image';
import { fontSize } from '@mui/system';

export default function Mainpage() {
    const listLink = { mt: 2, minHeight: '50px', ":hover": { backgroundColor: '#e0e0e0' } }
    const [jobTitle, setJobTitle] = useState('')
    const [username, setUsername] = useState('')
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
    useEffect(() => {
        if (window.sessionStorage.getItem("Luserid") == '' || window.sessionStorage.getItem("Luserid") == null) {
            window.location.href = '/Login';
        } else {
            setJobTitle(window.sessionStorage.getItem("Lorg"))
            setUsername(window.sessionStorage.getItem("Lname") + " " + window.sessionStorage.getItem("Llastname"))
            // var a = "?userid="+window.sessionStorage.getItem("Luserid")+"&name="+window.sessionStorage.getItem("Lname") +"&lastname="+window.sessionStorage.getItem("Llastname") +"&org="+window.sessionStorage.getItem("Lorg")
        }
        const showSlides = () => {
            var i = 0;
            const slidesImg = ['url(/downtown-business-district-bangkok-night.jpg)', 'url(/andreas-brucker-C2Dyr5FhGPQ-unsplash.jpg)', 'url(/yavor-punchev-yWbupRWe4C0-unsplash.jpg)'];
            const slides = document.getElementById('imagemain');
            console.log(slides.style);
            setInterval(() => {
                slides.style.backgroundImage = slidesImg[i];
                if (i == 2) {
                    i = 0;
                } else {
                    i++;
                }
            }, 5000);
        }
        showSlides();
    }, [])
    const logout = () => {
        window.location.href = '/Login';
    }
    
    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" id='imagemain' style={{
                backgroundImage: 'url(/downtown-business-district-bangkok-night.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '40vh',
                p: 3,
            }}>
                <Grid item >

                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                        <img src={"/Exlorer_Illustration2.svg"} width={120} height={120} />
                        <Typography sx={{ m: 0, p: 0, fontSize: { md: "28pt", xs: "26px" }, lineHeight: { md: "28pt", xs: "26px" }, color: "white", textShadow: "0 0 2px #000000" }}>
                            กรมธนารักษ์<br />THE TREASURY DEPARTMENT
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container sx={{
                backgroundColor: '#F6F6F6',
                py: 1,
                display: 'flex',
                minHeight: 'calc(60vh - 50px)',
                position: 'relative',
            }}>
                <Grid item md={3} xs={12} sx={{ textAlign: 'center' }}>

                </Grid>
                <Grid item md={6} xs={12} sx={{ textAlign: 'center', }}>
                    <Typography sx={{ color: '#CE8F00', fontSize: '16pt', fontWeight: 600 }}>
                        บูรณาการทะเบียนทรัพย์สิน (กรมธนารักษ์)
                    </Typography>
                </Grid>
                <Grid item md={3} xs={12} sx={{ textAlign: 'center' }}>
                    <Box sx={{ textAlign: 'right', pr: 3, color: '#406BBC' }}>
                        <Typography sx={{ fontSize: '12pt', }}>
                            ยินดีต้อนรับ, {username}
                        </Typography>
                        <Typography sx={{ fontSize: '10pt', }}>
                            ({jobTitle})
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={12} xs={12} sx={{ textAlign: 'center' }}>
                    <Box sx={{ textAlign: 'center', color: '#DD2025', fontWeight: 600, letterSpacing: -1 }}>
                        --------
                    </Box>
                </Grid>
                <Grid container sx={{ px: 8 }}>
                    <Grid item md={12} xs={12} sx={{ verticalAlign: 'center', width: '100%', textAlign: 'center' }}>
                        <Typography sx={{ color: 'gray', fontSize: '12pt' }}>
                            เลือกระบบ
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12} sx={listLink}>
                        <Link href={"/FirstProcess" + "?userid=" + window.sessionStorage.getItem("Luserid") + "&name=" + window.sessionStorage.getItem("Lname") + "&lastname=" + window.sessionStorage.getItem("Llastname") + "&org=" + window.sessionStorage.getItem("Lorg")}
                            sx={{ color: "#2F4266", fontSize: '12pt', textDecorationLine: "none", display: 'flex', alignItems: 'center', }}
                        >
                            <img src={"/social-media1.png"} width={50} height={50} />
                            <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2, }}>
                                ระบบเชื่อมโยงแลกเปลี่ยนข้อมูล
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item md={6} xs={12} sx={listLink}>
                        <Link href={"/FirstProcess" + "?userid=" + window.sessionStorage.getItem("Luserid") + "&name=" + window.sessionStorage.getItem("Lname") + "&lastname=" + window.sessionStorage.getItem("Llastname") + "&org=" + window.sessionStorage.getItem("Lorg")}
                            sx={{ color: "#2F4266", fontSize: '12pt', textDecorationLine: "none", display: 'flex', alignItems: 'center' }}
                        >
                            <img src={"/process1.png"} width={50} height={50} />
                            <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2 }}>
                                ระบบการประเมินราคาที่ดินสำหรับเอกสารสิทธิประเภทอื่น <br />นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item md={6} xs={12} sx={listLink}>
                        <Link href={"/FirstProcess" + "?userid=" + window.sessionStorage.getItem("Luserid") + "&name=" + window.sessionStorage.getItem("Lname") + "&lastname=" + window.sessionStorage.getItem("Llastname") + "&org=" + window.sessionStorage.getItem("Lorg")}
                            sx={{ color: "#2F4266", fontSize: '12pt', textDecorationLine: "none", display: 'flex', alignItems: 'center' }}
                        >
                            <img src={"/comparative1.png"} width={50} height={50} />
                            <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2 }}>
                                ระบบการประเมินราคาที่ดินที่ไม่ปรากฏในบัญชีราคาประเมินที่ดิน
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item md={6} xs={12} sx={listLink}>
                        <Link href={"/FirstProcess" + "?userid=" + window.sessionStorage.getItem("Luserid") + "&name=" + window.sessionStorage.getItem("Lname") + "&lastname=" + window.sessionStorage.getItem("Llastname") + "&org=" + window.sessionStorage.getItem("Lorg")}
                            sx={{ color: "#2F4266", fontSize: '12pt', textDecorationLine: "none", display: 'flex', alignItems: 'center' }}
                        >
                            <img src={"/machine-learning1.png"} width={50} height={50} />
                            <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2 }}>
                                ระบบการประเมินราคาทรัพย์สินด้วยการเรียนรู้ของเครื่อง<br />(Machine Learning)
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item md={6} xs={12} sx={listLink}>
                        <Link href={"/FirstProcess" + "?userid=" + window.sessionStorage.getItem("Luserid") + "&name=" + window.sessionStorage.getItem("Lname") + "&lastname=" + window.sessionStorage.getItem("Llastname") + "&org=" + window.sessionStorage.getItem("Lorg")}
                            sx={{ color: "#2F4266", fontSize: '12pt', textDecorationLine: "none", display: 'flex', alignItems: 'center' }}
                        >
                            <img src={"/report1.png"} width={50} height={50} />
                            <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2 }}>
                                รายงานสรุปงานด้านการประเมินราคาทรัพย์สิน
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
            </Grid >
            <Grid container sx={{ minHeight: '50px', backgroundColor: '#F6F6F6', }}>
                <Grid item md={2} xs={12}>
                    <Button onClick={logout}>
                        <img src={"/power1.png"} width={30} height={30} />
                        <Typography sx={{ fontSize: '12pt', display: 'inline', ml: 2 }}>
                            ออกจากระบบ
                        </Typography>
                    </Button>
                </Grid>
                <Grid item md={8} xs={12}>
                    <Typography sx={{ fontSize: '11pt', textAlign: 'center', width: '100%' }}>
                        สงวนลิขสิทธิ์ โดย กรมธนารักษ  ซอยอารีย์สัมพันธ์ ถนนพระรามที่ 6 แขวงพญาไท เขตพญาไท กรุงเทพ 10400<br />
                        Email: Webmaster@treasury.go.th โทร. 0-2273-0899 - 903
                    </Typography>
                </Grid>
                <Grid item md={2} xs={12}>

                </Grid>
            </Grid>
        </ThemeProvider >
    )
}