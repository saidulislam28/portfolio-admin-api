import Colors from '@/utils/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Text, View } from 'react-native';


export default function Header() {
    const [user, setUser] = useState();

    const getUserData = async () => {
        const user = await client.getUserDetails();
        setUser(user)
    }
    return (
        <View style={{display: "flex", flexDirection: 'row', gap: 10}}>
            <View style={{
                width: 50,
                height: 50,
                borderRadius: 99,
                borderWidth: 2,
                display: 'flex',
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: 'white',

            }}>
                <Text>S</Text>
            </View>
            <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '85%',
                flexDirection: 'row'
            }}>
                <View>
                    <Text style={{color: Colors.WHITE, fontSize: 16}}>Welcome</Text>
                    <Text style={{color: Colors.WHITE, fontSize: 18}}>Saidul</Text>
                </View>
                <Ionicons name="notifications" size={24} color="white" />
            </View>
        </View>
    )
}