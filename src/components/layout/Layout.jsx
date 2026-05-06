// import { Outlet } from 'react-router-dom' // 1. ADD THIS IMPORT
// import Navbar from './Navbar'
// import Footer from './Footer'
// import { Toaster } from 'react-hot-toast'

// export default function Layout() { // 2. REMOVE { children }
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Toaster position="top-right" toastOptions={{
//         style: { fontFamily: 'Lato, sans-serif', borderRadius: '12px', border: '1px solid #ffd99a' },
//         success: { iconTheme: { primary: '#FF8C00', secondary: 'white' } }
//       }} />
//       <Navbar />
      
//       {/* 3. CHANGE {children} TO <Outlet /> */}
//       <main className="flex-1">
//         <Outlet /> 
//       </main>

//       <Footer />
//     </div>
//   )
// }

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}