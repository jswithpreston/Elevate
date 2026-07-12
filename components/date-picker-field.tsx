import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppTheme } from "@/context/ThemeContext";

type DatePickerFieldProps = {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  mode?: "date" | "time";
  placeholder?: string;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  mode = "date",
  placeholder = "Select...",
}: DatePickerFieldProps) {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const [show, setShow] = useState(false);

  let dateObj = new Date();
  if (value) {
    if (mode === "date") {
      dateObj = new Date(value + "T12:00:00Z");
    } else {
      // time mode (value could be "HH:mm")
      const [h, m] = value.split(":");
      dateObj.setHours(parseInt(h || "0", 10), parseInt(m || "0", 10));
    }
  }

  const onChangePicker = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      if (mode === "date") {
        const d = selectedDate;
        // ensure format YYYY-MM-DD in local time
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        onChange(dateStr);
      } else {
        const d = selectedDate;
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        onChange(timeStr);
      }
    }
  };

  const displayValue = value
    ? mode === "date"
      ? dateObj.toLocaleDateString()
      : dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : placeholder;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      {Platform.OS === "ios" ? (
        <View style={[styles.input, isDark && styles.inputDark, { padding: 4, alignItems: "flex-start" }]}>
          <DateTimePicker
            value={value ? dateObj : new Date()}
            mode={mode}
            display="default"
            onChange={onChangePicker}
            themeVariant={isDark ? "dark" : "light"}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.input, isDark && styles.inputDark]}
            onPress={() => setShow(true)}
          >
            <Text
              style={[
                styles.inputText,
                isDark && styles.inputTextDark,
                !value && styles.placeholderText,
              ]}
            >
              {displayValue}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={value ? dateObj : new Date()}
              mode={mode}
              display="default"
              onChange={onChangePicker}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#434656",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  labelDark: {
    color: "#c3c5d9",
  },
  input: {
    backgroundColor: "#f6faff",
    borderWidth: 1,
    borderColor: "#dbe4ed",
    borderRadius: 14,
    padding: 16,
    justifyContent: "center",
  },
  inputDark: {
    backgroundColor: "#141d23",
    borderColor: "#434656",
  },
  inputText: {
    fontSize: 16,
    fontFamily: "Manrope",
    color: "#141d23",
  },
  inputTextDark: {
    color: "#ffffff",
  },
  placeholderText: {
    color: "#c3c5d9",
  },
});
