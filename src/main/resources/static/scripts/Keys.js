class LibKeys{
    constructor() {
        this.KeysDownList = [];
        this.VK_LBUTTON = 0x01; //Левая кнопка мыши
        this.VK_RBUTTON = 0x02; //Правая кнопка мыши
        this.VK_CANCEL = 0x03; //Обработка Control-break
        this.VK_MBUTTON = 0x04; //Средняя кнопка мыши
        this.VK_XBUTTON1 = 0x05; //кнопка мыши X1
        this.VK_XBUTTON2 = 0x06; //кнопка мыши X2
        this.VK_BACK = 0x08; //BACKSPACE key
        this.VK_TAB = 0x09; //TAB key
        this.VK_CLEAR = 0x0C; //CLEAR key
        this.VK_RETURN = 0x0D; //ENTER key
        this.VK_SHIFT = 0x10; //SHIFT key
        this.VK_CONTROL = 0x11; //CTRL key
        this.VK_MENU = 0x12; //ALT key
        this.VK_PAUSE = 0x13; //PAUSE key
        this.VK_CAPITAL = 0x14; //CAPS LOCK key
        this.VK_KANA = 0x15; //Input Method Editor (IME) Kana mode
        this.VK_HANGUEL = 0x15; //IME Hanguel mode (maintained for compatibility; use VK_HANGUL)
        this.VK_HANGUL = 0x15; //IME Hangul mode
        this.VK_JUNJA = 0x17; //IME Junja mode
        this.VK_FINAL = 0x18; //IME final mode
        this.VK_HANJA = 0x19; //IME Hanja mode
        this.VK_KANJI = 0x19; //IME Kanji mode
        this.VK_ESCAPE = 0x1B; //ESC key
        this.VK_CONVERT = 0x1C; //IME convert (Reserved for Kanji systems)
        this.VK_NONCONVERT = 0x1D; //IME nonconvert (Reserved for Kanji systems)
        this.VK_ACCEPT = 0x1E; //IME accept (Reserved for Kanji systems)
        this.VK_MODECHANGE = 0x1F; //IME mode change request (Reserved for Kanji systems)
        this.VK_SPACE = 0x20; //Пробел
        this.VK_PRIOR = 0x21; //PAGE UP key
        this.VK_NEXT = 0x22; //PAGE DOWN key
        this.VK_END = 0x23; //END key
        this.VK_HOME = 0x24; //HOME key
        this.VK_LEFT = 0x25; //LEFT ARROW key
        this.VK_UP = 0x26; //UP ARROW key
        this.VK_RIGHT = 0x27; //RIGHT ARROW key
        this.VK_DOWN = 0x28; //DOWN ARROW key
        this.VK_SELECT = 0x29; //SELECT key
        this.VK_PRINT = 0x2A; //PRINT key
        this.VK_EXECUTE = 0x2B; //EXECUTE key
        this.VK_SNAPSHOT = 0x2C; //PRINT SCREEN key for Windows 3.0 and later
        this.VK_INSERT = 0x2D; //INS key
        this.VK_DELETE = 0x2E; //DEL key
        this.VK_HELP = 0x2F; //HELP key
        this.VK_0 = 0x30; //0 key
        this.VK_1 = 0x31; //1 key
        this.VK_2 = 0x32; //2 key
        this.VK_3 = 0x33; //3 key
        this.VK_4 = 0x34; //4 key
        this.VK_5 = 0x35; //5 key
        this.VK_6 = 0x36; //6 key
        this.VK_7 = 0x37; //7 key
        this.VK_8 = 0x38; //8 key
        this.VK_9 = 0x39; //9 key
        this.VK_A = 0x41; //A key
        this.VK_B = 0x42; //B key
        this.VK_C = 0x43; //C key
        this.VK_D = 0x44; //D key
        this.VK_E = 0x45; //E key
        this.VK_F = 0x46; //F key
        this.VK_G = 0x47; //G key
        this.VK_H = 0x48; //H key
        this.VK_I = 0x49; //I key
        this.VK_J = 0x4A; //J key
        this.VK_K = 0x4B; //K key
        this.VK_L = 0x4C; //L key
        this.VK_M = 0x4D; //M key
        this.VK_N = 0x4E; //N key
        this.VK_O = 0x4F; //O key
        this.VK_P = 0x50; //P key
        this.VK_Q = 0x51; //Q key
        this.VK_R = 0x52; //R key
        this.VK_S = 0x53; //S key
        this.VK_T = 0x54; //T key
        this.VK_U = 0x55; //U key
        this.VK_V = 0x56; //V key
        this.VK_W = 0x57; //W key
        this.VK_X = 0x58; //X key
        this.VK_Y = 0x59; //Y key
        this.VK_Z = 0x5A; //Z key
        this.VK_LWIN = 0x5B; //Left Windows key (Microsoft Natural Keyboard)
        this.VK_RWIN = 0x5C; //Right Windows key (Microsoft Natural Keyboard)
        this.VK_APPS = 0x5D; //Applications key (Microsoft Natural Keyboard)
        this.VK_SLEEP = 0x5F; //Computer Sleep key
        this.VK_NUMPAD0 = 0x60; //Numeric keypad 0 key
        this.VK_NUMPAD1 = 0x61; //Numeric keypad 1 key
        this.VK_NUMPAD2 = 0x62; //Numeric keypad 2 key
        this.VK_NUMPAD3 = 0x63; //Numeric keypad 3 key
        this.VK_NUMPAD4 = 0x64; //Numeric keypad 4 key
        this.VK_NUMPAD5 = 0x65; //Numeric keypad 5 key
        this.VK_NUMPAD6 = 0x66; //Numeric keypad 6 key
        this.VK_NUMPAD7 = 0x67; //Numeric keypad 7 key
        this.VK_NUMPAD8 = 0x68; //Numeric keypad 8 key
        this.VK_NUMPAD9 = 0x69; //Numeric keypad 9 key
        this.VK_MULTIPLY = 0x6A; //Multiply key (*)
        this.VK_ADD = 0x6B; //Add key (+)
        this.VK_SEPARATOR = 0x6C; //Separator key
        this.VK_SUBTRACT = 0x6D; //Subtract key (-)
        this.VK_DECIMAL = 0x6E; //Decimal key
        this.VK_DIVIDE = 0x6F; //Divide key (/)
        this.VK_F1 = 0x70; //F1 key
        this.VK_F2 = 0x71; //F2 key
        this.VK_F3 = 0x72; //F3 key
        this.VK_F4 = 0x73; //F4 key
        this.VK_F5 = 0x74; //F5 key
        this.VK_F6 = 0x75; //F6 key
        this.VK_F7 = 0x76; //F7 key
        this.VK_F8 = 0x77; //F8 key
        this.VK_F9 = 0x78; //F9 key
        this.VK_F10= 0x79; //F10 key
        this.VK_F11= 0x7A; //F11 key
        this.VK_F12= 0x7B; //F12 key
        this.VK_F13= 0x7C; //F13 key
        this.VK_F14= 0x7D; //F14 key
        this.VK_F15= 0x7E; //F15 key
        this.VK_F16= 0x7F; //F16 key
        this.VK_F17= 0x80; //F17 key
        this.VK_F18= 0x81; //F18 key
        this.VK_F19= 0x82; //F19 key
        this.VK_F20= 0x83; //F20 key
        this.VK_F21= 0x84; //F21 key
        this.VK_F22= 0x85; //F22 key
        this.VK_F23= 0x86; //F23 key
        this.VK_F24= 0x87; //F24 key
        this.VK_NUMLOCK = 0x90; //NUM LOCK key
        this.VK_SCROLL = 0x91; //SCROLL LOCK key
        this.VK_OEM_NEC_EQUAL = 0x92; //NEC PC-9800 kbd definitions: '=' key on numpad
        this.VK_OEM_FJ_JISHO = 0x92; //Fujitsu/OASYS kbd definitions: 'Dictionary' key
        this.VK_OEM_FJ_MASSHOU = 0x93; //Fujitsu/OASYS kbd definitions: 'Unregister word' key
        this.VK_OEM_FJ_TOUROKU = 0x94; //Fujitsu/OASYS kbd definitions: 'Register word' key
        this.VK_OEM_FJ_LOYA = 0x95; //Fujitsu/OASYS kbd definitions: 'Left OYAYUBI' key
        this.VK_OEM_FJ_ROYA = 0x96; //Fujitsu/OASYS kbd definitions: 'Right OYAYUBI' key
        this.VK_LSHIFT = 0xA0; //Left SHIFT key
        this.VK_RSHIFT = 0xA1; //Right SHIFT key
        this.VK_LCONTROL = 0xA2; //Left CONTROL key
        this.VK_RCONTROL = 0xA3; //Right CONTROL key
        this.VK_LMENU = 0xA4; //Left MENU key
        this.VK_RMENU = 0xA5; //Right MENU key
        this.VK_BROWSER_BACK = 0xA6; //Browser Back key
        this.VK_BROWSER_FORWARD = 0xA7; //Browser Forward key
        this.VK_BROWSER_REFRESH = 0xA8; //Browser Refresh key
        this.VK_BROWSER_STOP = 0xA9; //Browser Stop key
        this.VK_BROWSER_SEARCH = 0xAA; //Browser Search key
        this.VK_BROWSER_FAVORITES = 0xAB; //Browser Favorites key
        this.VK_BROWSER_HOME = 0xAC; //Browser Start and Home key
        this.VK_VOLUME_MUTE = 0xAD; //Volume Mute key
        this.VK_VOLUME_DOWN = 0xAE; //Volume Down key
        this.VK_VOLUME_UP =0xAF; //Volume Up key
        this.VK_MEDIA_NEXT_TRACK = 0xB0; //Next Track key
        this.VK_MEDIA_PREV_TRACK = 0xB1; //Previous Track key
        this.VK_MEDIA_STOP = 0xB2; //Stop Media key
        this.VK_MEDIA_PLAY_PAUSE = 0xB3; //Play/Pause Media key
        this.VK_LAUNCH_MAIL = 0xB4; //Start Mail key
        this.VK_LAUNCH_MEDIA_SELECT = 0xB5; //Select Media key
        this.VK_LAUNCH_APP1 = 0xB6; //Start Application 1 key
        this.VK_LAUNCH_APP2 = 0xB7; //Start Application 2 key
        this.VK_OEM_1 = 0xBA; //For the US standard keyboard, the ';:' key
        this.VK_OEM_PLUS = 0xBB; //For any country/region, the '+' key
        this.VK_OEM_COMMA = 0xBC; //For any country/region, the ',' key
        this.VK_OEM_MINUS = 0xBD; //For any country/region, the '-' key
        this.VK_OEM_PERIOD = 0xBE; //For any country/region, the '.' key
        this.VK_OEM_2 = 0xBF; //For the US standard keyboard, the '/?' key
        this.VK_OEM_3 = 0xC0; //For the US standard keyboard, the '`~' key
        this.VK_OEM_4 = 0xDB; //For the US standard keyboard, the '[{' key
        this.VK_OEM_5 = 0xDC; //For the US standard keyboard, the '\|' key
        this.VK_OEM_6 = 0xDD; //For the US standard keyboard, the ']}' key
        this.VK_OEM_7 = 0xDE; //For the US standard keyboard, the 'single-quote/double-quote' key
        this.VK_OEM_8 = 0xDF; //Used for miscellaneous characters; it can vary by keyboard.
        this.VK_OEM_102 = 0xE2; //Either the angle bracket key or the backslash key on the RT 102-key keyboard
        this.VK_PROCESSKEY = 0xE5; //IME PROCESS key
        this.VK_PACKET = 0xE7; //Used to pass Unicode characters as if they were keystrokes. The VK_PACKET key is the low word of a 32-bit Virtual Key value used for non-keyboard input methods. For more information, see Remark in KEYBDINPUT, SendInput, WM_KEYDOWN, and WM_KEYUP
        this.VK_OEM_RESET = 0xE9; //Only used by Nokia.
        this.VK_OEM_JUMP = 0xEA; //Only used by Nokia.
        this.VK_OEM_PA1 = 0xEB; //Only used by Nokia.
        this.VK_OEM_PA2 = 0xEC; //Only used by Nokia.
        this.VK_OEM_PA3 = 0xED; //Only used by Nokia.
        this.VK_OEM_WSCTRL = 0xEE; //Only used by Nokia.
        this.VK_OEM_CUSEL = 0xEF; //Only used by Nokia.
        this.VK_OEM_ATTN = 0xF0; //Only used by Nokia.
        this.VK_OEM_FINNISH = 0xF1; //Only used by Nokia.
        this.VK_OEM_COPY = 0xF2; //Only used by Nokia.
        this.VK_OEM_AUTO = 0xF3; //Only used by Nokia.
        this.VK_OEM_ENLW = 0xF4; //Only used by Nokia.
        this.VK_OEM_BACKTAB = 0xF5; //Only used by Nokia.
        this.VK_ATTN = 0xF6; //Attn key
        this.VK_CRSEL = 0xF7; //CrSel key
        this.VK_EXSEL = 0xF8; //ExSel key
        this.VK_EREOF = 0xF9; //Erase EOF key
        this.VK_PLAY = 0xFA;//Play key
        this.VK_ZOOM = 0xFB;//Zoom key
        this.VK_NONAME = 0xFC; //Reserved for future use.
        this.VK_PA1 = 0xFD; //PA1 key
        this.VK_OEM_CLEAR =0xFE; //Clear key
    }
    InitKeys(){
        window.document.addEventListener("keydown", function(event){ this.KeyDown(event.keyCode); }.bind(this), false)
        window.document.addEventListener("keyup", function(event){ this.KeyUp(event.keyCode); }.bind(this), false)
        window.document.addEventListener("blur", function(event){ this.KeysDownList = [] }.bind(this), false)
    }
    KeyDown(key){
        if(this.KeysDownList.indexOf(key, 0)==-1){
            this.KeysDownList.push(key);
        }
    }
    KeyUp(key){
        let index = this.KeysDownList.indexOf(key, 0)
        if(index!=-1) {
            this.KeysDownList.splice(index, 1);
        }
    }
    isKeyDown(key){
        return this.KeysDownList.indexOf(key, 0)!=-1;
    }
}
Keys = new LibKeys();