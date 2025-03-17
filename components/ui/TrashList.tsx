import React, { useCallback, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface TrashListProps {
  trashLocations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

const TrashList: React.FC<TrashListProps> = ({ trashLocations, setSelectedLocation }) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(MIN_TRANSLATE_Y);
  const context = useSharedValue({ y: 0 });
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== MIN_TRANSLATE_Y;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(MIN_TRANSLATE_Y, newTranslateY));
    },
    onEnd: (event) => {
      if (event.velocityY < -500) {
        scrollTo(MAX_TRANSLATE_Y);
      } else if (event.velocityY > 500) {
        scrollTo(MIN_TRANSLATE_Y);
      } else {
        const shouldExpand = translateY.value < (MAX_TRANSLATE_Y + MIN_TRANSLATE_Y) / 2;
        if (shouldExpand) {
          scrollTo(MAX_TRANSLATE_Y);
        } else {
          scrollTo(MIN_TRANSLATE_Y);
        }
      }
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Trash Locations</Text>
          <Text style={styles.subtitle}>{trashLocations.length} locations found</Text>
        </View>

        <Animated.ScrollView 
          style={styles.listContainer}
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEventThrottle={16}
        >
          {trashLocations.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedLocation(item)}
              style={styles.trashItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={item.status === "empty" ? "trash-outline" : "trash"} 
                  size={24} 
                  color={item.status === "empty" ? "#34A853" : "#EA4335"}
                />
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={styles.locationText}>{item.location}</Text>
                <View style={[
                  styles.statusBadge,
                  item.status === "empty" ? styles.emptyStatus : styles.fullStatus
                ]}>
                  <Text style={[
                    styles.statusText,
                    item.status === "empty" ? styles.emptyStatusText : styles.fullStatusText
                  ]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          ))}
          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  handleContainer: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  trashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2024',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyStatus: {
    backgroundColor: '#E6F4EA',
  },
  fullStatus: {
    backgroundColor: '#FCE8E6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyStatusText: {
    color: '#34A853',
  },
  fullStatusText: {
    color: '#EA4335',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default TrashList;