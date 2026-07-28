
import {View, Text, StyleSheet } from 'react-native';

export default function Row({ label, value } :{ label: string; value: string } ) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 12, color: '#888' },
  value: { fontSize: 15, fontWeight: '500', marginTop: 2 },
});
