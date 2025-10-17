import { View, Text, StyleSheet } from "react-native";
import { memo } from "react";

interface MessageBubbleProps {
  content: string;
  isStreaming?: boolean;
}

export const MessageBubble = memo(
  ({ content, isStreaming = false }: MessageBubbleProps) => {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>🤖</Text>
        </View>

        <View style={styles.bubble}>
          <Text style={styles.messageText}>{content}</Text>
          {isStreaming && <Text style={styles.cursor}>▋</Text>}
        </View>
      </View>
    );
  },
  (prev, next) => {
    return prev.content === next.content && prev.isStreaming === next.isStreaming;
  }
);

MessageBubble.displayName = "MessageBubble";

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
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
  },
  cursor: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 2,
  },
});
