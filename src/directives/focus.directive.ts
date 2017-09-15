import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[focus]',
})
export class FocusDirective {
    
    @Input() className: string;

    constructor(private el: ElementRef){}

    @HostListener('focus')
    onfocus(){
        this.el.nativeElement.parentElement.classList.add(this.className);
    }

    @HostListener('focusout')
    onfocusout(){
        this.el.nativeElement.parentElement.classList.remove(this.className);
    }
}