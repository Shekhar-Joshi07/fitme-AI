import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Box,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fab,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "calc(100vh - 32px)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[10],
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})(({ theme, isUser }) => ({
  maxWidth: "80%",
  padding: theme.spacing(1.5, 2),
  borderRadius: 20,
  wordWrap: "break-word",
  animation: "fadeIn 0.3s ease-in",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "90%",
  },
  ...(isUser
    ? {
        alignSelf: "flex-end",
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderBottomRightRadius: 5,
      }
    : {
        alignSelf: "flex-start",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[100],
        color: theme.palette.text.primary,
        borderBottomLeftRadius: 5,
      }),
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  position: "sticky",
  bottom: 0,
}));

const ScrollTopButton = styled(Fab)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(10),
  right: theme.spacing(2),
  zIndex: 2,
}));

export default function AIChat({ userDetails }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "Health AI Assistant",
    },
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("aiChatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollTop(scrollTop < scrollHeight - clientHeight - 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const stream = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: `You are a certified health expert. User profile:
            Name: ${userDetails.name}
            Age: ${userDetails.age}
            Height: ${userDetails.height}cm
            Weight: ${userDetails.weight}kg
            Goal: ${userDetails.goal}
            Country: ${userDetails.country}
            Provide science-backed, personalized advice. Be concise and supportive. Do not entertain any questions that are not related to health or fitness.`,
          },
          ...messages,
          userMessage,
        ],
        stream: true,
      });

      let fullResponse = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: fullResponse },
            ];
          });
        }
      }
    } catch (error) {
      let errorMessage = "⚠️ Error connecting to AI. Please try again.";
      let retryTime = 40;

      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error?.message.includes("Rate limit")) {
          retryTime = errorData.error.message.match(/\d+/)?.[0] || 40;
          errorMessage = `⚠️ ${errorData.error.message}. Please wait ${retryTime} seconds.`;
        }
      } catch (e) {
        console.error("Error parsing error message:", e);
      }

      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          {
            role: "assistant",
            content: errorMessage,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: "100vh", py: 2 }}>
      <StyledPaper>
        <ChatHeader>
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <FitnessCenterIcon />
          </Avatar>
          <Typography variant="h6" noWrap>
            Health AI Assistant
          </Typography>
        </ChatHeader>
        <MessagesContainer ref={containerRef}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.role === "user"}>
              <Typography variant="body1">{msg.content}</Typography>
            </MessageBubble>
          ))}
          {isLoading && (
            <MessageBubble isUser={false}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1">Thinking</Typography>
                <CircularProgress size={16} />
              </Box>
            </MessageBubble>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about nutrition, workouts, or health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 30,
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={isLoading || !input.trim()}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
              "&:disabled": { bgcolor: "action.disabledBackground" },
              width: 56,
              height: 56,
              flexShrink: 0,
            }}
          >
            <SendIcon />
          </IconButton>
        </InputContainer>
        <Zoom in={showScrollTop}>
          <ScrollTopButton
            size="small"
            color="primary"
            onClick={scrollToBottom}
            aria-label="scroll to bottom"
          >
            <KeyboardArrowUpIcon />
          </ScrollTopButton>
        </Zoom>
      </StyledPaper>
    </Container>
  );
}