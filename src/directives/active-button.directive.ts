import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[activeBtn]' })
export class ActiveBtnDirective {

    constructor(private el: ElementRef) { }

    @HostListener('mousedown')
    @HostListener('touchstart')    
    onmousedown(){
        this.el.nativeElement.classList.add('btn-active');
    }

    @HostListener('mouseup')
    @HostListener('mouseleave')
    @HostListener('touchend')    
    onmouseup(){
        this.el.nativeElement.classList.remove('btn-active');
    }
}