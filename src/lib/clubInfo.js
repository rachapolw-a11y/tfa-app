// Academy constants used by the parent surface (PromptPay, contact, fees).
// Replace with a Firestore-backed `settings` doc once a coach-side settings
// UI exists.

export const CLUB = {
  name: 'The Football Academy',
  coachName: 'Coach Rachapol',
  // LINE contact — opens in the LINE app on mobile, web fallback elsewhere.
  lineId: '@tfa-academy',
  lineUrl: 'https://line.me/R/ti/p/@tfa-academy',
  // PromptPay — phone number registered with the academy bank account.
  promptPay: {
    accountName: 'Rachapol Witayanont or รัชพล วิทยานนท์',
    phone: '086-611-1599',
  },
  termFee: 1500,
  termFeeCurrency: '฿',
  termDueLabel: 'due 30 Jun',
}
