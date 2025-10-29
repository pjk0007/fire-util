import { useRef, useCallback } from 'react';
import { saveSelectionPath, restoreSelectionPath, SelectionPathInfo } from '@/lib/FireEditor/utils/selection';

/**
 * useSelection 훅
 *
 * 이 훅은 에디터 내부의 선택(Selection)과 관련된 작은 추상화를 제공합니다.
 * 주요 역할은 다음과 같습니다:
 * - DOM Range를 '경로(path + offset)' 형태로 직렬화하여 저장
 * - 저장된 경로 정보를 바탕으로 이후에 선택을 복원
 * - 마지막으로 관찰된 Range와 그에 대응하는 client rect를 제공
 *
 * 내부적으로는 `saveSelectionPath`/`restoreSelectionPath` 유틸을 사용하여
 * 선택 위치를 안전하게 직렬화하고 복원합니다.
 */
export function useSelection() {
  // 저장된 선택 경로 정보(직렬화된 형태).
  // 에디터의 루트 노드(root)와 range 정보를 기반으로 생성됩니다.
  const selectionPathRef = useRef<SelectionPathInfo | null>(null);

  // 마지막으로 관찰된 DOM Range를 보존합니다.
  // 이 값은 getSelectionRect 같은 헬퍼에서 사용됩니다.
  const lastRangeRef = useRef<Range | null>(null);

  /**
   * save(root, range)
   * - 주어진 루트 노드와 Range를 바탕으로 선택 정보를 저장합니다.
   * - 내부적으로 range를 selection path로 변환해 `selectionPathRef`에 보관합니다.
   * - 또한 `lastRangeRef`에 원본 Range를 저장하여 rect 계산 등에 사용합니다.
   */
  function save(root: Node, range: Range | null) {
    lastRangeRef.current = range;
    if (!range) return;
    try {
      selectionPathRef.current = saveSelectionPath(root, range);
    } catch (e) {
      console.error('Failed to save selection path:', e);
      // 변환 중 오류가 나면 저장을 포기하고 null로 초기화합니다.
      selectionPathRef.current = null;
    }
  }

  /**
   * restore(root)
   * - 이전에 저장해 둔 selection path가 있다면 이를 이용해 실제 DOM 선택을 복원합니다.
   * - 복원 실패 시 예외를 무시합니다(비파괴적 복원 시도).
   */
  function restore(root: Node) {
    const info = selectionPathRef.current;
    if (!info) return;
    try {
      restoreSelectionPath(root, info);
    } catch (e) {
      console.log('Failed to restore selection path:', e);
      // 복원 실패 시 무시
    }
  }

  /**
   * get()
   * - 직렬화된 selection path 정보를 그대로 반환합니다.
   * - 외부에서 현재 저장된 선택 위치를 확인하고자 할 때 사용합니다.
   */
  function get() {
    return selectionPathRef.current;
  }

  /**
   * getLastRange()
   * - 마지막으로 관찰된 원시 Range 객체를 반환합니다.
   * - 이 Range는 DOM API 호출(예: getBoundingClientRect) 등에 사용될 수 있습니다.
   */
  function getLastRange() {
    return lastRangeRef.current;
  }

  /**
   * getSelectionRect()
   * - 마지막 Range로부터 UI 상의 bounding rect를 계산하여 반환합니다.
   * - collapsed(접혀있는, 즉 커서) 상태인 경우 getBoundingClientRect가 0x0을
   *   반환할 수 있으므로 getClientRects()[0]를 시도해 더 적합한 rect를 얻습니다.
   */
  const getSelectionRect = useCallback((): DOMRect | null => {
    const r = lastRangeRef.current;
    if (!r) return null;
    try {
      const rect = r.getBoundingClientRect();
      if (rect && rect.width === 0 && rect.height === 0) {
        // 접혀있는 선택(커서)인 경우, 시작 위치의 client rect를 시도합니다.
        const clientRects = r.getClientRects();
        if (clientRects && clientRects.length) return clientRects[0];
      }
      return rect;
    } catch (e) {
      console.error('Failed to get selection rect:', e);
      return null;
    }
  }, []);

  // 외부에 노출되는 API
  return { save, restore, get, getLastRange, getSelectionRect };
}
