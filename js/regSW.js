if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(reg => {
        console.log('ServiceWorker registration successful with scope: ', reg.scope);
      })
      .catch(err => {
        // reg failed :(
        console.log("Service Worker failed: ", err);
      });
  });
}
