/**
 * 모의 결제 프로바이더 — 기본값(무설정).
 * 실제 승인 없이 성공을 반환한다. 데모·개발용.
 */
import type { PaymentProvider, PayRequest, PayResult } from './provider';

export const mockPaymentProvider: PaymentProvider = {
  name: 'mock',
  async pay(req: PayRequest): Promise<PayResult> {
    // 승인 지연 시뮬레이션
    await new Promise((r) => setTimeout(r, 600));
    return {
      ok: true,
      outcome: 'paid',
      payId: `mock_${req.orderId}`,
      message: '모의 결제 승인',
    };
  },
};
