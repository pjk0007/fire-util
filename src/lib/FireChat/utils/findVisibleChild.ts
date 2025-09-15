export const findVisibleChild = (parent: Element): HTMLElement | null => {
  const children = Array.from(parent.querySelectorAll('[id^="message-"]')) as HTMLDivElement[];

  for (const child of children) {
    const rect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Check if the child is visible within the parent
    if (
      rect.top >= parentRect.top &&
      rect.bottom <= parentRect.bottom // Fully visible
    ) {
      return child;
    }
  }

  return null; // No visible child found
};
