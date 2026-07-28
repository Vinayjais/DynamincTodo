import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any) {
    navigationRef.current?.navigate(name as any, params);
}

export function goBack() {
    navigationRef.current?.goBack();
}
