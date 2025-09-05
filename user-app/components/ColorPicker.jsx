import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'

export default function ColorPicker({selectedColor,setSelectedColor}) {
  return (
    <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }}>
     {Colors.COLOR_LIST.map((color,index)=>(
        <TouchableOpacity key={index} style={[{
            height: 30,
            width: 30,
            backgroundColor: color,
            borderRadius: 99
        }, selectedColor == color && {borderWidth: 2}]}
        onPress={()=>setSelectedColor(color)}
        >

        </TouchableOpacity>
     ))}
    </View>
  )
}