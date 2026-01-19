import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import type {
    SurveyTemplate,
    SurveyResponse,
    FireSurveyTab,
    ResponseFilters,
} from '../settings/types';

interface FireSurveyContextValue {
    // Tab state
    activeTab: FireSurveyTab;
    setActiveTab: (tab: FireSurveyTab) => void;

    // Template selection
    selectedTemplate: SurveyTemplate | null;
    setSelectedTemplate: (template: SurveyTemplate | null) => void;

    // Editing state
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;

    // Response detail
    selectedResponse: SurveyResponse | null;
    setSelectedResponse: (response: SurveyResponse | null) => void;

    // Filter state for responses
    filters: ResponseFilters;
    setFilters: (filters: ResponseFilters) => void;
    updateFilter: <K extends keyof ResponseFilters>(
        key: K,
        value: ResponseFilters[K]
    ) => void;
    clearFilters: () => void;
}

const FireSurveyContext = createContext<FireSurveyContextValue | null>(null);

interface FireSurveyProviderProps {
    children: ReactNode;
    initialTab?: FireSurveyTab;
}

export function FireSurveyProvider({
    children,
    initialTab = 'templates',
}: FireSurveyProviderProps) {
    const [activeTab, setActiveTab] = useState<FireSurveyTab>(initialTab);
    const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
    const [filters, setFilters] = useState<ResponseFilters>({});

    const updateFilter = useCallback(
        <K extends keyof ResponseFilters>(key: K, value: ResponseFilters[K]) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const handleSetActiveTab = useCallback((tab: FireSurveyTab) => {
        setActiveTab(tab);
        // 탭 전환 시 선택 상태 초기화
        if (tab === 'templates') {
            setSelectedResponse(null);
        } else {
            setSelectedTemplate(null);
            setIsEditing(false);
        }
    }, []);

    const handleSetSelectedTemplate = useCallback((template: SurveyTemplate | null) => {
        setSelectedTemplate(template);
        if (!template) {
            setIsEditing(false);
        }
    }, []);

    const value: FireSurveyContextValue = {
        activeTab,
        setActiveTab: handleSetActiveTab,
        selectedTemplate,
        setSelectedTemplate: handleSetSelectedTemplate,
        isEditing,
        setIsEditing,
        selectedResponse,
        setSelectedResponse,
        filters,
        setFilters,
        updateFilter,
        clearFilters,
    };

    return (
        <FireSurveyContext.Provider value={value}>
            {children}
        </FireSurveyContext.Provider>
    );
}

export function useFireSurvey() {
    const context = useContext(FireSurveyContext);
    if (!context) {
        throw new Error('useFireSurvey must be used within a FireSurveyProvider');
    }
    return context;
}
