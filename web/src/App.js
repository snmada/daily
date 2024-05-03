import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.js';
import SignIn from './pages/SignIn/SignIn.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import Patient from './pages/Patient/Patient.js';
import PatientProfile from './pages/PatientProfile/PatientProfile.js';
import PatientSkinData from './pages/PatientSkinData/PatientSkinData.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/signup' element={<SignUp/>}/>
                <Route exact path='/signin' element={<SignIn/>}/>
                <Route exact path='/dashboard' element={<Dashboard/>}/>
                <Route exact path='/patients' element={<Patient/>}/>
                <Route exact path='/patients/:uuid_patient' element={<PatientProfile/>}/>
                <Route exact path='/skin-data/:uuid_patient' element={<PatientSkinData/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;