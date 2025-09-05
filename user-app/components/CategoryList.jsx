import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/utils/Colors'
import { useRouter } from 'expo-router'

export default function CategoryList({ categoryList }) {


  const router = useRouter();

  const onCategoryClick =(category)=>{

    router.push({
      pathname: '/Category_details',
      params: {
        categoryId: category.id
      }
    })

  }


  return (
    <View style={{
      marginTop: 20
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}>Latest Budget</Text>
      <View>
        {categoryList?.map((category, index) => (
          <TouchableOpacity
          onPress={()=>onCategoryClick(category)}
          style={styles.container} key={index}>
            <View style={styles.iconContainer}>
              <Text style={[styles.icontext, { backgroundColor: category?.color }]}>{category?.icon}</Text>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text style={styles.categoryText}>{category.name}</Text>
                <Text style={styles.itemCount}>{category?.CategoryItems?.length} Items</Text>
              </View>
              <Text style={styles.budgetCount}>${category.assigned_budget}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  icontext: {
    fontSize: 20,
    padding: 20,
    borderRadius: 15,
    minWidth: 60,
    textAlign: 'center'
  },
  iconContainer: {

    justifyContent: 'center',
    alignItems: 'baseline'
  },
  container: {
    marginBottom: 10,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius:15
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemCount: {
    fontWeight: '500'

  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    alignItems: "center"

  },
  budgetCount: {
    fontWeight: 'bold',
    fontSize: 18
  }
})