import { colors } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  verificationBlock: {
    position: "absolute",
    left: 0,
    top: 0,
    height: height,
    width,
    backgroundColor: "rgba(0,0,0,0.1)", // semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // make sure it’s above other content
  },
  verificationWrapper: {
    gap: 12,
    padding: 30,
    backgroundColor: colors.white,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.9)", // slightly transparent for background image
    margin: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  verificationInput: {
    width: 200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderColor: colors.textSecondary,
    backgroundColor: colors.white,
  },

  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 15,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: "red",
  },

  genderButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  genderButtonTextActive: {
    color: colors.white,
  },
  termsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
    width: "100%",
  },
  termsText: {
    flex: 1,
    flexShrink: 1, // prevents overflow on smaller screens
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  haveAccount: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
