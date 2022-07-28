import Layout from 'components/layout'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import client from 'services/connectors'
import { WagmiConfig } from 'wagmi'
import SignIn from 'pages/sign_in'

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </WagmiConfig>
  )
}
