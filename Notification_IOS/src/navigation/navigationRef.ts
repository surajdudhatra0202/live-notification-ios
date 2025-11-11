import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    } else {
        console.log('⚠️ Navigation not ready yet. Queuing navigation...');
        pendingNavigation = { name, params }
    }
}