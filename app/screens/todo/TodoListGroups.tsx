import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelector, useDispatch } from 'react-redux';
import { addList, deleteList, renameList, TodoList } from '../../../store/slices/todo';
import { RootState } from '../../../store/store';
import { navigate } from '../../../utils/NavigationService';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    LinearTransition
} from 'react-native-reanimated';

export default function TodoListGroups() {
    const dispatch = useDispatch();
    const lists = useSelector((state: RootState) => state.todo.lists);
    const [input, setInput] = useState('');
    const [editId, setEditId] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!input.trim()) return;
        if (editId) {
            dispatch(renameList({ id: editId, title: input.trim() }));
            setEditId(null);
        } else {
            dispatch(addList(input.trim()));
        }
        setInput('');
    };

    const startEdit = (list: TodoList) => {
        setEditId(list.id);
        setInput(list.title);
    };

    const cancelEdit = () => {
        setEditId(null);
        setInput('');
    };

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Delete List',
            `Are you sure you want to delete the list "${title}" and all its tasks?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => dispatch(deleteList(id))
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: TodoList }) => {
        const totalTasks = item.data.length;
        const completedTasks = item.data.filter(t => t.done).length;
        const progress = totalTasks === 0 ? 0 : completedTasks / totalTasks;

        return (
            <Animated.View
                entering={SlideInRight.duration(250)}
                exiting={SlideOutLeft.duration(250)}
                layout={LinearTransition.duration(250)}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigate('DynamicTodo', { listId: item.id, title: item.title })}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.cardActions}>
                            <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionBtn}>
                                <Feather name="edit-2" size={16} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id, item.title)} style={styles.actionBtn}>
                                <Feather name="trash-2" size={16} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressText}>
                                {totalTasks === 0 ? 'No tasks' : `${completedTasks} / ${totalTasks} completed`}
                            </Text>
                            {totalTasks > 0 && (
                                <Text style={styles.progressPercent}>{`${Math.round(progress * 100)}%`}</Text>
                            )}
                        </View>
                        {totalTasks > 0 && (
                            <Progress.Bar
                                progress={progress}
                                width={null}
                                color="#007AFF"
                                unfilledColor="#e0e0e0"
                                borderWidth={0}
                                height={6}
                                borderRadius={3}
                                animated
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder={editId ? 'Rename todo list...' : 'New todo list title...'}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleSubmit}>
                    <Text style={styles.addBtnText}>{editId ? 'Save' : 'Create'}</Text>
                </TouchableOpacity>
                {editId && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                        <Feather name="x" size={18} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                data={lists}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No lists found. Create one above!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    inputRow: { flexDirection: 'row', marginBottom: 16 },
    input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 15, borderWidth: 1, borderColor: '#ddd', color: '#000' },
    addBtn: { marginLeft: 8, backgroundColor: '#007AFF', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
    addBtnText: { color: '#fff', fontWeight: '600' },
    cancelBtn: { marginLeft: 6, backgroundColor: '#FF3B30', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: '#333', flex: 1, marginRight: 8 },
    cardActions: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 6, marginLeft: 8 },
    progressSection: { marginTop: 4 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressText: { fontSize: 12, color: '#666' },
    progressPercent: { fontSize: 12, fontWeight: '700', color: '#007AFF' },
    empty: { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 15 },
});
