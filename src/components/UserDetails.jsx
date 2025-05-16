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
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CountrySelect from "./CountrySelect"
import { useNavigate } from "react-router-dom"

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

const GoalOption = styled(FormControlLabel)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  width: "100%",
  transition: theme.transitions.create(["border-color", "background-color"]),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.Mui-checked": {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
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

  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(formData))
  }, [formData])

  const goals = [
    { value: "weight_loss", label: "🔽 Weight Loss" },
    { value: "muscle_gain", label: "💪 Muscle Gain" },
    { value: "maintenance", label: "⚖️ Maintenance" },
    { value: "improve_fitness", label: "🏃 Improve Fitness" },
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
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography color={mode === 'dark' ? 'primary' : 'black'} variant="h6" component="h1" gutterBottom align="start" marginBottom={2}>
          Let's Personalize Your Experience
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
              />
            </Grid>
            <Grid item xs={12}>
              <CountrySelect
                value={formData.country}
                onChange={(value) => setFormData({ ...formData, country: value })}
                mode={mode}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledFormControl component="fieldset">
                <FormLabel component="legend">Primary Goal</FormLabel>
                <RadioGroup name="goal" value={formData.goal} onChange={handleInputChange}>
                  <Grid container spacing={2}>
                    {goals.map((goal) => (
                      <Grid item xs={12} sm={6} key={goal.value}>
                        <GoalOption value={goal.value} control={<Radio />} label={goal.label} />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </StyledFormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            style={{ marginTop: "24px" }}
          >
            Start Your Journey →
          </Button>
        </form>
      </StyledPaper>
    </Container>
  )
}

