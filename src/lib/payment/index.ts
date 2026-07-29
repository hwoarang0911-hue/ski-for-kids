/**
 * 결제 프로바이더 선택 지점.
 * VITE_TOSS_CLIENT_KEY 가 있으면 토스페이먼츠, 없으면 모의 결제.
 */
import type { PaymentProvider } from './provider';
import { mockPaymentProvider } from './mock';
import { tossPaymentProvider, tossConfigured } from './toss';

export const payment: PaymentProvider = tossConfigured ? tossPaymentProvider : mockPaymentProvider;

/** UI 배지용 — 실결제 여부 */
export const isLivePayment = tossConfigured;

export type { PayRequest, PayResult, PayOutcome, PaymentProvider } from './provider';
