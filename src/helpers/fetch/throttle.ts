function throttle(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds);
  });
}

function logFetch(url) {
  console.log(`Throttle fetch ${url}`);
}

export function throttleFetcher(fetcherInstance) {
  const throttleFunction = () => throttle(1000);

  return {
    async del() {
      await throttleFunction();
      logFetch(...args);
      return fetcherInstance.del(...args);
    },
    async get(...args) {
      await throttleFunction();
      logFetch(...args);
      return fetcherInstance.get(...args);
    },
    async patch() {
      await throttleFunction();
      logFetch(...args);
      return fetcherInstance.patch(...args);
    },
    async post(...args) {
      await throttleFunction();
      logFetch(...args);
      return fetcherInstance.post(...args);
    },
    async pull() {
      await throttleFunction();
      logFetch(...args);
      return fetcherInstance.pull(...args);
    },
  };
}
