import {defineConfig} from "vite";

defineConfig({
    base : "/2023_Projet_Tutore_Application_Web_3D",
    proxy : {
        "/2023_Projet_Tutore_Application_Web_3D" : "/index.html",
        "/2023_Projet_Tutore_Application_Web_3D/documentation.html" : "/documentation.html",
    },
})