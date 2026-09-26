const form = document.querySelector(".auth-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (form.dataset.action === "signin") {
    fetch("http://127.0.0.1:3000/user/signin", {
      method: "POST",
      body: new FormData(form),
      credentials: "include",
    });
  } else if (form.dataset.action === "signup") {
    fetch("http://127.0.0.1:3000/user/signup", {
      method: "POST",
      body: new FormData(form),
      credentials: "include",
    });
  }
  // Здесь добавьте запрос: form.dataset.action содержит signup или signin.
  // Данные полей доступны через new FormData(form).
  // Пока переход работает как заглушка; после подключения API выполняйте его при успехе запроса.
  // window.location.href = 'home.html';
});
