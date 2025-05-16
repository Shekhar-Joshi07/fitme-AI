import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CountrySelect from "./CountrySelect"
import { useNavigate } from "react-router-dom"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  width: "100%",
}))

const GoalOption = styled(FormControlLabel)(({ theme, checked }) => ({
  border: `2px solid ${checked ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  width: "100%",
  transition: theme.transitions.create(["border-color", "background-color", "transform"], {
    duration: 200,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-2px)",
  },
  ...(checked && {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
  }),
}))

const AnimatedButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(3),
  fontSize: "1.1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}))

export default function UserDetails({ onComplete, mode }) {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("userDetails")
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          age: "",
          height: "",
          weight: "",
          goal: "weight_loss",
          country: "",
        }
  })

  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(formData))
  }, [formData])

  const goals = [
    { value: "weight_loss", label: "🔽 Weight Loss", description: "Achieve healthy and sustainable weight loss" },
    { value: "muscle_gain", label: "💪 Muscle Gain", description: "Build strength and muscle mass" },
    { value: "maintenance", label: "⚖️ Maintenance", description: "Maintain current weight and fitness level" },
    { value: "improve_fitness", label: "🏃 Improve Fitness", description: "Enhance overall fitness and endurance" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("userDetails", JSON.stringify(formData))
    onComplete(formData)
    navigate("/chat")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Create Your Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                inputProps={{ min: 12, max: 120 }}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                inputProps={{ min: 100, max: 250 }}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                inputProps={{ min: 30, max: 300 }}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <CountrySelect
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value })}
                  mode={mode}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <StyledFormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, fontSize: "1.1rem" }}>
                  What's your primary fitness goal?
                </FormLabel>
                <RadioGroup name="goal" value={formData.goal} onChange={handleInputChange}>
                  <Grid container spacing={2}>
                    {goals.map((goal) => (
                      <Grid item xs={12} sm={6} key={goal.value}>
                        <GoalOption
                          value={goal.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                {goal.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {goal.description}
                              </Typography>
                            </Box>
                          }
                          checked={formData.goal === goal.value}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </StyledFormControl>
            </Grid>
          </Grid>
          <AnimatedButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Start Your Fitness Journey →
          </AnimatedButton>
        </form>
      </StyledPaper>
    </Container>
  )
}