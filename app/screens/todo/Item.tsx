import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Feather from 'react-native-vector-icons/Feather';

interface TodoItem {
    id: string;
    text: string;
    done: boolean;
}

interface ItemProps {
    item: TodoItem;
    editId: string | null;
    startEdit: (item: TodoItem) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    styles: any;
}

export const Item = ({ item, editId, startEdit, onToggle, onDelete, styles, }: ItemProps) => {
    return (
        <View
            style={[
                styles.item,
                editId === item.id && styles.itemEditing,
            ]}
        >
            <TouchableOpacity
                style={styles.itemLeft}
                onPress={() => onToggle(item.id)}
            >
                <View
                    style={[
                        styles.checkbox,
                        item.done && styles.checkboxDone,
                    ]}
                />
                <Text
                    style={[
                        styles.itemText,
                        item.done && styles.itemTextDone,
                    ]}
                >
                    {item.text} </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                    <Feather
                        name="edit-2"
                        size={18}
                        color="#007AFF"
                        style={styles.actionIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <Feather
                        name="trash-2"
                        size={18}
                        color="#FF3B30"
                        style={styles.actionIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

