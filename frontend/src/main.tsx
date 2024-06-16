import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './context/AuthContext'
import { AllImagesProvider } from './context/AllImagesContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <AllImagesProvider>
                <App />
            </AllImagesProvider>
        </AuthProvider>
    </BrowserRouter>
)