import moment from 'moment';

export function dateFormat(value: Date | string | null | undefined, format: string) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    value = value.trim();
    if (value === '') {
      return '';
    }
    const m = moment(value);
    if (!m.isValid()) {
      return '';
    }
    return m.format(format);
  }

  return moment(value).format(format);
}

export function fromNow(value: Date | string | null | undefined) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    value = value.trim();
    if (value === '') {
      return '';
    }
    const m = moment(value);
    if (!m.isValid()) {
      return '';
    }
    return m.fromNow();
  }

  return moment(value).fromNow();
}
