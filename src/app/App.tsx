import { Outlet } from 'react-router-dom'
import '@/app/styles/app.css'

/**
 * App shell mounting the active router outlet.
 */
function App() {
  return <Outlet />
}

export default App
