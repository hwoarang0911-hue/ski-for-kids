/**
 * 결제 추상화. 프로바이더만 교체하면 결제 수단을 바꿀 수 있다.
 * 기본은 모의 결제(mock), VITE_TOSS_CLIENT_KEY 설정 시 토스페이먼츠.
 */

export interface PayRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
}

export type PayOutcome = 'paid' | 'failed' | 'cancelled';

export interface PayResult {
  ok: boolean;
  outcome: PayOutcome;
  /** 결제 식별자(승인 키 등) */
  payId?: string;
  message?: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** 결제창을 띄우고 결과를 반환. 사용자가 닫으면 outcome='cancelled' */
  pay(req: PayRequest): Promise<PayResult>;
}
