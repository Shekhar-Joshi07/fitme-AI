import { useState, useEffect } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

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
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})(({ theme, isUser }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1.5),
  borderRadius: 20,
  wordWrap: "break-word",
  ...(isUser
    ? {
        alignSelf: "flex-end",
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }
    : {
        alignSelf: "flex-start",
        background:
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[100],
        color: theme.palette.text.primary,
      }),
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export default function AIChat({ userDetails }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  }, [messages]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Typography variant="h6">FITME</Typography>
        </ChatHeader>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.role === "user"}>
              <Typography variant="body1">{msg.content}</Typography>
            </MessageBubble>
          ))}
          {isLoading && (
            <MessageBubble isUser={false}>
              <Typography variant="body1">
                Thinking...{" "}
                <CircularProgress style={{ marginTop: "-10px" }} size={15} />
              </Typography>
            </MessageBubble>
          )}
        </MessagesContainer>
        <InputContainer component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about nutrition, workouts, or health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 30 } }}
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
              width: "55px",
              height: "55px",
              paddingLeft: "12px",
            }}
          >
            <SendIcon sx={{ width: "25px", height: "25px" }} />
          </IconButton>
        </InputContainer>
      </StyledPaper>
    </Container>
  );
}
