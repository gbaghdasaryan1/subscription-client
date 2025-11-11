import { create } from "zustand";

export enum ModalType {
  OFFER_MODAL,
  OTP_MODAL,
}

type ModalState = {
  isOpen: boolean;
  type: ModalType | null;
  meta?: unknown;
  openModal: (type: ModalType, meta?: unknown) => void;
  closeModal: () => void;
  toggleModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  openModal: (type: ModalType, meta: unknown) =>
    set({ isOpen: true, type, meta }),
  closeModal: () => set({ isOpen: false, type: null, meta: undefined }),
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));
