import { FC, useMemo } from "react";
import { Modal as Dialog } from "react-native";
import { OfferModal } from "./content/offer-modal";
import { OtpModal } from "./content/otp-modal";
import { ModalType, useModalStore } from "./store";

export const Modal: FC = () => {
  const { isOpen, type } = useModalStore();

  const content = useMemo(() => {
    switch (type) {
      case ModalType.OFFER_MODAL:
        return <OfferModal />;
      case ModalType.OTP_MODAL:
        return <OtpModal />;
      default:
        return null;
    }
  }, [type]);

  return (
    <Dialog
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {content}
    </Dialog>
  );
};
