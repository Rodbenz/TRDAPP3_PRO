import * as React from 'react';
import { useEffect, useState } from 'react'
import { Box, Button, CssBaseline, FormControl, Grid, IconButton, InputAdornment, Link, OutlinedInput, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Image from 'next/image'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // window.location.href = '/Home'
  })
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
  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleSubmit =  (event) => {
    event.preventDefault();

    // const remember = document.getElementById('remember');
    // var rememberme = 0;
    // console.log(event.currentTarget);
    var data = new FormData(event.currentTarget);
    // console.log({
    //   data: data,
    //   username: data.get('username'),
    //   password: data.get('password'),
    //   remember: rememberme
    // });
    // setCookie("username", data.get('username'), 0);
    // if (data.get('username') === 'admin' && data.get('password') === 'P@ssw0rd') {
    const getDistrict = async () => {
      const res = await fetch(process.env.REACT_APP_HOST_API + "/USER/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "USERNAME": data.get('username'),
          "PASSWORD": data.get('password')
        })
      });
      console.log(data.get('username'), data.get('password'));
      const response = await res.json();
      console.log(response.result)
      if (response.result[0] == undefined) {
        alert('Username or password invalid!')
      } else {
        window.sessionStorage.setItem("Luserid", response.result[0].USER_ID);
        window.sessionStorage.setItem("Lname", response.result[0].NAME);
        window.sessionStorage.setItem("Llastname", response.result[0].SURNAME);
        window.sessionStorage.setItem("Lorg", (response.result[0].DEPT1 == "1") ? 'เจ้าหน้าที่กรมธนารักษ์' : 'เจ้าหน้าที่กรมที่ดิน');
        window.location.href = "/Main";
      }
      // setDistrict(response);
    };
    getDistrict();

    // } else {
    //   // alert(document.cookie)
    //   alert("username or password is invalid!")
    // }
  };

  const handleLoin = async (el) => {
    let data = await el;
    console.log(data,'555555555');
  }

  const verifyToken = async (token, callback) => {
    let url = `${process.env.REACT_APP_HOST_VERIFYTOKEN}/jwt/verify_token`;
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
      "token": String(token)
    });

    let reqOptions = {
      url: url,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    }
    try {
      let response = await axios.request(reqOptions);
      // return response;
      callback(response.data)
    } catch (e) {
      console.log(e);
      callback(false);
    }
  }

  React.useEffect(() => {
    let verify_jwt = searchParams.get('token') !== "" ? verifyToken(searchParams.get('token'), handleLoin) : "";
  }, [searchParams])
  return (
    // <ThemeProvider theme={theme}>
    //   <Grid container component="main" sx={{
    //     backgroundImage: 'url(/Rectangle5038.png)',
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'bottom',
    //     height: '100vh',
    //     p: 3,
    //   }}>
    //     <CssBaseline />
    //     {/* <Grid
    //       item
    //       xs={false}
    //       sm={4}
    //       md={12}
    //       sx={{
    //         backgroundImage: 'url(/Rectangle5038.png)',
    //         backgroundRepeat: 'no-repeat',
    //         backgroundColor: (t) =>
    //           t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
    //         backgroundSize: 'cover',
    //         backgroundPosition: 'center',
    //       }}
    //     /> */}
    //     <img src={"/Exlorer_Illustration2.svg"} width={120} height={120} />
    //     <Grid item>
    //       <Typography component="h1" variant="h5">
    //         <Box
    //           sx={{
    //             my: 1,
    //             mx: 1,
    //             display: 'flex',
    //             flexDirection: 'column',
    //             alignItems: 'left',
    //             textAlign: 'left'
    //           }}
    //         >
    //           <Box sx={{ m: 0, p: 0, fontSize: "28pt", lineHeight: "32pt", color: "white", textShadow: "0 0 2px #000000" }}>
    //             บูรณาการทะเบียนทรัพย์สิน <br />(กรมธนารักษ์)
    //           </Box>
    //         </Box>
    //       </Typography>
    //     </Grid>
    //     <Grid item md={12} xs={12} sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //     }}>
    //       <Box component="form" noValidate onSubmit={handleSubmit} sx={{
    //         width: "400px",
    //         background: "rgba(255, 255, 255, 0.5)",
    //         boxShadow: " 0px 2px 2px rgba(0, 0, 0, 0.25)",
    //         borderRadius: "10px",
    //         py: 2,
    //         px: 5,
    //       }}>
    //         <Box sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //         }}>
    //           <img src={"/group1.svg"} width={100} height={100} />
    //           <FormControl variant="outlined" sx={{ m: 1, minWidth: '100%' }} >
    //             <OutlinedInput placeholder='Username' size="small"
    //               id="username" name="username"
    //               startAdornment={
    //                 <InputAdornment position="start">
    //                   <PersonIcon />
    //                 </InputAdornment>
    //               }
    //             />
    //           </FormControl>
    //           <FormControl sx={{ m: 1, minWidth: '100%' }} variant="outlined">
    //             <OutlinedInput placeholder='Password' size="small"
    //               id="password" name="password"
    //               startAdornment={
    //                 <InputAdornment position="start">
    //                   <LockIcon />
    //                 </InputAdornment>
    //               }
    //               type={values.showPassword ? 'text' : 'password'}
    //               value={values.password}
    //               onChange={handleChange('password')}
    //               endAdornment={
    //                 <InputAdornment position="end">
    //                   <IconButton
    //                     aria-label="toggle password visibility"
    //                     onClick={handleClickShowPassword}
    //                     onMouseDown={handleMouseDownPassword}
    //                     edge="end"
    //                   >
    //                     {values.showPassword ? <VisibilityOff /> : <Visibility />}
    //                   </IconButton>
    //                 </InputAdornment>
    //               }
    //             />
    //           </FormControl>
    //         </Box>
    //         <Box sx={{
    //           width: "100%",
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'right',
    //           textAlign: 'right',
    //         }}>
    //           <Link href="/Forgotpassword" variant="body2"
    //             sx={{ color: "#2F4266", fontSize: 14, textDecorationLine: "none", alignItems: "right !important" }}
    //           >
    //             ลืมรหัสผ่าน?
    //           </Link>
    //         </Box>
    //         <Box sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //         }}>
    //           <Button
    //             type="submit"
    //             variant="contained" color="primary"
    //             sx={{ px: 5, my: 1, backgroundColor: "#406BBC", fontSize: 20, }}
    //           >
    //             เข้าสู่ระบบ
    //           </Button>
    //         </Box>

    //         <Box sx={{
    //           width: '100%',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //           textAlign: 'center',
    //         }}>
    //           <Typography sx={{ color: "#2F4266", pr: 1, display: 'inline', }}>หรือต้องการ</Typography>
    //           <Link href="/Forgotpassword" variant="body2"
    //             sx={{ color: "#2F4266", fontSize: 16, textDecorationColor: "#2F4266", alignItems: "right !important" }}
    //           >
    //             ลงทะเบียน
    //           </Link>
    //         </Box>
    //       </Box>
    //     </Grid>
    //     <Grid item md={12} xs={12} sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //     }}>
    //       <Typography sx={{ mt: 2, textAlign: "center", color: "white", textShadow: "0 0 2px #000000" }}>
    //         สงวนลิขสิทธิ์ โดย กรมธนารักษ์  ซอยอารีย์สัมพันธ์ ถนนพระรามที่ 6 แขวงพญาไท เขตพญาไท กรุงเทพ 10400<br />
    //         Email: Webmaster@treasury.go.th โทร. 0-2273-0899 - 903
    //       </Typography>
    //     </Grid>
    //   </Grid>
    // </ThemeProvider>
    <></>
  )
}
