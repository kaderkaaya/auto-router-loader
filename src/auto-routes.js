const express = require("express");
const fs = require("fs");
const path = require("path");
const { ApiError } = require("resify-express");

function autoRoutes(routesPath) {
  const router = express.Router();
  const fullPath = path.resolve(process.cwd(), routesPath);
  // burda Projenin çalıştığı klasörü alıp
  //  routesPath ile birleştirerek tam dosya yolunu oluşturuyoruz
  if (!fs.existsSync(fullPath)) {
    throw new ApiError("Routes path not found", 404, {
      code: "ROUTES_PATH_NOT_FOUND",
      description: `Routes path not found: ${fullPath}`,
    });
  }
  loadRoutes(router, fullPath, "");
  //burda bulduğu route'lari router içine ekliyoruz.
  return router;

}

function loadRoutes(router, currentPath, routePrefix) {
    //currrentPath: klasörün tam yolu
    //Users/kader/project/routes
    //routePrefix: URL tarafındaki prefix.
    //Route’ları ekleyeceğimiz Express router.
    //"/admin/settings"
  const files = fs.readdirSync(currentPath); // klasör içindeki dosyaları okur.
  files.forEach((file) => {
    const filePath = path.join(currentPath, file);
    //dosyanın tam yolunu olusturuyoruz.
    //Users/kader/project/routes/admin/settings.js
    const stats = fs.statSync(filePath); //dosya mı klasör mü bunun bilgisini alıyoruz.
    if (stats.isDirectory()) {
      // eğer dosya bir klasör ise
      loadRoutes(router, filePath, `${routePrefix}/${file}`); // klasör içindeki dosyaları yükle
      //Buna recursive function denir.
      //örneğin routes/admin/dashboard.js
      //routePrefix = ""
      //file = "admin"
      //loadRoutes(router, "/routes/admin", "/admin");
      //dashboard.js dosyası artık böyle oluyor.
      ///admin/dashboard
      return;
    }
    if (!file.endsWith(".js") && !file.endsWith(".ts")) return; // eğer dosya bir js ve ts dosyası değilse return(guard clause)
    const route = require(filePath); // dosyayı yükle
    const routeName = file.replace(".js", "").replace(".ts", "");
    
    const routePath =
      routeName === "index"
        ? routePrefix || "/"
        : `${routePrefix}/${routeName}`;
        //burda routePath'i oluşturuyoruz.
        //admin/settings
       // routes/user.js → /user
       // routes/admin/dashboard.js → /admin/dashboard

    // eğer routeName 'index' ise routePrefix'i kullanıyoruz, aksi takdirde routeName'i kullanıyoruz
    // eğer routePrefix boşsa '/' kullanıyoruz
    router.use(routePath, route); // route'u router'a ekle
  }); // klasör içindeki dosyaları yükle
}
module.exports = autoRoutes;
