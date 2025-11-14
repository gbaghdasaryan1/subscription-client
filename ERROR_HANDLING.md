# Error Handling Implementation Guide

## Overview

This document describes the comprehensive error handling system implemented throughout the application. The system provides user-friendly error messages in Russian with proper categorization and consistent UI feedback.

## Architecture

### Core Components

1. **ErrorHandler Utility** (`helper/error-handler.ts`)
   - Centralized error parsing and handling
   - Error type categorization
   - User-friendly Russian error messages
   - Integration with custom Alert component

2. **Custom Alert Component** (`components/ui/alert.tsx`)
   - Cross-platform consistent UI
   - Global alert manager singleton
   - API matching React Native's Alert.alert()

3. **Loading Component** (`components/ui/loading.tsx`)
   - Reusable loading modal overlay
   - Displayed during all async operations

4. **Axios Interceptors** (`services/axios-instance.ts`)
   - Automatic auth token injection
   - Silent error handling for network errors
   - 401 handling with automatic storage clearance

## Error Types

The system categorizes errors into 6 types:

```typescript
export enum ErrorType {
  NETWORK = "NETWORK", // Network/connection errors
  AUTHENTICATION = "AUTH", // 401/403 auth errors
  VALIDATION = "VALIDATION", // 400 validation errors
  SERVER = "SERVER", // 500+ server errors
  TIMEOUT = "TIMEOUT", // Request timeout
  UNKNOWN = "UNKNOWN", // Other errors
}
```

## Usage Patterns

### 1. Basic Error Handling

```typescript
import { handleError } from "@/helper/error-handler";

try {
  await someApiCall();
} catch (error) {
  handleError(error, "Ошибка при выполнении операции");
}
```

### 2. Silent Error Handling (No Alert)

```typescript
import { handleErrorSilent } from "@/helper/error-handler";

try {
  await someApiCall();
} catch (error) {
  handleErrorSilent(error);
  // Error logged to console, no alert shown
}
```

### 3. Error Handling with Callback

```typescript
import { ErrorHandler } from "@/helper/error-handler";

try {
  await someApiCall();
} catch (error) {
  ErrorHandler.handleWithCallback(error, "Ошибка", (parsedError) => {
    console.log("Error type:", parsedError.type);
    console.log("Error code:", parsedError.code);
  });
}
```

### 4. Validation Before API Call

```typescript
// Input validation
if (!email || !password) {
  Alert.alert("Ошибка валидации", "Заполните все поля");
  return;
}

if (password.length < 6) {
  Alert.alert("Ошибка валидации", "Пароль должен быть не менее 6 символов");
  return;
}

// Then proceed with API call
setLoading(true);
try {
  await apiCall();
} catch (error) {
  handleError(error, "Ошибка");
} finally {
  setLoading(false);
}
```

## Screen-Specific Implementation

### LoginScreen.tsx

- **Validation**: Email/phone and password presence
- **Error Handling**: Network errors, invalid credentials
- **Loading State**: During login API call
- **Success Flow**: Navigate to /qr on success

### RegistrationScreen.tsx

- **Validation**:
  - Full name presence
  - Email or phone presence
  - Password length (min 6 chars)
  - Terms acceptance
- **Error Handling**: Network errors, duplicate accounts
- **Two-Step Flow**: Send code → Open OTP modal
- **Loading State**: During code sending

### OtpModal.tsx

- **Validation**: OTP presence and format
- **Error Handling**: Invalid OTP, network errors
- **Success Flow**: Complete registration → Navigate to login
- **Loading State**: During verification and registration

### ProfileScreen.tsx

- **Validation**:
  - Old and new password presence
  - New password length (min 6 chars)
- **Error Handling**:
  - Password change errors
  - Logout errors
  - Account deletion errors
- **Loading State**: During all profile operations

### QrScreen.tsx

- **Error Handling**:
  - Initial data load errors
  - QR generation errors
  - Subscription check errors
  - Network errors
- **Fallback**: Local QR generation when API fails
- **Loading State**: During initial load and refresh

## Error Messages (Russian)

### Network Errors

- "Проверьте подключение к интернету"
- "Не удалось подключиться к серверу"

### Authentication Errors

- "Неверные учетные данные"
- "Сессия истекла. Войдите снова"
- "Нет доступа к этому ресурсу"

### Validation Errors

- Displays specific validation error from server
- Examples: "Email уже зарегистрирован", "Неверный формат телефона"

### Server Errors

- "Ошибка сервера. Попробуйте позже"

### Timeout Errors

- "Превышено время ожидания. Попробуйте снова"

### Unknown Errors

- "Произошла неизвестная ошибка"

## Axios Configuration

### Request Interceptor

```typescript
// Automatically adds auth token to all requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStorageService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

```typescript
// Handles 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStorageService.clearAll();
      // Redirect handled by _layout.tsx auth check
    }
    handleErrorSilent(error);
    return Promise.reject(error);
  },
);
```

## Best Practices

1. **Always validate input before API calls**
   - Prevents unnecessary network requests
   - Provides immediate feedback
   - Better UX

2. **Use loading states consistently**

   ```typescript
   setLoading(true);
   try {
     await apiCall();
   } catch (error) {
     handleError(error, "Context");
   } finally {
     setLoading(false);
   }
   ```

3. **Provide context in error titles**
   - "Ошибка входа" instead of just "Ошибка"
   - "Ошибка регистрации" instead of generic message
   - Helps users understand what failed

4. **Handle success cases explicitly**

   ```typescript
   try {
     const response = await apiCall();
     if (response?.data?.success) {
       Alert.alert("Успех", "Операция выполнена успешно");
       // Navigate or update state
     }
   } catch (error) {
     handleError(error, "Ошибка");
   }
   ```

5. **Clean up on logout**

   ```typescript
   await SecureStorageService.clearAll();
   router.replace("/login");
   ```

6. **Use silent errors in interceptors**
   - Prevents double alerts
   - Logs for debugging
   - Allows component-level handling

## Testing Error Scenarios

### Network Errors

- Turn off WiFi/mobile data
- Use network throttling
- Test airplane mode

### Authentication Errors

- Expired token scenarios
- Invalid credentials
- Unauthorized resource access

### Validation Errors

- Empty fields
- Invalid email format
- Short passwords
- Missing required fields

### Server Errors

- Mock 500 responses
- Test timeout scenarios
- Test server unavailability

## Future Enhancements

1. **Error Logging Service**
   - Send errors to analytics/monitoring
   - Track error frequency
   - User session context

2. **Retry Logic**
   - Automatic retry for network errors
   - Exponential backoff
   - User-initiated retry

3. **Offline Mode**
   - Cache data locally
   - Queue failed requests
   - Sync when online

4. **Error Recovery**
   - Suggest actions for errors
   - Auto-fix common issues
   - Help documentation links

## Related Files

- `helper/error-handler.ts` - Main error handling utility
- `components/ui/alert.tsx` - Custom alert component
- `components/ui/loading.tsx` - Loading overlay
- `services/axios-instance.ts` - HTTP client with interceptors
- `app/_layout.tsx` - Global alert provider and auth routing

## Support

For questions or issues with error handling:

1. Check this documentation
2. Review error-handler.ts implementation
3. Check axios-instance.ts interceptors
4. Verify Alert component is properly wrapped in AlertProvider
