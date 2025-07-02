// numberUtils.test.ts

import { describe, expect, it } from 'vitest';
import { isNumericString, safeNumber } from './number.utils.ts';

describe('isNumericString', () => {
  it('should return true for numeric strings', () => {
    expect(isNumericString('42')).toBe(true);
    expect(isNumericString('3.14')).toBe(true);
    expect(isNumericString('-10')).toBe(true);
    expect(isNumericString('0')).toBe(true);
    expect(isNumericString('1e4')).toBe(true); // scientific notation
    expect(isNumericString('   5   ')).toBe(true); // with whitespace
  });

  it('should return false for non-numeric strings', () => {
    expect(isNumericString('abc')).toBe(false);
    expect(isNumericString('123abc')).toBe(false);
    expect(isNumericString('')).toBe(false);
    expect(isNumericString(' ')).toBe(false);
    expect(isNumericString('NaN')).toBe(false);
    expect(isNumericString('Infinity')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNumericString(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isNumericString(null)).toBe(false);
  });
});

describe('safeNumber', () => {
  it('should return the same number if input is a number', () => {
    expect(safeNumber(42)).toBe(42);
    expect(safeNumber(0)).toBe(0);
    expect(safeNumber(-100)).toBe(-100);
  });

  it('should convert valid numeric strings to numbers', () => {
    expect(safeNumber('42')).toBe(42);
    expect(safeNumber('3.14')).toBe(3.14);
    expect(safeNumber('-10')).toBe(-10);
    expect(safeNumber('1e2')).toBe(100);
    expect(safeNumber('   7.7   ')).toBe(7.7);
  });

  it('should return default value for invalid input', () => {
    expect(safeNumber('abc')).toBe(-1);
    expect(safeNumber('')).toBe(-1);
    expect(safeNumber(undefined)).toBe(-1);
    expect(safeNumber('NaN')).toBe(-1);
    expect(safeNumber('Infinity')).toBe(-1);
  });

  it('should allow custom default return value', () => {
    expect(safeNumber('abc', 0)).toBe(0);
    expect(safeNumber(undefined, 999)).toBe(999);
    expect(safeNumber('fail', -100)).toBe(-100);
  });

  it('should return default value for null', () => {
    expect(safeNumber(null)).toBe(-1);
    expect(safeNumber(null, 123)).toBe(123);
  });
});
