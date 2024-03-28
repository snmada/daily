import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.js';
import SignIn from './pages/SignIn/SignIn.js';
import Dashboard from './pages/Dashboard/Dashboard.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/signup' element={<SignUp/>}/>
                <Route exact path='/signin' element={<SignIn/>}/>
                <Route exact path='/dashboard' element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;