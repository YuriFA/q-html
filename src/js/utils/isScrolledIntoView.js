import { getElementOffset } from './getElementOffset';

function getElementPosition(element) {
  const docViewTop =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;
  const docViewBottom = docViewTop + window.innerHeight;

  const elemTop = getElementOffset(element).top;
  const elemBottom = elemTop + element.clientHeight;

  return { elemBottom, docViewBottom, elemTop, docViewTop };
}

export function isScrolledIntoCenterView(element) {
  const { elemBottom, docViewBottom, elemTop } = getElementPosition(element);

  return elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
}

export function isScrolledIntoView(element) {
  const { elemBottom, docViewBottom, elemTop, docViewTop } = getElementPosition(
    element,
  );

  return elemBottom <= docViewBottom && elemTop >= docViewTop;
}

export function isScrolledOutOfView(element) {
  const docViewTop =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;

  const elemTop = getElementOffset(element).top;
  const elemBottom = elemTop + element.clientHeight;

  return elemBottom < docViewTop;
}
