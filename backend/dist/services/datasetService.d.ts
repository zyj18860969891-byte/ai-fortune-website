export declare class DatasetService {
    private apiKey;
    private baseUrl;
    private datasets;
    private localDataPath;
    constructor(apiKey: string);
    /**
     * 从本地加载数据集
     * @param datasetId 数据集ID
     */
    private loadLocalDataset;
    /**
     * 加载指定的数据集
     * @param datasetId 数据集ID
     * @param subsetName 子集名称
     */
    loadDataset(datasetId: string, subsetName?: string): Promise<any[]>;
    /**
     * 根据关键词搜索数据集中的相关内容
     * @param dataset 数据集
     * @param keywords 关键词
     */
    searchDataset(dataset: any[], keywords: string[]): any[];
    /**
     * 获取随机数据项
     * @param dataset 数据集
     * @param count 数量
     */
    getRandomItems(dataset: any[], count?: number): any[];
    /**
     * 预加载常用数据集
     */
    preloadDatasets(): Promise<void>;
}
//# sourceMappingURL=datasetService.d.ts.map