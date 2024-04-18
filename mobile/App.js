import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './screens/SignUp.js';

const Stack = createStackNavigator();

export default function App()
{
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='Înregistrare pacient' component={SignUp}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}