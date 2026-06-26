import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function DetailPenerima() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>ID Penerima:</Text>
      <Text>{id}</Text>
    </View>
  );
}