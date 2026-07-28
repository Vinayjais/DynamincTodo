import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { navigate } from '../../utils/NavigationService';
import { getAuthErrorMessage } from '../../utils/auth';

type HomeProps = {
    user?: any;
};

const CARDS = [
    { title: 'Todo Lists', subtitle: 'Manage your task lists', screen: 'TodoListGroups' },
];

export default function Home({ user }: HomeProps) {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                await auth().createUserWithEmailAndPassword(email.trim(), password);
                setMessage('Account created successfully.');
            } else {
                await auth().signInWithEmailAndPassword(email.trim(), password);
                setMessage('Signed in successfully.');
            }
        } catch (err: any) {
            setError(getAuthErrorMessage(err?.code));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth().signOut();
            setMessage('Signed out successfully.');
            setError(null);
        } catch {
            setError('Unable to sign out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {!user ? (
                <View style={styles.authCard}>
                    <Text style={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</Text>
                    <Text style={styles.subtitle}>
                        {mode === 'login' ? 'Sign in to manage your todo lists.' : 'Create an account to get started.'}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    {message ? <Text style={styles.successText}>{message}</Text> : null}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError(null);
                            setMessage(null);
                        }}
                    >
                        <Text style={styles.secondaryButtonText}>{mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.authCard}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>{user.email}</Text>
                    {message ? <Text style={styles.successText}>{message}</Text> : null}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {CARDS.map(card => (
                        <TouchableOpacity key={card.screen} style={styles.card} onPress={() => navigate(card.screen)}>
                            <Text style={styles.title}>{card.title}</Text>
                            <Text style={styles.subtitle}>{card.subtitle}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
                        <Text style={styles.secondaryButtonText}>Log out</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' },
    authCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    card: {
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        marginTop: 8,
    },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 12 },
    input: {
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    primaryButton: {
        backgroundColor: '#2563eb',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    primaryButtonText: { color: '#fff', fontWeight: '700' },
    secondaryButton: { marginTop: 12, alignItems: 'center' },
    secondaryButtonText: { color: '#2563eb', fontWeight: '600' },
    errorText: { color: '#b91c1c', marginBottom: 8 },
    successText: { color: '#15803d', marginBottom: 8 },
});
