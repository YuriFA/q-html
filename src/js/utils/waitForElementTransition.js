const getCssPropUnitMap = v => {
  v = v.trim();
  const numParts = v.match('[0-9.]+');
  let unit = 'ms';
  let num;
  const numString = numParts ? numParts[0] : '';
  if (numString) {
    unit = v.split(numString)[1];
    num = Number(numString);
  }
  return {
    num,
    unit,
  };
};

const convertCssTimeValueToMilliseconds = val => {
  const map = getCssPropUnitMap(val);
  const num = map ? map.num : undefined;
  if (!num) {
    return '';
  }
  const unit = val.replace(num + '', '');
  let value = num;
  if (unit === 's') {
    value = num * 1000;
  }
  return value + 'ms';
};

function getTransitionDuration(el) {
  const getJsPropName = cssProp => {
    // convert to camelCase
    return cssProp.replace(/-([a-z])/g, letter => {
      return letter[1].toUpperCase();
    });
  };

  const getCssComputedProperty = prop => {
    const style = window.getComputedStyle(el);
    return style.getPropertyValue(prop) || el.style[getJsPropName(prop)];
  };

  const delayProp = getCssComputedProperty('transition-delay') || '0ms';
  const durationProp = getCssComputedProperty('transition-duration') || '0ms';
  const times = Array.isArray(durationProp) ? durationProp : [durationProp];
  const delay = Array.isArray(delayProp) ? delayProp : [delayProp];
  let highest = 0;
  let map;

  times.push.apply(times, delay); // account for delay

  // calculate highest number of time
  times.forEach(value => {
    value.split(',').forEach(v => {
      v = convertCssTimeValueToMilliseconds(v);
      map = getCssPropUnitMap(v);
      if (map.num && map.num > highest) {
        highest = map.num;
      }
    });
  });

  return highest;
}

export function waitForElementTransition(el) {
  const duration = getTransitionDuration(el);
  return new Promise(resolve => {
    if (duration > 0) {
      setTimeout(() => {
        resolve(el);
      }, duration);
    } else {
      resolve(el);
    }
  });
}
