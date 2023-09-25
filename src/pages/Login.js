import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import mainLogo from '../../public/logo.svg'
// import '../../public/Login.css'

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user !== "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user !== "" && user != null) {
      setCookie("username", user, 0);
    }
  }
}
export default function LoginInSide() {
  if (getCookie('username') !== '') {
    // window.location.href = "/Home";
    if (false) {
      checkCookie()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const remember = document.getElementById('remember');
    var rememberme = 0;
    console.log(event.currentTarget);
    var data = new FormData(event.currentTarget);
    console.log({
      data: data,
      username: data.get('username'),
      password: data.get('password'),
      remember: rememberme
    });
    // setCookie("username", data.get('username'), 0);
    if (data.get('username') === 'admin' && data.get('password') === 'P@ssw0rd') {
      if (remember.checked) {
        setCookie("username", data.get('username'), 30);
      }
      window.location.href = "/Home";
    } else {
      alert(document.cookie)
      alert("username or password is invalid!")
    }
  };
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
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            mt: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Image src="https://www.treasury.go.th/web-assets/img/logo.png" style={{ width: 150, margin: 0, padding: 0 }} /> */}
          <img src={'/logo.svg'} style={{ width: "180px", height: "180px", filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" }} alt="" />
          <Typography component="h1" variant="h5">
            <Box
              sx={{
                my: 1,
                mx: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Box sx={{ m: 0, p: 0, fontSize: "16pt" }}>
                ระบบการประเมินราคาที่ดินสำหรับเอกสารสิทธิประเภท<br />
                อื่นนอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์
              </Box>
            </Box>
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, px: 8 }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              type="text"
              autoComplete="off"
              sx={{
                "& .MuiInputBase-root": { borderRadius: 50, pr: 4 },
                "& .MuiInputBase-input": { px: 6 },
                "& .MuiOutlinedInput-notchedOutline": { border: "2px solid #e4ab01 !important" },
                "& .MuiFormLabel-root": { pr: 1,pl: 4,color: "#e4ab01 !important",backgroundColor: 'white' },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline legend":{
                  pl: "24px !important",
                  maxWidth: "100% !important"
              }
              }}
            />
            <FormControl fullWidth sx={{ "& .MuiInputBase-root": { borderRadius: 50, pr: 4 }, "& .MuiInputBase-input": { px: 6 }, my: 2, "& .MuiOutlinedInput-notchedOutline": { border: "2px solid #e4ab01 !important" } ,
                "& .MuiFormLabel-root": { color: "#e4ab01 !important" }}} variant="outlined">
              <InputLabel sx={{ color: "#D7A203", px: 4, pr: 1, backgroundColor: 'white' }} htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton sx={{ color: "#D7A203" }}
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Grid container>
              <Grid item xs>
                <FormControlLabel sx={{ "& .MuiButtonBase-root": { color: "#D7A203 !important" } }}
                  control={<Checkbox id="remember" value="remember" sx={{ color: "#D7A203" }} icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} />}
                  label="จำไว้ในระบบ"
                />
              </Grid>
              <Grid item sx={{ textAlign: "right", mt: 1 }}>
                <Link href="/Forgotpassword" variant="body2" sx={{ color: "#D7A203", fontSize: 16, textDecorationLine: "none" }}>
                  ลืมรหัสผ่าน?
                </Link>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained" color="warning"
              sx={{ mt: 3, mb: 2, borderRadius: 50, height: 50, backgroundColor: "#D7A203", fontSize: 20, }}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}