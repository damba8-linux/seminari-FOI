const loadScript = (FILE_URL, async = true, type = "text/javascript") => {
    return new Promise((resolve, reject) => {
          try {
              const scrElem = document.createElement("script");
              scrElem.type = type;
              scrElem.async = async;
              scrElem.src = FILE_URL;
  
                scrElem.addEventListener("load", ev => {
                    resolve({ status: true });
                });
  
                scrElem.addEventListener("error", ev => {
                    reject({
                        status: false,
                        message: `Failed to load the script ＄{FILE_URL}`
                    });
                });
  
                document.body.appendChild(scrElem);
            } catch (error) {
                reject(error);
              }
          });
    };

let skripte = ["lib/jquery-3.6.1.min.js",
               "lib/bootstrap.bundle.min.js"];
let promises = [];

skripte.forEach(function(url) {
    promises.push(loadScript(url));
});

Promise.all(promises)
    .then( data  => {
        console.log("Script loaded successfully", data);
        $("#nav-placeholder").load("nav_menu.html"); //ubacuje meni na vrh html stranice
    })
    .catch( err => {
        console.error(err);
    });

const bootCSS = document.createElement("link");
bootCSS.rel = "stylesheet";
bootCSS.href = "lib/bootstrap.min.css";
document.head.appendChild(bootCSS);