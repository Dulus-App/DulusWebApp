import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PopoverComponent } from './popover/popover.component';
import { HeaderToolbarBtnsComponent } from './header-toolbar-btns/header-toolbar-btns.component';

@NgModule({
    declarations: [
        PopoverComponent,
        HeaderToolbarBtnsComponent
    ],
    exports: [
        PopoverComponent,
        HeaderToolbarBtnsComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class MyComponentsModule {}