import { useState, useEffect, useMemo } from "react"
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Chip,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import PersonIcon from "@mui/icons-material/Person"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import HeightIcon from "@mui/icons-material/Height"
import ScaleIcon from "@mui/icons-material/Scale"
import FlagIcon from "@mui/icons-material/Flag"
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import UserDetails from "./components/UserDetails"
import AIChat from "./components/AIChat"

const UserSummary = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  justifyContent: "center",
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  "& .MuiChip-icon": {
    color: theme.palette.primary.contrastText,
  },
}))

function AppContent() {
  const [userDetails, setUserDetails] = useState(() => {
    const saved = localStorage.getItem("userDetails")
    return saved ? JSON.parse(saved) : null
  })
  const navigate = useNavigate()
  const [mode, setMode] = useState('light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2196f3",
          },
          secondary: {
            main: "#ff4081",
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
                color: mode === 'dark' ? '#ffffff' : '#333333',
              },
            },
          },
        },
      }),
    [mode]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (!userDetails) {
      navigate("/onboarding")
    }
  }, [userDetails, navigate])

  const handleClearData = () => {
    localStorage.removeItem("userDetails")
    localStorage.removeItem("aiChatMessages")
    setUserDetails(null)
    navigate("/onboarding")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AppBar  position="static" elevation={0} sx={{ bgcolor: 'background.paper', width:"71.5%", margin:"auto" }}>
          <Toolbar>
            <FitnessCenterIcon sx={{ mr: 2 }} />
            <Typography color={mode === 'dark' ? 'primary' : 'black'} variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Health AI Assistant by Shekhar Joshi
            </Typography>
            {userDetails && userDetails.name && (
              <Button sx={{backgroundColor:"red", color:"white", borderRadius:"20px", marginTop: "2px"}} onClick={handleClearData}>
                Reset Profile
              </Button>
            )}
            <IconButton 
              onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
              color="inherit"
              sx={{ ml: 2 }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {userDetails && userDetails.name && (
            <UserSummary>
              <StyledChip style={{width:"15%"}} icon={<PersonIcon />} label={userDetails.name} />
              <StyledChip style={{width:"15%"}} icon={<CalendarTodayIcon />} label={`${userDetails.age} yrs`} />
              <StyledChip style={{width:"15%"}} icon={<HeightIcon />} label={`${userDetails.height} cm`} />
              <StyledChip style={{width:"15%"}} icon={<ScaleIcon />} label={`${userDetails.weight} kg`} />
              <StyledChip style={{width:"15%"}} icon={<FlagIcon />} label={userDetails.goal.replace("_", " ")} />
            </UserSummary>
          )}

          <Box sx={{ mt: 2 }}>
            <Routes>
              <Route path="/onboarding" element={<UserDetails onComplete={setUserDetails} mode={mode} />} />
              <Route path="/chat" element={<AIChat userDetails={userDetails} />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}

