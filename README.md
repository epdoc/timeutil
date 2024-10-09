# @epdoc/timeutil

Contains date and time duration utilities that are not found in [moment.js](https://github.com/moment/moment).

## Date Utilities

Contains methods to generate, from a Date object:

- an ISO date string that uses the local timezone
- the [Julian date](https://en.wikipedia.org/wiki/Julian_day) value
- a date that is suitable for use in Google Sheets
- create a new DateUtil object from a date in the PDF date format
- various methods to work with timezones

```typescript
import { dateUtil } from '@epdoc/timeutil';

const d0 = new Date();
console.log(d0.toLocaleString());
console.log(d0.toISOString());
console.log(dateUtil(d0).toISOLocaleString());
console.log(dateUtil(d0).toISOLocaleString(false));

console.log(dateUtil(d0).julianDate());
console.log(dateUtil(d0).googleSheetsDate());

console.log(dateUtil(d0).format('YYYYMMDD_HHmmss'));
console.log(dateUtil(d0).formatUTC('YYYYMMDD_HHmmss'));
```

Resultant output:

```
11/25/1997, 06:13:14 AM
1997-11-25T12:13:14.456Z
1997-11-25T06:13:14.456-06:00
1997-11-25T06:13:14-06:00'
2450778
35759.25918981482
19971125_061314
19971125_121314
```

## Duration Utilities

Contains methods to generate a duration string from a number of milliseconds.

```typescript
import { dateUtil } from '@epdoc/timeutil';

// Run
console.log(durationUtil(-4443454).options('long').format());
console.log(durationUtil(-4443454).format());
console.log(durationUtil(3454, 'hms').format());
console.log(durationUtil(982440990, ':').format({ ms: false }));
// Useful when generating audible messages
console.log(
  durationUtil(982442990, 'long').options({ sep: ' ', ms: false }).format(),
);
// Same as previous, but use options to turn off both s and ms.
console.log(
  durationUtil(982442990, 'long').options({ sep: ' ', ms: false, s: false })
    .format(),
);
```

Resultant output:

```
1 hour, 14 minutes, 3 seconds, 454 milliseconds
1:14:03.454
3.454s
11d08:54:01
11 days 8 hours 54 minutes 2 seconds
11 days 8 hours 54 minutes
```
