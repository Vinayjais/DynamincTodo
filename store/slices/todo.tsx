import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Item {
  id: string;
  text: string;
  done: boolean;
}

export interface DeletedItem {
  item: Item;
  index: number;
}

export interface TodoList {
  id: string;
  title: string;
  data: Item[];
  deleted: DeletedItem[];
}

interface State {
  lists: TodoList[];
}

const initialState: State = {
  lists: [
    {
      id: "default-list",
      title: "My Tasks",
      data: [],
      deleted: []
    }
  ]
};

const todo = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addList: (state, action: PayloadAction<string>) => {
            state.lists.push({
                id: Date.now().toString(),
                title: action.payload,
                data: [],
                deleted: []
            });
        },
        deleteList: (state, action: PayloadAction<string>) => {
            state.lists = state.lists.filter(l => l.id !== action.payload);
        },
        renameList: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.id);
            if (list) list.title = action.payload.title;
        },
        addTodo: (state, action: PayloadAction<{ listId: string; text: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                list.data.push({ id: Date.now().toString(), text: action.payload.text, done: false });
            }
        },
        editTodo: (state, action: PayloadAction<{ listId: string; id: string; text: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                const item = list.data.find(t => t.id === action.payload.id);
                if (item) item.text = action.payload.text;
            }
        },
        toggleTodo: (state, action: PayloadAction<{ listId: string; id: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                const item = list.data.find(t => t.id === action.payload.id);
                if (item) item.done = !item.done;
            }
        },
        deleteTodo: (state, action: PayloadAction<{ listId: string; id: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                const index = list.data.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    list.deleted.unshift({ item: list.data[index], index });
                    list.data.splice(index, 1);
                }
            }
        },
        undoDelete: (state, action: PayloadAction<{ listId: string; id: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                const index = list.deleted.findIndex(d => d.item.id === action.payload.id);
                if (index !== -1) {
                    const [deleted] = list.deleted.splice(index, 1);
                    list.data.splice(deleted.index, 0, deleted.item);
                }
            }
        },
        removeDeleted: (state, action: PayloadAction<{ listId: string; id: string }>) => {
            const list = state.lists.find(l => l.id === action.payload.listId);
            if (list) {
                list.deleted = list.deleted.filter(d => d.item.id !== action.payload.id);
            }
        },
    }
});

export const { addList, deleteList, renameList, addTodo, editTodo, toggleTodo, deleteTodo, undoDelete, removeDeleted } = todo.actions;
export default todo.reducer;