'use strict';

var { DateTime } = require('luxon');

CronDate.prototype.addYear = function() {
  this._date = this._date.plus({ years: 1 });
};

CronDate.prototype.addMonth = function() {
  this._date = this._date.plus({ months: 1 }).startOf('month');
};

CronDate.prototype.addDay = function() {
  this._date = this._date.plus({ days: 1 }).startOf('day');
};

CronDate.prototype.addHour = function() {
  var prev = this.getTime();
  this._date = this._date.plus({ hours: 1 }).startOf('hour');
  if (this.getTime() <= prev) {
    this._date = this._date.plus({ hours: 1 });
  }
};

CronDate.prototype.addMinute = function() {
  var prev = this.getTime();
  this._date = this._date.plus({ minutes: 1 }).startOf('minute');
  if (this.getTime() < prev) {
    this._date = this._date.plus({ hours: 1 });
  }
};

CronDate.prototype.addSecond = function() {
  var prev = this.getTime();
  this._date = this._date.plus({ seconds: 1 }).startOf('second');
  if (this.getTime() < prev) {
    this._date = this._date.plus({ hours: 1 });
  }
};

CronDate.prototype.subtractYear = function() {
  this._date = this._date.minus({ years: 1 });
};

CronDate.prototype.subtractMonth = function() {
  this._date = this._date.minus({ months: 1 }).endOf('month');
};

CronDate.prototype.subtractDay = function() {
  this._date = this._date.minus({ days: 1 }).endOf('day');
};

CronDate.prototype.subtractHour = function() {
  var prev = this.getTime();
  this._date = this._date.minus({ hours: 1 }).endOf('hour');
  if (this.getTime() >= prev) {
    this._date = this._date.minus({ hours: 1 });
  }
};

CronDate.prototype.subtractMinute = function() {
  var prev = this.getTime();
  this._date = this._date.minus({ minutes: 1 }).endOf('minute');
  if (this.getTime() > prev) {
    this._date = this._date.minus({ hours: 1 });
  }
};

CronDate.prototype.subtractSecond = function() {
  var prev = this.getTime();
  this._date = this._date.minus({ seconds: 1 }).startOf('second');
  if (this.getTime() > prev) {
    this._date = this._date.minus({ hours: 1 });
  }
};

CronDate.prototype.getDate = function() {
  return this._date.day;
};

CronDate.prototype.getFullYear = function() {
  return this._date.year;
};

CronDate.prototype.getDay = function() {
  var { weekday } = this._date;
  return weekday === 7 ? 0 : weekday;
};

CronDate.prototype.getMonth = function() {
  return this._date.month - 1;
};

CronDate.prototype.getHours = function() {
  return this._date.hour;
};

CronDate.prototype.getMinutes = function() {
  return this._date.minute;
};

CronDate.prototype.getSeconds = function() {
  return this._date.second;
};

CronDate.prototype.getMilliseconds = function() {
  return this._date.millisecond;
};

CronDate.prototype.getTime = function() {
  return this._date.valueOf();
};

CronDate.prototype.getUTCDate = function() {
  return this._getUTC().day;
};

CronDate.prototype.getUTCFullYear = function() {
  return this._getUTC().year;
};

CronDate.prototype.getUTCDay = function() {
  var { weekday } = this._getUTC();
  return weekday === 7 ? 0 : weekday;
};

CronDate.prototype.getUTCMonth = function() {
  return this._getUTC().month - 1;
};

CronDate.prototype.getUTCHours = function() {
  return this._getUTC().hour;
};

CronDate.prototype.getUTCMinutes = function() {
  return this._getUTC().minute;
};

CronDate.prototype.getUTCSeconds = function() {
  return this._getUTC().second;
};

CronDate.prototype.toISOString = function() {
  return this._date.toISO();
};

CronDate.prototype.toJSON = function() {
  return JSON.stringify(this._date.toObject());
};

CronDate.prototype.setDate = function(d) {
  this._date = this._date.set({ day: d });
};

CronDate.prototype.setFullYear = function(y) {
  this._date = this._date.set({ year: y });
};

CronDate.prototype.setDay = function(d) {
  this._date = this._date.set({ weekday: d === 7 ? 0 : d });
};

CronDate.prototype.setMonth = function(m) {
  this._date = this._date.set({ month: m + 1 });
};

CronDate.prototype.setHours = function(h) {
  this._date = this._date.set({ hour: h });
};

CronDate.prototype.setMinutes = function(m) {
  this._date = this._date.set({ minute: m });
};

CronDate.prototype.setSeconds = function(s) {
  this._date = this._date.set({ second: s });
};

CronDate.prototype.setMilliseconds = function(s) {
  this._date = this._date.set({ millisecond: s });
};

CronDate.prototype.getTime = function() {
  return this._date.valueOf();
};

CronDate.prototype._getUTC = function() {
  return this._date.toUTC();
};

CronDate.prototype.toString = function() {
  return this._date.toString();
};

CronDate.prototype.toDate = function() {
  return this._date.toJSDate();
};

function CronDate (timestamp, tz) {
  if (!timestamp) {
    this._date = DateTime.utc()
  } else if (timestamp instanceof CronDate) {
    this._date = timestamp._date;
    // this is so we don't possibly reinitialize an ambiguous time
    // fixes Due to DST end in Athens (4-->3) test
    if (this._date.zone && this._date.zone.zoneName === tz) return
  } else if (timestamp instanceof Date) {
    this._date = DateTime.fromJSDate(timestamp)
  } else if (Array.isArray(timestamp)) {
    this._date = DateTime.local(...timestamp)
  } else if (typeof timestamp === "object") {
    this._date = DateTime.fromObject(timestamp)
  } else if (typeof timestamp === "number") {
    this._date = DateTime.fromMillis(timestamp)
  } else if (typeof timestamp === "string") {
    this._date = DateTime.fromISO(timestamp)
    this._date.isValid || (this._date = DateTime.fromRFC2822(timestamp))
    this._date.isValid || (this._date = DateTime.fromFormat(timestamp, "yyyy-MM-dd HH:mm:ss"))
    this._date.isValid || (this._date = DateTime.fromFormat(timestamp, "EEE, d MMM yyyy HH:mm:ss"))
    this._date.isValid || (this._date = DateTime.fromFormat(timestamp, "yyyy-MM-d"))
    this._date.isValid || (this._date = DateTime.fromFormat(timestamp, "yyyy-M-dd"))
  }

  if (!this._date || !this._date.isValid) {
    throw new Error("CronDate: unhandled timestamp: " + JSON.stringify(timestamp))
  }

  if (tz) {
    // ideally do this but seems like there is a bug (https://github.com/moment/luxon/issues/648)
    // this._date = this._date.setZone(tz, { keepLocalTime: true })
    this._date = DateTime.fromObject({
      year: this._date.year,
      month: this._date.month,
      day: this._date.day,
      hour: this._date.hour,
      minute: this._date.minute,
      second: this._date.second,
      millisecond: this._date.millisecond,
      zone: tz,
    })
  }
}

module.exports = CronDate;
