import { expect } from 'jsr:@std/expect';
import { describe, it } from 'jsr:@std/testing/bdd';
import * as Duration from '../lib/duration-types.ts';
import { DurationUtil } from '../mod.ts';
describe('duration-util', () => {
  describe('digital', () => {
    it('defaults', () => {
      expect(new DurationUtil().format(-4443454)).toEqual('1:14:03.454');
      expect(new DurationUtil().format(-4443454)).toEqual('1:14:03.454');
      expect(new DurationUtil().format(968588820)).toEqual('11d05:03:08.820');
      expect(new DurationUtil().format(982440990)).toEqual('11d08:54:00.990');
      expect(new DurationUtil().format(982440990)).toEqual('11d08:54:00.990');
      expect(new DurationUtil().options().format(982440990)).toEqual('11d08:54:00.990');
      expect(new DurationUtil().format(3454)).toEqual('00:03.454');
      expect(new DurationUtil().format(455)).toEqual('00:00.455');
      expect(new DurationUtil().format(1)).toEqual('00:00.001');
      expect(new DurationUtil().format(0)).toEqual('00:00.000');
    });
    // it('overrides', () => {
    //   expect(new DurationUtil(982440990).options(':').options({ ms: false }).format()).toEqual('11d08:54:01');
    //   expect(new DurationUtil(3454).options({ decimal: ',' }).format()).toEqual('0:03,454');
    // });
    it('fractionalDigits', () => {
      let n = 3454.345898;
      expect(new DurationUtil().digital.format(n)).toEqual('00:03.454');
      expect(new DurationUtil().digital.fractionalDigits(6).format(n)).toEqual('00:03.454345');
      expect(new DurationUtil().digital.fractionalDigits(9).format(n)).toEqual('00:03.454345898');
      expect(new DurationUtil().digital.fractionalDigits(7).format(n)).toEqual('00:03.4543458');
      expect(new DurationUtil().digital.fractionalDigits(1).format(n)).toEqual('00:03.4');
      expect(new DurationUtil().digital.fractionalDigits(2).format(n)).toEqual('00:03.45');
      n += 3 * Duration.TIME.minutes;
      expect(new DurationUtil().digital.fractionalDigits(6).format(n)).toEqual('03:03.454345');
      expect(new DurationUtil().digital.fractionalDigits(9).format(n)).toEqual('03:03.454345898');
      expect(new DurationUtil().digital.fractionalDigits(7).format(n)).toEqual('03:03.4543458');
      expect(new DurationUtil().digital.fractionalDigits(1).format(n)).toEqual('03:03.4');
      expect(new DurationUtil().digital.fractionalDigits(2).format(n)).toEqual('03:03.45');
    });
  });
  describe('narrow', () => {
    it('defaults', () => {
      expect(new DurationUtil().narrow.format(-4443454)).toEqual('1h14m03.454s');
      expect(new DurationUtil().narrow.format(968588820)).toEqual('11d05h03m08.820s');
      expect(new DurationUtil().narrow.format(982440990)).toEqual('11d08h54m00.990s');
      expect(new DurationUtil().narrow.format(3454)).toEqual('3.454s');
      expect(new DurationUtil().narrow.format(455)).toEqual('0.455s');
      expect(new DurationUtil().narrow.format(1)).toEqual('0.001s');
      expect(new DurationUtil().narrow.format(0)).toEqual('0.000s');
    });
    it('fractionalDigits', () => {
      let n = 3454.345898;
      expect(new DurationUtil().narrow.format(n)).toEqual('3.454s');
      expect(new DurationUtil().narrow.fractionalDigits(6).format(n)).toEqual('3.454345s');
      expect(new DurationUtil().narrow.fractionalDigits(9).format(n)).toEqual('3.454345898s');
      expect(new DurationUtil().narrow.fractionalDigits(7).format(n)).toEqual('3.4543458s');
      expect(new DurationUtil().narrow.fractionalDigits(1).format(n)).toEqual('3.4s');
      expect(new DurationUtil().narrow.fractionalDigits(2).format(n)).toEqual('3.45s');
      n += 3 * Duration.TIME.minutes;
      expect(new DurationUtil().narrow.fractionalDigits(9).format(n)).toEqual('3m03.454345898s');
      expect(new DurationUtil().narrow.fractionalDigits(7).format(n)).toEqual('3m03.4543458s');
      expect(new DurationUtil().narrow.fractionalDigits(1).format(n)).toEqual('3m03.4s');
      n += 8 * Duration.TIME.hours;
      expect(new DurationUtil().narrow.fractionalDigits(9).format(n)).toEqual('8h03m03.454345898s');
      expect(new DurationUtil().narrow.fractionalDigits(7).format(n)).toEqual('8h03m03.4543458s');
      expect(new DurationUtil().narrow.fractionalDigits(1).format(n)).toEqual('8h03m03.4s');
    });
  });
  describe('long', () => {
    it('defaults', () => {
      expect(new DurationUtil().long.format(-4443454)).toEqual(
        '1 hour, 14 minutes, 3 seconds, 454 milliseconds'
      );
    });
    it('fractionalDigits', () => {
      let n = 3454.345898;
      const formatter = new DurationUtil().long;
      expect(formatter.digits(9).format(n)).toEqual(
        '3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(8).format(n)).toEqual(
        '3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(3).format(n)).toEqual('3 seconds, 454 milliseconds');
      expect(formatter.digits(6).format(n)).toEqual('3 seconds, 454 milliseconds, 345 microseconds');
      expect(formatter.digits(7).format(n)).toEqual(
        '3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(1).format(n)).toEqual('3 seconds, 454 milliseconds');
      expect(formatter.digits(2).format(n)).toEqual('3 seconds, 454 milliseconds');
      n += 3 * Duration.TIME.minutes;
      expect(formatter.digits(9).format(n)).toEqual(
        '3 minutes, 3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(7).format(n)).toEqual(
        '3 minutes, 3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(1).format(n)).toEqual('3 minutes, 3 seconds, 454 milliseconds');
      n += 8 * Duration.TIME.hours;
      expect(formatter.digits(9).format(n)).toEqual(
        '8 hours, 3 minutes, 3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(7).format(n)).toEqual(
        '8 hours, 3 minutes, 3 seconds, 454 milliseconds, 345 microseconds, 898 nanoseconds'
      );
      expect(formatter.digits(1).format(n)).toEqual('8 hours, 3 minutes, 3 seconds, 454 milliseconds');
    });
  });
  describe('short', () => {
    it('defaults', () => {
      expect(new DurationUtil().short.format(-4443454)).toEqual('1 hr 14 min 3 sec 454 ms');
    });
    it('fractionalDigits', () => {
      let n = 3454.345898;
      const formatter = new DurationUtil().short;
      expect(formatter.digits(9).format(n)).toEqual('3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(8).format(n)).toEqual('3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(3).format(n)).toEqual('3 sec 454 ms');
      expect(formatter.digits(6).format(n)).toEqual('3 sec 454 ms 345 μs');
      expect(formatter.digits(7).format(n)).toEqual('3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(1).format(n)).toEqual('3 sec 454 ms');
      expect(formatter.digits(2).format(n)).toEqual('3 sec 454 ms');
      n += 3 * Duration.TIME.minutes;
      expect(formatter.digits(9).format(n)).toEqual('3 min 3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(7).format(n)).toEqual('3 min 3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(1).format(n)).toEqual('3 min 3 sec 454 ms');
      n += 8 * Duration.TIME.hours;
      expect(formatter.digits(9).format(n)).toEqual('8 hr 3 min 3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(7).format(n)).toEqual('8 hr 3 min 3 sec 454 ms 345 μs 898 ns');
      expect(formatter.digits(1).format(n)).toEqual('8 hr 3 min 3 sec 454 ms');
    });
  });
  describe('general', () => {
    it('separator', () => {
      let n = 3454.345898;
      const formatter = new DurationUtil().long;
      expect(formatter.digits(9).separator('; ').format(n)).toEqual(
        '3 seconds; 454 milliseconds; 345 microseconds; 898 nanoseconds'
      );
      expect(formatter.short.digits(3).separator(':').format(n)).toEqual('3 sec:454 ms');
    }); 
  });
});