import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { Home, Editor, Generator, AdminPanel} from './_root/pages'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"

import './globals.css'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='sign-in' element={<SigninForm />} />
          <Route path='sign-up' element={<SignupForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/generator' element={<Generator />} />
          <Route path='/editor' element={<Editor />} />
          <Route path='/admin-panel' element={<AdminPanel />} />
          {/* <Route path='/posts/:id' element={<PostDetails />}/>
          <Route path='/profile/:id/*' element={<Profile />}/> */}
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App