
interface sharedCtx {
    sharedData: Record<string, any>;
    getData: (key: string) => any;
    setData: (key: string, value: any) => void;
}


export interface Module {
    name: string;
    init: (pubCtx: sharedCtx) => void;
}

// shared kv context
export class ModuleManager {
    private sharedContext: sharedCtx;
    private modules: Map<string, Module>;

    constructor() {
        this.sharedContext = {
            sharedData: {},
            getData(key: string) {
                return this.sharedData[key];
            },
            setData(key, value) {
                this.sharedData[key] = value;
            },
        }
        this.modules = new Map();
    }
    registerModule(module: Module | Module[]) {
        const regSingleMod = (module: Module) => {
            if (this.modules.has(module.name)) {
                throw new EvalError(`Module has already a name "${module.name}"`);
            }

            //init shared context
            module.init(this.sharedContext)
            
            this.modules.set(module.name, module);
        }
        if (!Array.isArray(module)) {
            regSingleMod(module)
        } else {
            for (const mod of (module as Module[])) {
                regSingleMod(mod);
            }
        }
    }
    getSharedData(key: string) {
        this.sharedContext.getData(key);
    }
    setSharedData(key: string, value: any) {
        this.sharedContext.setData(key, value);
    }
}

