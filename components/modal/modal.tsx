import { FC, useMemo } from "react";
import { View } from "react-native";
import { OfferModal } from "./content/offer-modal/offer-modal";
import { OtpModal } from "./content/otp-modal/otp-modal";
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
    <View
      style={{
        flex: 1,
        display: isOpen ? "flex" : "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {content}
    </View>
  );
};
