import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import {
  ADD_POSTS_PAGE,
  POSTS_PAGE,
} from "./routes.js";
import { getToken, goToPage } from "./index.js";

const personalKey = "natalya-gromova";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    return response.json();
  }).catch((error) => {
    console.error("Детали ошибки:", {
      message: error.message,
      file: file.name,
      size: file.size,
      type: file.type
    });
    
    // Сброс состояния кнопки

      const appEl = document.getElementById("app");
      renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
              //добавление поста в API
              console.log("Добавляю пост...", { description, imageUrl });
      
              const personalKey = "natalya-gromova";
              const baseHost = "https://wedev-api.sky.pro";
              const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
      
              fetch(postsHost, {
                method: "POST",
                headers: {
                  Authorization: getToken(),
                },
                body: JSON.stringify({
                  description: description,
                  imageUrl: imageUrl,
                }),
              })
                .then((response) => {
                  // Проверяем статус ответа
                  if (response.status === 400) {
                    throw new Error("Неверные данные формы отправки");
                  }
                  if (response.status === 500) {
                    throw new Error("Ошибка сервера");
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log("Пост успешно добавлен:", data);
                  // Возвращаемся на главную страницу с постами
                  goToPage(POSTS_PAGE);
                })
                .catch((error) => {
                  console.error("Ошибка:", error);
                  goToPage(ADD_POSTS_PAGE);
                  alert(`Ошибка при добавлении поста: ${error.message}`);         
            });
          },
        });

      // labelEl.textContent = "Выберите фото";

    alert(`Ошибка загрузки: Попробуйте другой файл или повторите позже.`);
  });
}

export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
}

export function unlikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
}

export function deletePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
}
