import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router } from "react-router-dom"
import axios from "axios"
import { logger } from "./utils/logger"

const queryClient = new QueryClient()

function App() {
  logger.info("Application started")
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <h1>Welcome to {import.meta.env.VITE_APP_NAME}</h1>
          <p>This project was created using the 'plz-create-me' plugin</p>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
