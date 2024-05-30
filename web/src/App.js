import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage.js';
import SignUp from './pages/SignUp/SignUp.js';
import SignIn from './pages/SignIn/SignIn.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import Patient from './pages/Patient/Patient.js';
import PatientProfile from './pages/PatientProfile/PatientProfile.js';
import PatientSkinData from './pages/PatientSkinData/PatientSkinData.js';
import MedicalRecord from './pages/MedicalRecord/MedicalRecord.js';
import ViewMedicalRecord from './pages/ViewMedicalRecord/ViewMedicalRecord.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<LandingPage/>}/>
                <Route exact path='/signup' element={<SignUp/>}/>
                <Route exact path='/signin' element={<SignIn/>}/>
                <Route exact path='/dashboard' element={<Dashboard/>}/>
                <Route exact path='/patients' element={<Patient/>}/>
                <Route exact path='/patients/:uuid_patient' element={<PatientProfile/>}/>
                <Route exact path='/patients/:uuid_patient/skin-data' element={<PatientSkinData/>}/>
                <Route exact path='/patients/:uuid_patient/medical-record' element={<MedicalRecord/>}/>
                <Route exact path='/patients/:uuid_patient/view-medical-record/:id_medical_record' element={<ViewMedicalRecord/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;