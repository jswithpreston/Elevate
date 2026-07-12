import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for push notification!");
    return;
  }
  
  // Usually you would get the Expo push token here to send to your backend
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  
  return token;
}

export async function scheduleTaskReminder(taskId: string, title: string, deadline: string) {
  const deadlineDate = new Date(deadline);
  // Remind 1 hour before the deadline
  deadlineDate.setHours(deadlineDate.getHours() - 1);
  
  if (deadlineDate <= new Date()) {
    return; // Don't schedule in the past
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Reminder \u23f0",
      body: `Your task "${title}" is due soon!`,
      data: { taskId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: deadlineDate,
    },
  });
}

export async function scheduleHabitReminder(habitId: string, title: string, timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Check-in \u2728",
      body: `Time for your habit: ${title}`,
      data: { habitId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });
}
