import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="bg-backgroundDark mx-auto box-border">
      <Outlet />
    </div>
  )
}
