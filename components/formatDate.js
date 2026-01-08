import { formatDistanceToNow } from "https://esm.sh/date-fns";
import { ru } from "https://esm.sh/date-fns/locale";

export function formatDate(date) {
    const formDate = new Date(date);
    
    // Проверяем, что дата валидна
    if (isNaN(formDate.getTime())) {
      return 'недавно';
    }
    
    return formatDistanceToNow(formDate, { 
      addSuffix: true,
      locale: ru
    });
}