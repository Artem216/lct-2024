import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './context/AuthContext'
import { AllImagesProvider } from './context/AllImagesContext'
import { Img2ImgProvider } from './context/Img2ImgContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <AllImagesProvider>
                <Img2ImgProvider>
                    <App />
                </Img2ImgProvider>
            </AllImagesProvider>
        </AuthProvider>
    </BrowserRouter>
)