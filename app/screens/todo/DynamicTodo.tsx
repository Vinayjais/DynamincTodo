import React, { useState, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, editTodo, toggleTodo, deleteTodo, undoDelete, removeDeleted } from '../../../store/slices/todo';
import { RootState } from '../../../store/store';
import { Item } from './Item';
import Feather from 'react-native-vector-icons/Feather';

import Animated, {
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    LinearTransition
} from 'react-native-reanimated';

export default function DynamicTodo({ route, navigation }: any) {
    const { listId, title } = route.params;
    const dispatch = useDispatch();

    useEffect(() => {
        if (title) {
            navigation.setOptions({ title });
        }
    }, [title, navigation]);

    const list = useSelector((state: RootState) => state.todo.lists.find(l => l.id === listId));
    const todos = list?.data ?? [];
    const deleted = list?.deleted ?? [];

    const [input, setInput] = useState('');
    const [editId, setEditId] = useState(null);

    const done = useMemo(() => todos.filter(t => t.done).length, [todos]);
    const total = todos.length;
    const progress = total === 0 ? 0 : done / total;

    const handleSubmit = () => {
        if (!input.trim()) return;
        if (editId) {
            dispatch(editTodo({ listId, id: editId, text: input.trim() }));
            setEditId(null);
        } else {
            dispatch(addTodo({ listId, text: input.trim() }));
        }
        setInput('');
    };

    const startEdit = (item: any) => {
        setEditId(item.id);
        setInput(item.text);
    };

    const cancelEdit = () => {
        setEditId(null);
        setInput('');
    };

    const handleDelete = (id: string) => {
        dispatch(deleteTodo({ listId, id }));
        setTimeout(() => {
            dispatch(removeDeleted({ listId, id }));
        }, 10000);
    };

    return (
        <View style={styles.container}>
            {total > 0 && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressRow}>
                        <Text style={styles.progressText}>{`${done} / ${total} completed`}</Text>
                        <Text style={styles.progressPercent}>{`${Math.round(progress * 100)}%`}</Text>
                    </View>
                    <Progress.Bar
                        progress={progress}
                        width={null}
                        color="#007AFF"
                        unfilledColor="#e0e0e0"
                        borderWidth={0}
                        height={8}
                        borderRadius={4}
                        animated
                    />
                </View>
            )}
            {deleted.map((d: any) => (
                <TouchableOpacity key={d.item.id} style={styles.undoBtn} onPress={() => dispatch(undoDelete({ listId, id: d.item.id }))}>
                    <Feather name="rotate-ccw" size={14} color="#fff" />
                    <Text style={styles.undoBtnText}>{`Undo delete "${d.item.text}"`}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder={editId ? 'Edit task...' : 'Add a task...'}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    placeholderTextColor={"#ccc"}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleSubmit}>
                    <Text style={styles.addBtnText}>{editId ? 'Save' : 'Add'}</Text>
                </TouchableOpacity>
                {editId && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                        <Feather name="x" size={18} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                data={todos}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Animated.View
                        key={item.id}
                        entering={SlideInRight.duration(250)}
                        exiting={SlideOutLeft.duration(250)}
                        layout={LinearTransition.duration(250)}
                    >
                        <Item
                            item={item}
                            editId={editId}
                            startEdit={startEdit}
                            onToggle={(id) => dispatch(toggleTodo({ listId, id }))}
                            onDelete={handleDelete}
                            styles={styles}
                        />
                    </Animated.View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add one above!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    progressContainer: { marginBottom: 16 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressText: { fontSize: 13, color: '#555' },
    progressPercent: { fontSize: 13, fontWeight: '700', color: '#007AFF' },
    undoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 8, padding: 10, marginBottom: 10, gap: 6 },
    undoBtnText: { color: '#fff', fontSize: 13, flex: 1 },
    inputRow: { flexDirection: 'row', marginBottom: 16 },
    input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 15, borderWidth: 1, borderColor: '#ddd',color:"#000" },
    addBtn: { marginLeft: 8, backgroundColor: '#007AFF', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
    addBtnText: { color: '#fff', fontWeight: '600' },
    cancelBtn: { marginLeft: 6, backgroundColor: '#FF3B30', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10 },
    itemEditing: { borderWidth: 1.5, borderColor: '#007AFF' },
    itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#007AFF', marginRight: 12 },
    checkboxDone: { backgroundColor: '#007AFF' },
    itemText: { fontSize: 15, flex: 1 },
    itemTextDone: { textDecorationLine: 'line-through', color: '#aaa' },
    actions: { flexDirection: 'row', alignItems: 'center' },
    actionIcon: { paddingLeft: 12 },
    empty: { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 15 },
});
