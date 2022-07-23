import Layout from 'components/layout'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
      </Route>
    </Routes>
  )
}
