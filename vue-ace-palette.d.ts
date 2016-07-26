    export interface CommandPalette {
        new (options?:any):CommandPalette
        visible: boolean;
        commands: any[];
        query: string;
        activeCmd: number;
        //currentFocusNode: any;
        //oldCommands: any[];
       // watch_visible(newValue: any, oldVal: any): void;
        addCommands(newCommands: any): void;
        clearCommands(): void;
        getCommands(): any[];
       // ready(): void;
        filteredCommands: any[];
       // filterStartCaseName(value: any, index: any, array: any): boolean;
       // addNewCommands(newCommands: any): void;
       // paletteInputKeyHandler(e: any): void;
       // moveSelectUp(): void;
       // moveSelectDown(): void;
       // finish(): void;
        close(): void;
        open(): void;
       // useSelection(selection: any): void;
       // clickCommand(selection: any): void;
       // parseTextCommand(query: any): void;
       // drHighlight(value: any): any;
    }

// declare module "vue-ace-palette"{
//     export=VueAcePalette
// }