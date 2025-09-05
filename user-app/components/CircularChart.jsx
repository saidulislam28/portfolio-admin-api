import { View, Text } from 'react-native'
import React, { useState } from 'react'
import PieChart from 'react-native-pie-chart'
import Colors from '@/utils/Colors';


export default function CircularChart() {

    const widthAndHeight= 150;
    const [values, setValues] = useState([40, 60]);
    const [sliceColor, setSliceColor] = useState([Colors.BLACK, Colors.PRIMARY])
    return (
        <View>
            <Text>CircularChart</Text>
            <View>

                <PieChart 
                widthAndHeight={widthAndHeight} 
                series={values} 
                sliceColor={sliceColor}
                coverRadius={0.45}
                coverFill={'#FFF'}
                />

            </View>
        </View>
    )
}