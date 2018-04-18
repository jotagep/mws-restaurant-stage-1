if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then(reg => {
        console.log("SW install");
      })
      .catch(err => {
        // reg failed :(
        console.log("SW failed: ", err);
      });
  });
}
