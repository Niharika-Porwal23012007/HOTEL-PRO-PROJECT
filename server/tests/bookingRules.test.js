import test from 'node:test';
import assert from 'node:assert/strict';
import { BookingService } from '../src/services/bookingService.js';

test('BookingService.calculateNights - correctly computes night count', () => {
  const checkIn = '2026-12-10';
  const checkOut = '2026-12-12';
  const nights = BookingService.calculateNights(checkIn, checkOut);
  assert.equal(nights, 2, 'Stay from 10 to 12 Dec must be exactly 2 nights (BR-02)');
});

test('BookingService.calculateRefund - > 48 hours gives 100% refund (BR-05)', () => {
  const futureCheckIn = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours away
  const mockBooking = {
    checkIn: futureCheckIn,
    priceBreakdown: { totalAmount: 10000 },
  };

  const refund = BookingService.calculateRefund(mockBooking);
  assert.equal(refund.refundPercentage, 100);
  assert.equal(refund.refundAmount, 10000);
});

test('BookingService.calculateRefund - 24 to 48 hours gives 50% refund (BR-05)', () => {
  const checkIn30h = new Date(Date.now() + 30 * 60 * 60 * 1000); // 30 hours away
  const mockBooking = {
    checkIn: checkIn30h,
    priceBreakdown: { totalAmount: 10000 },
  };

  const refund = BookingService.calculateRefund(mockBooking);
  assert.equal(refund.refundPercentage, 50);
  assert.equal(refund.refundAmount, 5000);
});

test('BookingService.calculateRefund - < 24 hours gives 0% refund (BR-05)', () => {
  const checkIn10h = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours away
  const mockBooking = {
    checkIn: checkIn10h,
    priceBreakdown: { totalAmount: 10000 },
  };

  const refund = BookingService.calculateRefund(mockBooking);
  assert.equal(refund.refundPercentage, 0);
  assert.equal(refund.refundAmount, 0);
});

test('BookingService.generateReference - format conforms to HP-YYYY-XXXXXX', () => {
  const ref = BookingService.generateReference();
  const year = new Date().getFullYear();
  assert.match(ref, new RegExp(`^HP-${year}-\\d{6}$`));
});
