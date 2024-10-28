import { lazy as reactLazy } from "react";
const lazy = lazyComponent =>
  reactLazy(() => {
    return new Promise((resolve, reject) =>
      lazyComponent()
        .then(component => resolve(component))
        .catch(err => {
          if (err?.name === "ChunkLoadError") {
            // refresh
            window.location.reload();
            // reject(err)
          } else {
            // handle error
            reject(err);
          }
        })
    );
  });

export default lazy;
