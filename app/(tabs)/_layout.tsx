import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'camera',
                android: 'camera_alt',
                web: 'camera',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'list.bullet',
                android: 'shopping_cart',
                web: 'list',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
