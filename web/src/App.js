import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/signup' element={<SignUp/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;