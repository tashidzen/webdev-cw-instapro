import {user, posts } from "../index.js";
import {POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { deletePost } from "../api.js";
import { renderPostsPageComponent } from "./posts-page-component.js";

// Функция для инициализации обработчиков удаления
export function initDeleteButton() {
  const deleteButton = document.querySelectorAll('.delete-button');
  
  deleteButton.forEach(button => {
    button.addEventListener('click', () => {
    // event.stopPropagation();
      
      const postId = button.dataset.postId;
    //   const index = button.dataset.index;
      
      if (!postId) return;
      
      // Подтверждение удаления
      if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
        return;
      }
      
      try {
        const response = deletePost({ 
          token: `Bearer ${user.token}`,
          postId: postId 
        });
        
        if (response) {
          // Удаляем пост из массива posts
          const postIndex = posts.findIndex(post => post.id === postId);
          if (postIndex !== -1) {
            posts.splice(postIndex, 1);
          }
          
          const appEl = document.getElementById('app');
          
          // Определяем текущую страницу для перерендера
          let currentPage = POSTS_PAGE;
          let userId = null;
          
          // Проверяем, на странице пользователя ли мы
          const urlParams = new URLSearchParams(window.location.search);
          if (window.location.pathname.includes('user-posts') || urlParams.has('userId')) {
            currentPage = USER_POSTS_PAGE;
            userId = urlParams.get('userId');
          }
          
          renderPostsPageComponent({
            appEl: appEl,
            currentPage: currentPage,
            userId: userId
          });
          
          alert('Пост успешно удалён');
          
        } else {
          alert('Не удалось удалить пост');
        }
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        alert('Произошла ошибка при удалении поста');
      }
    });
  });
}