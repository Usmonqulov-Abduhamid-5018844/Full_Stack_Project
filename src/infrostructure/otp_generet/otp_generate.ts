import { totp } from 'otplib';
totp.options = { step: 120, window: 1 };
export class OtpGenerate {
  Generate(secret: string) {
    return totp.generate(secret);
  }

  verify(secret: string, otp: string) {
    return totp.check(otp, secret);
  }
}
