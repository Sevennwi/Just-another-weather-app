let userLang = navigator.language || navigator.userLanguage;
console.log("The language is: " + userLang);
if (!sessionStorage.getItem("fr") && userLang.includes("fr")) {
  sessionStorage.setItem("fr", "Yes");
  window.location.replace("/Lang/fr.html");
} else if (!sessionStorage.getItem("en")) {
  sessionStorage.setItem("en", "Yes");
  window.location.replace("../index.html");
}