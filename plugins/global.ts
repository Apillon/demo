import moment from 'moment';
import Vue from 'vue';

Vue.filter('formatDate', (value: string) => {
  if (!value) {
    return value;
  }

  const time = moment(String(value));

  if (!time.isValid()) {
    return value;
  }

  return time.format('MM/DD/YYYY HH:mm');
});
