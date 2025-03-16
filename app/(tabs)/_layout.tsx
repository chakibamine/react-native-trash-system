import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { themes } from '@/assets/style/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', 
        },
      }}
      tabBar={(props) => (
        <View style={[styles.container, { backgroundColor: theme.container }]}>
          {props.state.routes.map((route, index) => {
            const { options } = props.descriptors[route.key];
            const label = options.title || route.name;
            const isFocused = props.state.index === index;

            const onPress = () => {
              const event = props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.itemContainer}
              >
                <Text
                  style={[
                    styles.label,
                    { color: theme.text }, // Dynamic text colors
                    isFocused && { color: theme.primary }, // Active tab text color
                  ]}
                >
                  {label}
                </Text>
                {isFocused && (
                  <View
                    style={[
                      styles.indicator,
                      { backgroundColor: theme.primary }, // Dynamic indicator color
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      {/* Define each tab screen only once */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="Map" options={{ title: 'Map' }} />
      <Tabs.Screen name="Chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 92,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.491,
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 9999,
  },
});