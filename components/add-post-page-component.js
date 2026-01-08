import { renderUploadImageComponent } from "./upload-image-component.js";
import { replace } from "./replaceAll.js";
import { goToPage, logout, user } from "../index.js";
import { AUTH_PAGE, POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // страница добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container">      
        <div class="page-header">
          <h1 class="logo">instapro</h1>
            <button class="header-button add-or-login-button">
              <div title="Добавить пост" class="add-post-sign"></div>
            </button>
          <div class="header-buttons-container">
          <button title="Админ" class="header-button logout-button">Выйти</button>
          <button class="header-button my-page-button">Моя страница</button>
          </div>
        </div>
      </div>
        <div class="form">
                <h3 class="form-title">Добавить пост</h3>
                <div class="form-inputs">
                  <div class="upload-image-container">

                  </div>
                  <label>
                    Опишите фотографию:
                    <textarea class="input textarea" rows="4" id="description-text"></textarea>
                    </label>
                    <button class="button" id="add-button">Добавить</button>
                </div>
        </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionText = document.getElementById("description-text").value;

      if (!imageUrl) {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      if (!descriptionText) {
        alert("Пожалуйста, добавьте описание");
        return;
      }

      onAddPostClick({
        description: replace(descriptionText),
        imageUrl: imageUrl,
      });
    });

        /**
     * Обработчик клика по логотипу.
     * Перенаправляет на страницу с постами.
     */
    document.querySelector(".logo").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });

    /**
   * Обработчик клика по моей странице.
   * Перенаправляет на страницу с постами текущего пользователя.
   */
    document.querySelector(".my-page-button").addEventListener("click", () => {
        if (user) {
          goToPage(USER_POSTS_PAGE, {
            userId: user._id,
          });
          }else{
            goToPage(AUTH_PAGE);
          }
      });

    /**
      * Обработчик клика по кнопке "Выйти".
      * Если кнопка существует (т.е. пользователь авторизован), вызывает функцию `logout`.
      */
    document.querySelector(".logout-button")?.addEventListener("click", logout);
  };

  render();
}
