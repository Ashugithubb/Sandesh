import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chatId: string | null;
  receiverId: string | null;
  open: boolean;
}

const initialState: ChatState = {
  chatId: null,
  receiverId: null,
  open: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<{ chatId: string; receiverId: string; open: boolean }>) => {
      state.chatId = action.payload.chatId;
      state.receiverId = action.payload.receiverId;
      state.open = action.payload.open;
    },
    clearChat: (state) => {
      state.chatId = null;
      state.receiverId = null;
      state.open = false; // ✅ Fixed here
    },
  },
});

export const { setChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
