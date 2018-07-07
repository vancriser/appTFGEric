import { Component, Input } from '@angular/core';

@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent {

  @Input('expanded') expanded;
  @Input('expandHeight') expandHeight;

  currentHeight: number = 0;

  constructor() {
    console.log('Hello ExpandableComponent Component');
  }

  ngAfterViewInit(){
    console.log(this.expanded);
    console.log(this.expandHeight);

    
  }

}
