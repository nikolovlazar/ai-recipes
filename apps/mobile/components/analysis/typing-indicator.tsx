import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useEffect } from "react";

export function TypingIndicator() {
  const opacity1 = useSharedValue(1);
  const opacity2 = useSharedValue(1);
  const opacity3 = useSharedValue(1);

  useEffect(() => {
    opacity1.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );

    setTimeout(() => {
      opacity2.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        false
      );
    }, 200);

    setTimeout(() => {
      opacity3.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        false
      );
    }, 400);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>🤖</Text>
      </View>

      <View style={styles.bubble}>
        <Text style={styles.text}>AI is thinking</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, animatedStyle1]} />
          <Animated.View style={[styles.dot, animatedStyle2]} />
          <Animated.View style={[styles.dot, animatedStyle3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
  },
  bubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
  },
});
