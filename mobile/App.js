import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './screens/SignUp.js';
import SignIn from './screens/SignIn.js';

const Stack = createStackNavigator();

export default function App()
{
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='SignIn' component={SignIn}/>
                <Stack.Screen name='SignUp' component={SignUp}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}