// import { EventEmitter } from '@angular/core';
// import { GraphEditorInputMode, Key, ModifierKeys } from 'yfiles';

// class GraphEditorInputModePersonalized extends GraphEditorInputMode {
//     itemsDeleting = new EventEmitter();
//     constructor() {

//         super();


//         this.keyboardInputMode.addKeyBinding(
//             Key.DELETE,
//             ModifierKeys.NONE,
//             () => {
//                 this.handleDeleteKeyPress();
//                 return true;
//             }
//         )
//     }

//     handleDeleteKeyPress(): void {
//         // A dialog box service may be an alternative
//         const userConfirmed = window.confirm('Are you sure you want to delete the selected item(s)?');
        
//         // if (userConfirmed) {
//         //     super.deleteSelection();
//         // }
//         this.itemsDeleting.emit('something');
//     }
//     deleteSelectedItems() {
//         super.deleteSelection();
//     }
//     clearSelectedItems() {
//         super.clearSelection();
//     }
// }

// export default GraphEditorInputModePersonalized;