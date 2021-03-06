
// NOTE CSD - controller stored data
const CSD_REDUCER_PATH = 'controller';

// NOTE specific reducer action types
const TYPE = (prefix => ({
  ADD: `${prefix}ADD`,
  CLEAR: `${prefix}CLEAR`,
  UPDATE: `${prefix}UPDATE`,
  REMOVE: `${prefix}REMOVE`,
  // NOTE addition layer for inner information
  META: `${prefix}META`,
}))('@CSD-store/');

// ACTIONS
export const clearCSDAction = (name: string) => ({ type: TYPE.CLEAR, payload: { name } });
export const removeCSDAction = (name: string) => ({ type: TYPE.REMOVE, payload: { name } });
export const createCSDAction = (name: string, initial: any) => ({ type: TYPE.ADD, payload: { name, initial } });
export const updateCSDAction = (name: string, data: any) => ({ type: TYPE.UPDATE, payload: { name, data } });
export const updateCSDMetaAction = (name: string, data: any) => ({ type: TYPE.META, payload: { name, data } });

export const clearCSD = (name: string) => () => clearCSDAction(name);
export const updateCSD = (name: string) => (data: any) => updateCSDAction(name, data);

// SELECTOR
const selector = (state: any) => state?.[CSD_REDUCER_PATH];
export const selectCSD = (name: string) => (state: any) => selector(state)?.[name] || {};
export const selectMetaCSD = (name: string) => (state: any) => selector(state)?.META?.[name] || {};

// REDUCER
export const reducer = (state: any = {}, action: { type: string, payload: any }) => {
  // NOTE "name" it's required unique identifier for dynamic reducers
  const { type, payload = {} } = action;
  // NOTE Data from the payload
  const name = payload?.name;
  const data = payload?.data;
  const initial = payload?.initial;
  // NOTE Data from the store
  const current = state?.name || {};
  const currentMeta = state?.META?.[name] || {};
  const currentInitial = state?.META?.[name]?.initial || {};

  switch (type) {
    default: return state;
    case TYPE.REMOVE:
      // NOTE remove dynamic reducer
      return { ...state, [name]: null, META: { ...state.META, [name]: { ...currentMeta, initial: null } } };
    case TYPE.CLEAR:
      // NOTE bring dynamic reducer state to initial values
      return { ...state, [name]: { ...currentInitial } };
    case TYPE.ADD:
      // NOTE initialize new dynamic reducer
      return { ...state, [name]: { ...initial }, META: { ...state.META, [name]: { ...currentMeta, initial } } };
    case TYPE.UPDATE:
      // NOTE most used action for dynamic reducers
      return { ...state, [name]: { ...current, ...data } };
    case TYPE.META:
      // NOTE internal controller information
      return { ...state, META: { ...state.META, [name]: { ...currentMeta, ...data } } };
  }
};
