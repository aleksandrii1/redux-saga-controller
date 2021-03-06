
// outsource dependencies
import { Action } from 'redux';
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';

// local dependencies
import { Controller } from './controller';
import { updateCSDMetaAction } from './reducer';

interface ControllerAction<T extends string, I> extends Action{
  payload: {
    controller: Controller<T, I>
  }
}

// NOTE specific saga action types to subscribe and unsubscribe controller by annotation
const TYPE = (prefix => ({
  SUBSCRIBE: `${prefix}SUBSCRIBE`,
  UNSUBSCRIBE: `${prefix}UNSUBSCRIBE`,
}))('@CSD-action/');

export const subscribeAction = <T extends string, I> (controller: Controller<T, I>) => ({
  type: TYPE.SUBSCRIBE,
  payload: { controller },
});

function * subscribeSaga <T extends string, I> ({ payload: { controller } } : ControllerAction<T, I>) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
  // );
  controller.channel = yield fork(controller.subscriber);
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction(controller.name, { connected: true }));
}

export const unsubscribeAction = <T extends string, I> (controller: Controller<T, I>) => ({
  type: TYPE.UNSUBSCRIBE,
  payload: { controller },
});

function * unsubscribeSaga <T extends string, I> ({ payload: { controller } } : ControllerAction<T, I>) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
  // );
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction(controller.name, { connected: false }));
  yield cancel(controller.channel);
  controller.channel = null;
}

export function * sagas () {
  yield takeEvery(TYPE.SUBSCRIBE, subscribeSaga);
  yield takeEvery(TYPE.UNSUBSCRIBE, unsubscribeSaga);
}
