 
import Footer from './Footer'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
<div className="h-screen">
  {/* Fixed Header */}
  <header>
    <Header />
  </header>

  {/* Scrollable Main Content */}
  <main className="">
    <Outlet />
  </main>

  {/* Fixed Footer */}
  <footer>
   <Footer />
  </footer>
</div>


  )
}
