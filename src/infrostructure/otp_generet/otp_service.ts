// otp.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OtpService {
  private eskizApiUrl = 'https://api.eskiz.uz/v1/sms/send';
  private eskizApiToken = 'YOUR_ESKIZ_TOKEN_HERE';

  async sendOtp(phoneNumber: string, otp: string) {

    const payload = {
      mobile_phone: phoneNumber,
      message: `Sizning OTP kodingiz: ${otp}`,
      from: '4546',
    };

    const headers = {
      Authorization: `Bearer ${this.eskizApiToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(this.eskizApiUrl, payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
