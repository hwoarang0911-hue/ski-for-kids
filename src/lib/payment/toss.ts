/**
 * 토스페이먼츠 프로바이더 — 라이브 결제.
 * 활성 조건: VITE_TOSS_CLIENT_KEY. 실제 승인(confirm)은 시크릿 키를 쥔
 * 서버가 해야 하므로 VITE_TOSS_CONFIRM_URL(서버 엔드포인트)도 필요하다.
 *
 * 흐름: SDK 로드 → requestPayment(결제창) → 성공 시 paymentKey 수신 →
 *      서버(confirm URL)로 승인 요청 → 최종 결과.
 * 서버 confirm 없이 클라이언트만으로는 실제 결제를 확정할 수 없다(보안).
 */
import type { PaymentProvider, PayRequest, PayResult } from './provider';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string | undefined;
const CONFIRM_URL = (import.meta.env as Record<string, string | undefined>).VITE_TOSS_CONFIRM_URL;

export const tossConfigured = Boolean(CLIENT_KEY);

let sdkPromise: Promise<any> | null = null;
function loadSdk(): Promise<any> {
  if ((window as any).TossPayments) return Promise.resolve((window as any).TossPayments);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://js.tosspayments.com/v1/payment';
    s.onload = () => resolve((window as any).TossPayments);
    s.onerror = () => reject(new Error('토스 SDK 로드 실패'));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export const tossPaymentProvider: PaymentProvider = {
  name: 'toss',
  async pay(req: PayRequest): Promise<PayResult> {
    try {
      const TossPayments = await loadSdk();
      const toss = TossPayments(CLIENT_KEY);
      // 결제창 호출 — 성공 시 successUrl로 리다이렉트되며 쿼리로 키가 전달된다.
      await toss.requestPayment('카드', {
        amount: req.amount,
        orderId: req.orderId,
        orderName: req.orderName,
        customerName: req.customerName,
        successUrl: `${window.location.origin}${window.location.pathname}?pay=success`,
        failUrl: `${window.location.origin}${window.location.pathname}?pay=fail`,
      });
      // 리다이렉트되므로 이 지점 이후는 실행되지 않는 것이 정상.
      return { ok: false, outcome: 'cancelled' };
    } catch (e: any) {
      if (e?.code === 'USER_CANCEL') return { ok: false, outcome: 'cancelled' };
      return { ok: false, outcome: 'failed', message: e?.message ?? '결제 실패' };
    }
  },
};

/**
 * 리다이렉트 복귀 후 서버로 승인 요청(참고 구현).
 * 서버(CONFIRM_URL)가 시크릿 키로 /v1/payments/confirm 을 호출해야 한다.
 */
export async function confirmToss(paymentKey: string, orderId: string, amount: number): Promise<PayResult> {
  if (!CONFIRM_URL) return { ok: false, outcome: 'failed', message: 'confirm 서버 미설정' };
  const res = await fetch(CONFIRM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  if (!res.ok) return { ok: false, outcome: 'failed', message: `confirm ${res.status}` };
  const data = await res.json();
  return { ok: true, outcome: 'paid', payId: data.paymentKey ?? paymentKey };
}
