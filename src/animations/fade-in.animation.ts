import { transition, trigger, animate, style } from '@angular/animations';

export const FadeInAnimation = trigger('fade_in', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('.5s ease-out', style({ opacity: 1 })),
    ])
]);