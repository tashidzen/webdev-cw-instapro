import { likePost, unlikePost } from "../api.js";
import { posts, user} from "../index.js";
import { renderPostsPageComponent } from "./posts-page-component.js";
import { updatePosts } from "./updatePosts.js";

export const initLikes = () => {
    const likeStatus = document.querySelectorAll('.like-button');
    
    for (const likeStat of likeStatus) {
        likeStat.addEventListener('click', (event) => {
            event.stopPropagation();

            if (!user) {
                alert("Функционал оценки доступен только авторизованным пользователям.");
                return;
            }

            const token = `Bearer ${user.token}`;
            const index = parseInt(likeStat.dataset.index);
            const postId = likeStat.dataset.postId;
            likeStat.disabled = true;
            const currentPost = posts[index];
            const appEl = document.getElementById("app");

            if (currentPost.isLiked === false) {
                console.log(`Ставим лайк на пост ${postId}`);
                likePost({ token, postId })
                .then((response) => {
                    console.log("Получен ответ от API:", response);
                    posts[index].isLiked = response.post.isLiked;
                    posts[index].likes = response.post.likes;
                    updatePosts(posts);
                    renderPostsPageComponent({ appEl });
                })
                .catch((error) => {
                    console.error("Ошибка:", error);
                    alert(`Ошибка: ${error.message}`);
                    likeStat.disabled = false;
                    });
            } else {
                console.log(`Убираем лайк на пост ${postId}`);
                unlikePost({ token, postId })
                .then((response) => {
                    console.log("Получен ответ от API:", response);
                    posts[index].isLiked = response.post.isLiked;
                    posts[index].likes = response.post.likes;
                    updatePosts(posts);
                    renderPostsPageComponent({ appEl });
                })
                .catch((error) => {
                    console.error("Ошибка:", error);
                    alert(`Ошибка: ${error.message}`);
                    likeStat.disabled = false;
                    });
            }
        });
    }
};