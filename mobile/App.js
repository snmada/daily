import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './screens/SignUp.js';
import SignIn from './screens/SignIn.js';
import Home from './screens/Home.js';
import Gallery from './screens/Gallery.js';
import UploadImage from './screens/UploadImage.js';
import ResetPassword from './screens/ResetPassword.js';
import Treatment from './screens/Treatment.js';

const Stack = createStackNavigator();

export default function App()
{
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='SignIn' component={SignIn}/>
                <Stack.Screen name='SignUp' component={SignUp}/>
                <Stack.Screen name='Home' component={Home}/>
                <Stack.Screen name='Gallery' component={Gallery}/>
                <Stack.Screen name='UploadImage' component={UploadImage}/>
                <Stack.Screen name='Settings' component={ResetPassword}/>
                <Stack.Screen name='Treatment' component={Treatment}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}