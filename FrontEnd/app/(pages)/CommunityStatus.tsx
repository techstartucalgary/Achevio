import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

const CommunityStatus = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Status</Text>
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <Text style={styles.statusText}>Active</Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>Inactive</Text>
        </View>
      </View>
    </View>
  )
 
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        marginTop: 30,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    statusContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    status: {
        flexDirection: 'row',
        marginRight: 20,
    },
    statusIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    statusText: {
        fontSize: 16,
        color: 'white',

    },
    })   
export default CommunityStatus