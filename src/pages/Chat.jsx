import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AIChat from "../components/AIChat";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function Chat() {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    if (!userDetails) {
      navigate("/onboarding");
    }
  }, [userDetails, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("aiChatMessages");
    navigate("/onboarding");
  };

  if (!userDetails) return null;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
            <FitnessCenterIcon />
          </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {userDetails.name}! 👋
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <AIChat userDetails={userDetails} />
      </Box>
    </Box>
  );
} 