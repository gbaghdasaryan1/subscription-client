import { FC, ReactNode, useEffect, useState } from "react";
import { alertManager } from "./alert-manager";
import { CustomAlert } from "./custom-alert";
import { AlertState } from "./types";

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>(
    alertManager.getState(),
  );

  useEffect(() => {
    const unsubscribe = alertManager.subscribe(setAlertState);
    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={() => alertManager.hide()}
      />
    </>
  );
};
