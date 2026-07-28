import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { navigate } from '../../utils/NavigationService';

const CARDS = [
    { title: 'Todo Lists', subtitle: 'Manage your task lists', screen: 'TodoListGroups' },
];

export default function Home() {
    return (
        <View style={styles.container}>
            {CARDS.map(card => (
                <TouchableOpacity key={card.screen} style={styles.card} onPress={() => navigate(card.screen)}>
                    <Text style={styles.title}>{card.title}</Text>
                    <Text style={styles.subtitle}>{card.subtitle}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#888' },
});
