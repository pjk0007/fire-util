// Components
export { default as AnnotationViewDialog } from './AnnotationViewDialog';
export { default as AnnotationCanvas } from './AnnotationCanvas';
export { default as AnnotationToolbar } from './AnnotationToolbar';
export { default as AnnotationElement } from './AnnotationElement';

// Hooks
export { useDrawingTool } from './hooks';

// Types
export type { DrawingTool, IAnnotationElement } from './types';

// Settings/Constants
export {
    ANNOTATION_LOCALE,
    ANNOTATION_COLORS,
    ANNOTATION_DEFAULT_COLOR,
    DRAWING_TOOLS,
} from './settings';
