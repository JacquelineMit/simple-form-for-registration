const addUserForm = document.querySelector("#add-user-form");
const usersList = document.querySelector("#users-list");
const userRowTemplate = document.querySelector("#user-row-template");
const emptyState = usersList.firstElementChild.cloneNode(true);

// Пустые функции для будущей реализации работы с пользователями.
async function addUser(user) {
  await fetch("http://127.0.0.1:3000/user/create", {
    method: "POST",
    body: user,
    credentials: "include",
  });
  await fetchUsers();
}

async function deleteUser(id) {
  const formData = new FormData();
  formData.append("id", id);

  await fetch("http://127.0.0.1:3000/user/delete", {
    method: "DELETE",
    body: formData,
    credentials: "include",
  });
  fetchUsers();
}

async function editUser(id, user) {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("gender", user.gender);
  await fetch("http://127.0.0.1:3000/user/update", {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  fetchUsers();
}

async function fetchUsers() {
  const fet = await fetch("http://127.0.0.1:3000/users/get", {
    method: "GET",
    credentials: "include",
  });
  const data = await fet.json();
  renderUsers(data.result);
}

addUserForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addUserForm);
  addUser(formData);
});

// Вызовите после получения списка. Поля пользователя: id, nickname, email, gender, phone.
function renderUsers(users) {
  usersList.replaceChildren();

  if (users.length === 0) {
    usersList.append(emptyState.cloneNode(true));
    return;
  }

  users.forEach((user) => {
    const row = userRowTemplate.content.firstElementChild.cloneNode(true);
    const fields = [...row.querySelectorAll("input, select")];
    const editButton = row.querySelector('[data-action="edit"]');
    const saveButton = row.querySelector('[data-action="save"]');
    const cancelButton = row.querySelector('[data-action="cancel"]');
    const deleteButton = row.querySelector('[data-action="delete"]');

    function restoreValues() {
      fields.forEach((field) => {
        field.value = user[field.name] ?? "";
      });
    }

    function setEditing(editing) {
      fields.forEach((field) => {
        if (field.tagName === "SELECT") {
          field.disabled = !editing;
        } else {
          field.readOnly = !editing;
        }
      });
      editButton.hidden = editing;
      saveButton.hidden = !editing;
      cancelButton.hidden = !editing;
    }

    editButton.addEventListener("click", () => {
      setEditing(true);
      fields[0].focus();
    });

    cancelButton.addEventListener("click", () => {
      restoreValues();
      setEditing(false);
      editButton.focus();
    });

    saveButton.addEventListener("click", () => {
      const changes = Object.fromEntries(
        fields.map((field) => [field.name, field.value]),
      );
      editUser(user.id, changes);
    });

    console.log("--> user", user);
    deleteButton.addEventListener("click", () => deleteUser(user.id));

    restoreValues();
    usersList.append(row);
  });
}

fetchUsers();
