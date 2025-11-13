import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

let pendingNavigation: { name: string; params?: object } | null = null;

export function navigate(name: string, params?: object) {
    if (navigationRef.isReady()) {
        console.log('📍 Navigating to:', name);
        navigationRef.navigate(name as never, params as never);
    } else {
        console.log('⚠️ Navigation not ready yet. Queuing navigation...');
        pendingNavigation = { name, params }
    }
}

export function setPendingNavigation(name: string, params?: object) {
    console.log('📝 Setting pending navigation:', name);
    pendingNavigation = { name, params }
}

export function executePendingNavigation() {
    if (pendingNavigation && navigationRef.isReady()) {
        console.log('Executing pending navigation', pendingNavigation.name);
        const { name, params } = pendingNavigation;
        pendingNavigation = null;
        navigate(name, params);
    }
}