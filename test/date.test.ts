import { DateUtil, dateUtil } from '../src/date-util';

describe('date-util', () => {
  // Test is using CST
  describe('tz statics', () => {
    it('parse', () => {
      expect(DateUtil.tzParse('-06:00')).toEqual(360);
      expect(DateUtil.tzParse('+06:00')).toEqual(-360);
      expect(DateUtil.tzParse('-02:30')).toEqual(150);
      expect(DateUtil.tzParse('+01:00')).toEqual(-60);
      expect(DateUtil.tzParse('+00:00')).toEqual(0);
      expect(DateUtil.tzParse('-00:00')).toEqual(0);
      expect(DateUtil.tzParse('Z')).toEqual(0);
    });
    it('format', () => {
      expect(DateUtil.tzFormat(-360)).toEqual('+06:00');
      expect(DateUtil.tzFormat(360)).toEqual('-06:00');
      expect(DateUtil.tzFormat(-390)).toEqual('+06:30');
      expect(DateUtil.tzFormat(+150)).toEqual('-02:30');
      expect(DateUtil.tzFormat(0)).toEqual('Z');
    });
  });
  describe('tz offset', () => {
    it('120', () => {
      process.env.TZ = 'CST';
      const tz = new Date().getTimezoneOffset();
      expect(tz).toEqual(360);
    });
    it('120', () => {
      const tz = DateUtil.tzFormat(120);
      expect(tz).toEqual('-02:00');
    });
    it('360', () => {
      const tz = DateUtil.tzFormat(360);
      expect(tz).toEqual('-06:00');
    });
    it('-360', () => {
      const tz = DateUtil.tzFormat(-360);
      expect(tz).toEqual('+06:00');
    });
  });
  describe('tz set offset', () => {
    it('30', () => {
      let d = dateUtil();
      d.tz(-30);
      expect(d.getTz()).toEqual(-30);
      d.tz('-05:00');
      expect(d.getTz()).toEqual(300);
    });
  });
  describe('withTz', () => {
    it('local', () => {
      process.env.TZ = 'CST';
      const d: DateUtil = dateUtil(2024, 0, 1, 11, 59, 59, 456).withTz();
      expect(d.toISOLocaleString()).toEqual('2024-01-01T11:59:59.456-06:00');
    });
  });
  describe('toISOLocaleString', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    process.env.TZ = 'CST';
    it('default', () => {
      expect(d.getTimezoneOffset()).toEqual(360);
      expect(d.toISOString()).toEqual('1997-11-25T12:13:14.456Z');
      expect(new DateUtil(d).toISOLocaleString()).toEqual('1997-11-25T06:13:14.456-06:00');
    });
    it('show milliseconds', () => {
      expect(new DateUtil(d).toISOLocaleString(true)).toEqual('1997-11-25T06:13:14.456-06:00');
    });
    it('hide milliseconds', () => {
      expect(new DateUtil(d).toISOLocaleString(false)).toEqual('1997-11-25T06:13:14-06:00');
    });
  });
  describe('toISOLocaleString tz -06:00', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    const du = new DateUtil(d).tz('-06:00');
    it('default', () => {
      expect(d.toISOString()).toEqual('1997-11-25T12:13:14.456Z');
      expect(du.toISOLocaleString()).toEqual('1997-11-25T06:13:14.456-06:00');
    });
    it('show milliseconds', () => {
      expect(du.toISOLocaleString(true)).toEqual('1997-11-25T06:13:14.456-06:00');
    });
    it('hide milliseconds', () => {
      expect(du.toISOLocaleString(false)).toEqual('1997-11-25T06:13:14-06:00');
    });
  });
  describe('toISOLocaleString tz -150', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    const du = new DateUtil(d).tz(-150);
    it('default', () => {
      expect(d.toISOString()).toEqual('1997-11-25T12:13:14.456Z');
      expect(du.toISOLocaleString()).toEqual('1997-11-25T14:43:14.456+02:30');
    });
    it('show milliseconds', () => {
      expect(du.toISOLocaleString(true)).toEqual('1997-11-25T14:43:14.456+02:30');
    });
    it('hide milliseconds', () => {
      expect(du.toISOLocaleString(false)).toEqual('1997-11-25T14:43:14+02:30');
    });
  });
  describe('toISOLocaleString tz 0', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    const du = new DateUtil(d).tz(0);
    it('default', () => {
      expect(d.toISOString()).toEqual('1997-11-25T12:13:14.456Z');
      expect(du.toISOLocaleString()).toEqual('1997-11-25T12:13:14.456Z');
    });
    it('show milliseconds', () => {
      expect(du.toISOLocaleString(true)).toEqual('1997-11-25T12:13:14.456Z');
    });
    it('hide milliseconds', () => {
      expect(du.toISOLocaleString(false)).toEqual('1997-11-25T12:13:14Z');
    });
  });
  it('formatLocale', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    expect(new DateUtil(d).format('YYYY-MM-DD')).toEqual('1997-11-25');
    expect(new DateUtil(d).format('YYYYMMDD')).toEqual('19971125');
    expect(new DateUtil(d).format('YYYYMMDD_HHmmss')).toEqual('19971125_061314');
    expect(new DateUtil(d).formatUTC('YYYYMMDD_HHmmss')).toEqual('19971125_121314');
  });
  it('julianDate', () => {
    var d = new Date('1997-11-25T12:13:14.456Z');
    expect(new DateUtil(d).julianDate()).toEqual(2450778);
  });
  it('googleSheetsDate', () => {
    var d = new Date('1997-11-25T12:13:14Z');
    expect(new DateUtil(d).googleSheetsDate()).toEqual(35759.25918981482);
  });
  describe('fromPdfDate', () => {
    it('CST1', () => {
      process.env.TZ = 'CST';
      let d = DateUtil.fromPdfDate('D:20240101120000-0600');
      expect(d).toBeDefined();
      if (DateUtil.isInstance(d)) {
        expect(d.date.toISOString()).toBe('2024-01-01T18:00:00.000Z');
      }
    });
    it('CST2', () => {
      process.env.TZ = 'CST';
      let d = DateUtil.fromPdfDate('D:20240101120000Z');
      expect(d).toBeDefined();
      if (DateUtil.isInstance(d)) {
        expect(d.date.toISOString()).toBe('2024-01-01T12:00:00.000Z');
        expect(d.toISOLocaleString(false)).toBe('2024-01-01T06:00:00-06:00');
        expect(d.tz(-60).toISOLocaleString(false)).toBe('2024-01-01T13:00:00+01:00');
      }
    });
    it('AST +03:00', () => {
      process.env.TZ = 'AST';
      let d = DateUtil.fromPdfDate('D:20240101120000Z');
      expect(d).toBeDefined();
      if (DateUtil.isInstance(d)) {
        expect(d.date.toISOString()).toBe('2024-01-01T12:00:00.000Z');
        expect(d.tz('+03:00').toISOLocaleString(false)).toBe('2024-01-01T15:00:00+03:00');
      }
    });
  });
});
