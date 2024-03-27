import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.js';
import SignIn from './pages/SignIn/SignIn.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/signup' element={<SignUp/>}/>
                <Route exact path='/signin' element={<SignIn/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;