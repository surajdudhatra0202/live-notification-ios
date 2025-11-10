import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#292929ff', // 👈 this fills status bar area on iOS
  },
  container: {
    flex: 1,
    backgroundColor: '#292929ff', // same color to match below
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10
  },
});
export default styles;