export declare class TranslateService {
    private readonly logger;
    private translate;
    constructor();
    translateText(text: string, targetLang?: string, sourceLang?: string): Promise<string>;
    translateBatch(texts: string[], targetLang?: string, sourceLang?: string): Promise<string[]>;
}
